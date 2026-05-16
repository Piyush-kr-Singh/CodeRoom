import { jest } from "@jest/globals";
import request from "supertest";

import { buildApp } from "../src/app.js";
import { RoomService } from "../src/services/room.service.js";

describe("room API", () => {
  it("returns room metadata", async () => {
    const roomService = {
      getMetadata: jest.fn().mockResolvedValue({
        exists: false,
        slug: "demo-room"
      })
    };

    const app = buildApp(roomService as never);
    const response = await request(app).get("/api/rooms/demo-room/metadata");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      exists: false,
      slug: "demo-room"
    });
  });

  it("validates private room creation payloads", async () => {
    const app = buildApp(new RoomService("http://localhost:3000"));
    const response = await request(app).post("/api/rooms/private-room/create").send({
      visibility: "private",
      expiryHours: 24
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed.");
  });
});
