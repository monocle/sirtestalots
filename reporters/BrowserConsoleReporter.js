// Reporters are responsible for displaying test results.
// They keep track of testing contexts.
// A context corresponds to either a describe block or test block.
// A context is pushed onto the _contexts stack for later processing.
class TestReporter {
  _stopOnFail = true;
  _numTests = {
    total: 0,
    passed: 0,
  };

  getDiffStringsIdx(first, second) {
    const firstArr = first.split("");
    const secondArr = second.split("");
    let idx = 0;

    while (firstArr[idx] === secondArr[idx]) {
      ++idx;
    }
    return +idx;
  }

  display() {
    throw "must implement";
  }
}

export default class BrowserConsoleReporter extends TestReporter {
  info = window.console.info;
  warn = window.console.warn;
  error = window.console.error;
  symbols = {
    passed: "✅",
    failed: "❌",
    subsection: "↪",
  };

  display([context, ...contexts]) {
    if (!context) return;

    const { action, description, level, shouldRun, skipLevel } = context;

    const indent = "  ".repeat(level);
    const subSectionSymbol = level > 0 ? this.symbols.subsection + " " : "";
    let message = `${indent}${subSectionSymbol}${description}`;

    if (!shouldRun || skipLevel > 0) {
      message += " [skipped]";
    }

    if (skipLevel === 0 && action !== "leaving") {
      this.info(message);
    }
    this.display(contexts);
  }

  display_(contexts) {
    console.log(contexts);
    let indentLevel = 0;

    for (const context of contexts) {
      const indent = "  ".repeat(indentLevel);

      if (context.type === "describe") {
        const { action, description, shouldRun } = context;

        if (action === "entering") {
          const subSectionSymbol =
            indentLevel > 0 ? this.symbols.subsection + " " : "";

          if (shouldRun) {
            this.info(`${indent}${subSectionSymbol}${description}`);
          } else {
            this.info(`${indent}${subSectionSymbol}${description} [skipped]`);
          }

          indentLevel += 1;
        } else {
          indentLevel -= 1;

          if (indentLevel === 0) {
            if (shouldRun) {
              console.log();
            }
          }
        }
      } else {
        // test context
        const { description, passed, error } = context;

        this._numTests.total += 1;

        if (passed) {
          this._numTests.passed += 1;

          this.info(indent, this.symbols.passed, description);
        } else {
          const { message, firstValue, secondValue } = error;

          this.info(indent, this.symbols.failed, description);

          if (message) {
            this.warn(message);
          }

          // FIX this needs to account for "not"
          this.warn("This:");
          this.warn(firstValue);
          this.warn("Did not match:");
          this.warn(secondValue);

          if (
            typeof firstValue === "string" &&
            typeof secondValue === "string"
          ) {
            const diffIdx = this.getDiffStringsIdx(firstValue, secondValue);
            this.warn(`Strings differ at position: ${diffIdx}`);

            if (diffIdx !== 0) {
              this.warn(firstValue.slice(0, diffIdx), "<-");
            }
          }

          if (this._stopOnFail) {
            break;
          }
        }
      }
    }

    this.info(`${"-".repeat(16)}`);
    this.info(
      `tests passed: ${this._numTests.passed} of ${this._numTests.total}`
    );
  }
}
