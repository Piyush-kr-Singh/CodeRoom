import { jest } from "@jest/globals";
import { applyCodeChanges } from "../src/utils/code.js";

describe("applyCodeChanges", () => {
  it("applies Monaco-style insertions", () => {
    expect(
      applyCodeChanges("hello", [
        {
          rangeOffset: 5,
          rangeLength: 0,
          text: " world"
        }
      ])
    ).toBe("hello world");
  });

  it("applies replacement updates", () => {
    expect(
      applyCodeChanges("console.log('x')", [
        {
          rangeOffset: 13,
          rangeLength: 1,
          text: "y"
        }
      ])
    ).toBe("console.log('y')");
  });
});
