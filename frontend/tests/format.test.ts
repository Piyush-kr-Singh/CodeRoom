import { estimateHoursRemaining, formatTimeRemaining } from "@/lib/format";

describe("room expiry formatting", () => {
  const fixedNow = new Date("2026-05-24T12:00:00.000Z").getTime();

  beforeEach(() => {
    jest.spyOn(Date, "now").mockReturnValue(fixedNow);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("uses the same whole-hour remainder for the badge and owner modal", () => {
    const expiresAt = new Date(fixedNow + 23 * 60 * 60 * 1000 + 10 * 60 * 1000).toISOString();

    expect(formatTimeRemaining(expiresAt)).toBe("23h left");
    expect(estimateHoursRemaining(expiresAt)).toBe(23);
  });

  it("keeps at least one hour in the owner modal for rooms under an hour", () => {
    const expiresAt = new Date(fixedNow + 25 * 60 * 1000).toISOString();

    expect(formatTimeRemaining(expiresAt)).toBe("25m left");
    expect(estimateHoursRemaining(expiresAt)).toBe(1);
  });
});
