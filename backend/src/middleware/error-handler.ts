import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { AppError } from "../lib/app-error.js";
import { logger } from "../lib/logger.js";

export function errorHandler(error: unknown, _request: Request, response: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    response.status(400).json({
      message: "Validation failed.",
      issues: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message
      }))
    });
    return;
  }

  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      message: error.message
    });
    return;
  }

  logger.error("Unhandled server error", error);
  response.status(500).json({
    message: "Internal server error."
  });
}
