import {
  DEFAULT_LANGUAGE,
  GENERATED_ROOM_SLUG_ALPHABET,
  GENERATED_ROOM_SLUG_LENGTH,
  ROOM_VISIBILITIES,
  SUPPORTED_LANGUAGES,
  isReservedRoomSlug,
  normalizeRoomSlug,
  type RoomAccessLevel,
  type RoomAccessRequest,
  type RoomAccessResponse,
  type RoomCreateRequest,
  type RoomMetadataResponse,
  type RoomSettingsRequest,
  type RoomSnapshot,
  type SupportedLanguage
} from "@codeshare/shared";
import bcrypt from "bcrypt";
import { randomInt } from "node:crypto";
import { z } from "zod";

import { env } from "../config/env.js";
import { AppError } from "../lib/app-error.js";
import { RoomModel, type RoomDocument } from "../models/room.model.js";
import { applyCodeChanges } from "../utils/code.js";
import { buildExpiryDate, buildInactiveDeleteDate, normalizeExpiryHours } from "../utils/expiry.js";
import { generateOpaqueToken, hashOpaqueToken, verifyOpaqueToken } from "../utils/crypto.js";
import { signAccessToken } from "../utils/jwt.js";
import { getInitialCode } from "../utils/templates.js";

const slugSchema = z
  .string()
  .trim()
  .min(3)
  .max(64)
  .regex(/^[a-z0-9][a-z0-9-_]*$/i, "Room names can only contain letters, numbers, hyphens, and underscores.");

export const createRoomSchema = z
  .object({
    visibility: z.enum(ROOM_VISIBILITIES),
    password: z.string().min(8).max(120).optional(),
    expiryHours: z.coerce.number().positive(),
    language: z.enum(SUPPORTED_LANGUAGES).optional(),
    initialCode: z.string().max(500_000).optional()
  })
  .superRefine((value, ctx) => {
    if (value.visibility === "private" && !value.password) {
      ctx.addIssue({
        code: "custom",
        message: "Password is required for private rooms.",
        path: ["password"]
      });
    }
  });

export const accessRoomSchema = z.object({
  password: z.string().min(1).optional(),
  ownerToken: z.string().min(16).optional(),
  viewerKey: z.string().min(16).optional()
});

export const updateRoomSchema = z
  .object({
    visibility: z.enum(ROOM_VISIBILITIES),
    password: z.string().min(8).max(120).optional(),
    expiryHours: z.coerce.number().positive(),
    language: z.enum(SUPPORTED_LANGUAGES)
  });

type PersistedSnapshot = {
  code: string;
  language: SupportedLanguage;
};

type SnapshotOptions = {
  accessLevel: RoomAccessLevel;
  isOwner: boolean;
  viewerKey: string;
};

const GENERATED_SLUG_ATTEMPTS = 24;

function isDuplicateKeyError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === 11000;
}

export class RoomService {
  constructor(private readonly siteUrl: string) {}

  validateSlug(slug: string) {
    return normalizeRoomSlug(slugSchema.parse(slug));
  }

  async getMetadata(slug: string): Promise<RoomMetadataResponse> {
    const normalizedSlug = this.validateSlug(slug);

    if (isReservedRoomSlug(normalizedSlug)) {
      return {
        exists: false,
        slug: normalizedSlug
      };
    }

    const room = await RoomModel.findOne({ slug: normalizedSlug }).lean();

    if (!room) {
      return {
        exists: false,
        slug: normalizedSlug
      };
    }

    return {
      exists: true,
      slug: normalizedSlug,
      visibility: room.visibility,
      expiresAt: room.expiresAt.toISOString()
    };
  }

