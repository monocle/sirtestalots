import { describe, test, expect } from "../src/index.js";

describe("This is the first describe block", () => {
  describe("It has a nested describe block", () => {
    test("Here is the first test ", () => {
      expect(5).toBe(5, "Should not see this message");
    });

    test("This is the second test ", () => {
      expect(5).not.toBe(4, "Should not see this message");
    });

    test("Suspicious third test... ", () => {
      expect(5).toBe(4, "Oops. This test failed. 5 should === 5, but did not.");
    });
  });
});

describe("describe 1", () => {
  test("test d1-t1", () => {
    expect(5).toBe(5, "custom err msg");
  });

  test("test d1-t2 fail x 2", () => {
    expect(5).toBe(5, "should not be seen");
    expect(5).toBe(4, "5 was not 4");
    expect(1).toBe(2, "1 was not 2");
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
    expect(3).toBe(4, "second custom error message");
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
  test("test d4-t1 not", () => {
    expect(4).not.toBe(4);
  });
});
