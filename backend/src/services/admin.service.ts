import { MessageModel } from "../models/message.model.js";
import { RoomModel } from "../models/room.model.js";

const CODE_PREVIEW_LIMIT = 8_000;

export type AdminRoomSnapshot = {
  id: string;
  slug: string;
  visibility: "public" | "private";
  language: string;
  codePreview: string;
  codeLength: number;
  codeWasTrimmed: boolean;
  expiresAt: string;
  inactiveDeleteAt: string;
  lastActivityAt: string;
  createdAt: string;
  updatedAt: string;
  passwordProtected: boolean;
  ownerTokenStored: boolean;
  viewerKeyStored: boolean;
};

export type AdminMessageSnapshot = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminDashboardSnapshot = {
  generatedAt: string;
  roomCount: number;
  publicRoomCount: number;
  privateRoomCount: number;
  messageCount: number;
  rooms: AdminRoomSnapshot[];
  messages: AdminMessageSnapshot[];
};

export interface AdminDashboardReader {
  getDashboardSnapshot(): Promise<AdminDashboardSnapshot>;
}

export class AdminService implements AdminDashboardReader {
  async getDashboardSnapshot(): Promise<AdminDashboardSnapshot> {
    const [rooms, messages] = await Promise.all([
      RoomModel.find({})
        .select({
          slug: 1,
          visibility: 1,
          language: 1,
          code: 1,
          expiresAt: 1,
          inactiveDeleteAt: 1,
          lastActivityAt: 1,
          createdAt: 1,
          updatedAt: 1,
          passwordHash: 1,
          ownerTokenHash: 1,
          viewerKeyHash: 1
        })
        .sort({ lastActivityAt: -1, createdAt: -1 })
        .lean(),
      MessageModel.find({})
        .select({
          name: 1,
          email: 1,
          subject: 1,
          message: 1,
          createdAt: 1,
          updatedAt: 1
        })
        .sort({ createdAt: -1 })
        .lean()
    ]);

    const roomSnapshots = rooms.map((room) => {
      const code = String(room.code ?? "");

      return {
        id: String(room._id),
        slug: String(room.slug),
        visibility: room.visibility === "private" ? "private" : "public",
        language: String(room.language),
        codePreview: code.slice(0, CODE_PREVIEW_LIMIT),
        codeLength: code.length,
        codeWasTrimmed: code.length > CODE_PREVIEW_LIMIT,
        expiresAt: new Date(room.expiresAt).toISOString(),
        inactiveDeleteAt: new Date(room.inactiveDeleteAt).toISOString(),
        lastActivityAt: new Date(room.lastActivityAt).toISOString(),
        createdAt: new Date(room.createdAt).toISOString(),
        updatedAt: new Date(room.updatedAt).toISOString(),
        passwordProtected: Boolean(room.passwordHash),
        ownerTokenStored: Boolean(room.ownerTokenHash),
        viewerKeyStored: Boolean(room.viewerKeyHash)
      } satisfies AdminRoomSnapshot;
    });

    const messageSnapshots = messages.map((message) => ({
      id: String(message._id),
      name: String(message.name),
      email: String(message.email),
      subject: String(message.subject),
      message: String(message.message),
      createdAt: new Date(message.createdAt).toISOString(),
      updatedAt: new Date(message.updatedAt).toISOString()
    }));

    return {
      generatedAt: new Date().toISOString(),
      roomCount: roomSnapshots.length,
      publicRoomCount: roomSnapshots.filter((room) => room.visibility === "public").length,
      privateRoomCount: roomSnapshots.filter((room) => room.visibility === "private").length,
      messageCount: messageSnapshots.length,
      rooms: roomSnapshots,
      messages: messageSnapshots
    };
  }
}
