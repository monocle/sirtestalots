import { describe, test, expect } from "../index.js";

describe("describe 1", () => {
  test("test d1-t1", () => {
    expect(5).toBe(5, "custom err msg");
  });

  test("test d1-t2", () => {
    expect(5).toBe(5, "custom err msg");
  });

  describe(
    "describe d1-d1 skipped",
    () => {
      test(
        "test d1-d1-t1 skipped invisible!",
        () => {
          expect(3).toBe(3);
        },
        false
      );

      test("test d1-d1-t2 invisible!", () => {
        expect(3).toBe(3);
      });
    },
    false
  );

  test("test d1-t3", () => {
    expect(3).toBe(3);
  });

  describe("describe d1-d3", () => {
    test("test d1-d3-t1", () => {
      expect(3).toBe(3);
    });
  });
});

describe("describe 2", () => {
  test(
    "test d2-t1 is skipped",
    () => {
      expect(5).toBe(5, "custom err msg");
    },
    false
  );

  test("test d2-t2", () => {
    expect(5).toBe(5, "custom err msg");
  });

  describe(
    "describe d2-d1 is skipped",
    () => {
      test("test d2-d1-t1 invisible!", () => {
        expect(3).toBe(3);
      });

      test("test d2-d1-t2 invisible!", () => {
        expect(3).toBe(3);
      });

      describe("describe d2-d1-d1 invisible!", () => {
        test("test d3-t1 invisible!", () => {
          expect(3).toBe(3);
        });
      });
    },
    false
  );
});

describe(
  "describe d3 is skipped",
  () => {
    test("test d3-t1 invisible!", () => {
      expect(3).toBe(3);
    });
  },
  false
);

describe("describe d4", () => {
  test("test d4-t1", () => {
    expect(3).toBe(3);
  });
});