  async createRoom(slug: string, payload: RoomCreateRequest): Promise<RoomAccessResponse> {
    const normalizedSlug = this.validateSlug(slug);
    const parsed = createRoomSchema.parse(payload);
    const expiryHours = normalizeExpiryHours(parsed.expiryHours, env.ROOM_MAX_EXPIRY_HOURS);
    const language = parsed.language ?? DEFAULT_LANGUAGE;
    const ownerToken = generateOpaqueToken(24);
    const viewerKey = generateOpaqueToken(18);
    const passwordHash =
      parsed.visibility === "private" && parsed.password ? await bcrypt.hash(parsed.password, env.BCRYPT_ROUNDS) : null;
    const createRoomRecord = (roomSlug: string) =>
      RoomModel.create({
        slug: roomSlug,
        visibility: parsed.visibility,
        passwordHash,
        ownerTokenHash: hashOpaqueToken(ownerToken),
        viewerKeyHash: hashOpaqueToken(viewerKey),
        code: parsed.initialCode ?? getInitialCode(language),
        language,
        expiresAt: buildExpiryDate(expiryHours),
        inactiveDeleteAt: buildInactiveDeleteDate(env.ROOM_INACTIVITY_MINUTES),
        lastActivityAt: new Date()
      });

    if (isReservedRoomSlug(normalizedSlug)) {
      for (let attempt = 0; attempt < GENERATED_SLUG_ATTEMPTS; attempt += 1) {
        try {
          const room = await createRoomRecord(this.generateRoomSlug());
          return this.buildCreateResponse(room, ownerToken, viewerKey);
        } catch (error) {
          if (isDuplicateKeyError(error)) {
            continue;
          }

          throw error;
        }
      }

      throw new AppError(503, "Unable to generate a free room URL right now. Please try again.");
    }

    try {
      const room = await createRoomRecord(normalizedSlug);
      return this.buildCreateResponse(room, ownerToken, viewerKey);
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        throw new AppError(409, "That room name is already taken.");
      }

      throw error;
    }
  }

  async accessRoom(slug: string, payload: RoomAccessRequest): Promise<RoomAccessResponse> {
    const normalizedSlug = this.validateSlug(slug);

    if (isReservedRoomSlug(normalizedSlug)) {
      throw new AppError(404, "Room not found.");
    }

    const parsed = accessRoomSchema.parse(payload);
    const room = await RoomModel.findOne({ slug: normalizedSlug });

    if (!room) {
      throw new AppError(404, "Room not found.");
    }

    const isOwner = verifyOpaqueToken(parsed.ownerToken, room.ownerTokenHash);
    const isViewer = verifyOpaqueToken(parsed.viewerKey, room.viewerKeyHash);

    if (room.visibility === "private" && !isOwner && !isViewer) {
      if (!parsed.password || !room.passwordHash) {
        throw new AppError(401, "Password required.");
      }

      const isPasswordValid = await bcrypt.compare(parsed.password, room.passwordHash);

      if (!isPasswordValid) {
        throw new AppError(401, "Incorrect password.");
      }
    }

    const accessLevel: RoomAccessLevel = isOwner ? "owner" : isViewer ? "viewer" : "editor";

    await this.touchRoom(room._id.toString());

    return {
      room: this.toSnapshot(room, {
        accessLevel,
        isOwner,
        viewerKey: ""
      }),
      accessToken: signAccessToken(
        {
          roomId: room._id.toString(),
          slug: room.slug,
          accessLevel
        },
        room.expiresAt
      ),
      accessLevel
    };
  }

  async updateRoomSettings(slug: string, payload: RoomSettingsRequest, ownerToken: string | undefined) {
    const normalizedSlug = this.validateSlug(slug);

    if (isReservedRoomSlug(normalizedSlug)) {
      throw new AppError(404, "Room not found.");
    }

    const parsed = updateRoomSchema.parse({
      ...payload,
      password: typeof payload.password === "string" ? payload.password.trim() || undefined : undefined
    });
    const room = await RoomModel.findOne({ slug: normalizedSlug });

    if (!room) {
      throw new AppError(404, "Room not found.");
    }

    this.assertOwner(room, ownerToken);

    const previousVisibility = room.visibility;
    room.visibility = parsed.visibility;
    room.language = parsed.language;
    room.expiresAt = buildExpiryDate(normalizeExpiryHours(parsed.expiryHours, env.ROOM_MAX_EXPIRY_HOURS));
    room.inactiveDeleteAt = buildInactiveDeleteDate(env.ROOM_INACTIVITY_MINUTES);
    room.lastActivityAt = new Date();

    if (parsed.visibility === "private") {
      if (parsed.password) {
        room.passwordHash = await bcrypt.hash(parsed.password, env.BCRYPT_ROUNDS);
      } else if (previousVisibility !== "private" || !room.passwordHash) {
        throw new AppError(400, "Password is required when switching a room to private.");
      }
    } else {
      room.passwordHash = null;
    }

    await room.save();

    return this.toSnapshot(room, {
      accessLevel: "owner",
      isOwner: true,
      viewerKey: ""
    });
  }

  async deleteRoom(slug: string, ownerToken: string | undefined) {
    const normalizedSlug = this.validateSlug(slug);

    if (isReservedRoomSlug(normalizedSlug)) {
      throw new AppError(404, "Room not found.");
    }

    const room = await RoomModel.findOne({ slug: normalizedSlug });

    if (!room) {
      throw new AppError(404, "Room not found.");
    }

    this.assertOwner(room, ownerToken);
    await RoomModel.deleteOne({ _id: room._id });
  }

  async getRoomById(roomId: string) {
    return RoomModel.findById(roomId);
  }

  async touchRoom(roomId: string) {
    await RoomModel.findByIdAndUpdate(roomId, {
      $set: {
        lastActivityAt: new Date(),
        inactiveDeleteAt: buildInactiveDeleteDate(env.ROOM_INACTIVITY_MINUTES)
      }
    });
  }

  async persistSnapshot(roomId: string, snapshot: PersistedSnapshot) {
    await RoomModel.findByIdAndUpdate(roomId, {
      $set: {
        code: snapshot.code,
        language: snapshot.language,
        lastActivityAt: new Date(),
        inactiveDeleteAt: buildInactiveDeleteDate(env.ROOM_INACTIVITY_MINUTES)
      }
    });
  }

  applyChanges(code: string, changes: { rangeOffset: number; rangeLength: number; text: string }[]) {
    return applyCodeChanges(code, changes);
  }

  private toSnapshot(
    room: Pick<
      RoomDocument,
      "_id" | "slug" | "visibility" | "language" | "code" | "expiresAt" | "createdAt" | "updatedAt"
    >,
    options: SnapshotOptions
  ): RoomSnapshot {
    return {
      id: room._id.toString(),
      slug: room.slug,
      visibility: room.visibility,
      language: room.language as SupportedLanguage,
      code: room.code,
      expiresAt: room.expiresAt.toISOString(),
      createdAt: room.createdAt.toISOString(),
      updatedAt: room.updatedAt.toISOString(),
      isOwner: options.isOwner,
      viewerKey: options.viewerKey,
      readOnlyViewerUrl: options.viewerKey ? `${this.siteUrl}/room/${room.slug}?viewer=${options.viewerKey}` : ""
    };
  }

  private assertOwner(room: Pick<RoomDocument, "ownerTokenHash">, ownerToken: string | undefined) {
    if (!verifyOpaqueToken(ownerToken, room.ownerTokenHash)) {
      throw new AppError(403, "Owner token invalid or missing.");
    }
  }

  private buildCreateResponse(
    room: Pick<RoomDocument, "_id" | "slug" | "visibility" | "language" | "code" | "expiresAt" | "createdAt" | "updatedAt">,
    ownerToken: string,
    viewerKey: string
  ): RoomAccessResponse {
    return {
      room: this.toSnapshot(room, {
        accessLevel: "owner",
        isOwner: true,
        viewerKey
      }),
      accessToken: signAccessToken(
        {
          roomId: room._id.toString(),
          slug: room.slug,
          accessLevel: "owner"
        },
        room.expiresAt
      ),
      ownerToken,
      accessLevel: "owner"
    };
  }

  private generateRoomSlug() {
    let slug = "";

    for (let index = 0; index < GENERATED_ROOM_SLUG_LENGTH; index += 1) {
      slug += GENERATED_ROOM_SLUG_ALPHABET[randomInt(GENERATED_ROOM_SLUG_ALPHABET.length)];
    }

    return slug;
  }
}
