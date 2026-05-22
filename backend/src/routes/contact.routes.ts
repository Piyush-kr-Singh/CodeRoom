import { Router, type Request, type Response } from "express";
import { z } from "zod";

import { contactFormLimiter } from "../middleware/rate-limit.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { MessageModel } from "../models/message.model.js";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Invalid email address").max(255, "Email is too long"),
  subject: z.string().min(1, "Subject is required").max(200, "Subject is too long"),
  message: z.string().min(1, "Message is required").max(2000, "Message is too long")
});

export function createContactRouter() {
  const router = Router();

  router.post(
    "/",
    contactFormLimiter,
    asyncHandler(async (request: Request, response: Response) => {
      const parsedBody = contactSchema.parse(request.body);

      const newMessage = new MessageModel(parsedBody);
      await newMessage.save();

      response.status(201).json({
        success: true,
        message: "Your message has been received."
      });
    })
  );

  return router;
}
