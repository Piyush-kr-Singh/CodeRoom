import { RoomModel } from "../src/models/room.model.js";

describe("room model", () => {
  it("allows blank code for plaintext rooms", () => {
    const room = new RoomModel({
      slug: "blank-room",
      visibility: "public",
      ownerTokenHash: "owner-token-hash",
      viewerKeyHash: "viewer-key-hash",
      code: "",
      language: "plaintext",
      expiresAt: new Date("2026-05-18T00:00:00.000Z"),
      inactiveDeleteAt: new Date("2026-05-18T00:00:00.000Z"),
      lastActivityAt: new Date("2026-05-17T00:00:00.000Z")
    });

    expect(room.validateSync()).toBeUndefined();
  });
});
