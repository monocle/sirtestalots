import { describe, test, expect } from "../src/index.js";

describe("expect - toBe(), with basic objects", () => {
  test("it should handle strings", () => {
    expect("foo").toBe("foo");
    expect("foo").not.toBe("bar");
  });

  test("it should handle numbers", () => {
    expect(1).toBe(1);
    expect(1).not.toBe(2);
  });
});

describe("expect - toBe(), with flat arrays, should handle", () => {
  test("arrays of equal length", () => {
    const first = [1, 2, 3];
    const second = [1, 2, 3];
    const third = [1, 0, 3];

    expect(first).toBe(second);
    expect(first).not.toBe(third);
  });

  test("when the first array is larger", () => {
    const first = [1, 2, 3, 4];
    const second = [1, 2, 3];

    expect(first).not.toBe(second);
  });

  test("when the first array is smaller", () => {
    const first = [1, 2];
    const second = [1, 2, 3];

    expect(first).not.toBe(second);
  });
});
