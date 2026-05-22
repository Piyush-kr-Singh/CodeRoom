import { Schema, model, type InferSchemaType } from "mongoose";

const messageSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 255
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    }
  },
  {
    timestamps: true
  }
);

export type MessageDocument = InferSchemaType<typeof messageSchema> & {
  _id: { toString(): string };
  createdAt: Date;
  updatedAt: Date;
};

export const MessageModel = model("Message", messageSchema);
