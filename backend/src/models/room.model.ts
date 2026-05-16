import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  type RoomVisibility,
  type SupportedLanguage
} from "@codeshare/shared";
import { Schema, model, type InferSchemaType } from "mongoose";

const roomSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 64
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      required: true,
      default: "public"
    },
    passwordHash: {
      type: String,
      default: null
    },
    ownerTokenHash: {
      type: String,
      required: true
    },
    viewerKeyHash: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true,
      default: ""
    },
    language: {
      type: String,
      enum: SUPPORTED_LANGUAGES,
      required: true,
      default: DEFAULT_LANGUAGE
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }
    },
    inactiveDeleteAt: {
      type: Date,
      required: true,
      index: { expires: 0 }
    },
    lastActivityAt: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

roomSchema.index({ lastActivityAt: 1 });

export type RoomDocument = InferSchemaType<typeof roomSchema> & {
  _id: { toString(): string };
  visibility: RoomVisibility;
  language: string;
  createdAt: Date;
  updatedAt: Date;
};

export const RoomModel = model("Room", roomSchema);
