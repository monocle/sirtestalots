# SirTestALots

SirTestALots is a JavaScript testing library. It's API is modeled after Jest's.

## Goals

The main goal of this project is to develop a JavaScript library from scratch and understand what issues the Jest team might have faced as they built Jest.

## Usage

Here are what tests look like:

```javascript
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

      expect(5).toBe(4, "Result not seen since the previous assertion failed");
    });
  });
});
```

Currently, test results report to the web browser console. To show this functionality, open `src/tests/index.html` in your browser. You should see something like this:

![Example browser console output](assets/browser_console_output.png)

## Contributing

This project is still under early development. There are no dependencies to install. Take a look at `tests/index.html` to see how to run tests.

If you are interested in going along on this learning adventure, feel free to open up a Github issue with what you'd like to work on.
