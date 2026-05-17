import { updateRoomSchema } from "../src/services/room.service.js";

describe("updateRoomSchema", () => {
  it("allows private room updates without a new password", () => {
    const parsed = updateRoomSchema.parse({
      visibility: "private",
      password: undefined,
      expiryHours: 100,
      language: "plaintext"
    });

    expect(parsed).toEqual({
      visibility: "private",
      password: undefined,
      expiryHours: 100,
      language: "plaintext"
    });
  });
});
