import { jest } from "@jest/globals";
import request from "supertest";

import { buildApp } from "../src/app.js";
import type { AdminDashboardReader } from "../src/services/admin.service.js";

const adminPath = process.env.ADMIN_ROUTE_PATH ?? "/ops-console";



function createAdminServiceStub() {
  const getDashboardSnapshot = jest.fn().mockResolvedValue({
      generatedAt: "2026-05-26T12:00:00.000Z",
      roomCount: 1,
      publicRoomCount: 0,
      privateRoomCount: 1,
      messageCount: 1,
      rooms: [
        {
          id: "room-1",
          slug: "alpha-room",
          visibility: "private",
          language: "typescript",
          codePreview: "console.log('hello');",
          codeLength: 21,
          codeWasTrimmed: false,
          expiresAt: "2026-05-27T12:00:00.000Z",
          inactiveDeleteAt: "2026-05-26T16:00:00.000Z",
          lastActivityAt: "2026-05-26T12:30:00.000Z",
          createdAt: "2026-05-26T11:00:00.000Z",
          updatedAt: "2026-05-26T12:30:00.000Z",
          passwordProtected: true,
          ownerTokenStored: true,
          viewerKeyStored: true
        }
      ],
      messages: [
        {
          id: "message-1",
          name: "Ada Lovelace",
          email: "ada@example.com",
          subject: "Need help",
          message: "Can you review this room?",
          createdAt: "2026-05-26T10:00:00.000Z",
          updatedAt: "2026-05-26T10:00:00.000Z"
        }
      ]
    });

  return {
    adminService: {
      getDashboardSnapshot
    } satisfies AdminDashboardReader,
    getDashboardSnapshot
  };
}

describe("admin route", () => {
  it("renders the login page for GET requests", async () => {
    const { adminService } = createAdminServiceStub();
    const app = buildApp(undefined, adminService);
    const response = await request(app).get(adminPath);

    expect(response.status).toBe(200);
    expect(response.text).toContain("Secure Admin Login");
    expect(response.text).toContain("username");
    expect(response.text).toContain("password");
  });

  it("rejects invalid credentials on POST requests", async () => {
    const { adminService, getDashboardSnapshot } = createAdminServiceStub();
    const app = buildApp(undefined, adminService);
    const response = await request(app)
      .post(adminPath)
      .type("form")
      .send({
        username: "wrong-user",
        password: "wrong-password"
      });

    expect(response.status).toBe(401);
    expect(response.text).toContain("Invalid administrator credentials");
    expect(getDashboardSnapshot).not.toHaveBeenCalled();
  });

  it("renders the dashboard for valid credentials on POST requests", async () => {
    const { adminService, getDashboardSnapshot } = createAdminServiceStub();
    const app = buildApp(undefined, adminService);
    const defaultUser = process.env.ADMIN_USERNAME ?? "ops-admin";
    const defaultPass = process.env.ADMIN_PASSWORD ?? "test-admin-password";
    
    const response = await request(app)
      .post(adminPath)
      .type("form")
      .send({
        username: defaultUser,
        password: defaultPass
      });

    expect(response.status).toBe(200);
    expect(getDashboardSnapshot).toHaveBeenCalledTimes(1);
    expect(response.text).toContain("Secure Admin Console");
    expect(response.text).toContain("alpha-room");
    expect(response.text).toContain("Ada Lovelace");
  });

  it("blocks non-GET and non-POST requests", async () => {
    const { adminService, getDashboardSnapshot } = createAdminServiceStub();
    const app = buildApp(undefined, adminService);
    const response = await request(app).put(adminPath);

    expect(response.status).toBe(405);
    expect(getDashboardSnapshot).not.toHaveBeenCalled();
  });
});
