// A context corresponds to either a describe block or test block.
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
  log = window.console.log;
  info = window.console.info;
  warn = window.console.warn;
  error = window.console.error;
  symbols = {
    passed: "✅",
    failed: "❌",
    subsection: "↪",
  };

  display([context, ...contexts]) {
    if (!context) {
      // final summary
      this.info(`${"-".repeat(16)}`);
      this.info(
        `tests passed: ${this._numTests.passed} of ${this._numTests.total}`
      );
      return;
    }

    const { type, action, description, level, shouldRun, skipLevel } = context;
    const isDescribe = type === "describe";
    const isLeaving = action === "leaving";
    const shouldSkip = skipLevel > 0;
    const errorResults = context.expectResults;
    const indent = "  ".repeat(level);
    const subSectionSymbol = level > 0 ? this.symbols.subsection + " " : "";
    let message = `${indent}${subSectionSymbol}${description}`;

    if (!isDescribe && !shouldSkip) {
      this._numTests.total += 1;
    }

    if (!shouldRun || shouldSkip) {
      message += " [skipped]";
    }

    if (isDescribe && !shouldSkip && !isLeaving) {
      this.info(message);
    }

    // new top level describe block
    if (isDescribe && isLeaving && level === 1) {
      this.log();
    }

    // test failed
    if (!isDescribe && errorResults.length > 0) {
      this.warn(indent, this.symbols.failed, description);

      if (this._stopOnFail) {
        this.displayExpectError(errorResults[0], indent);
      } else {
        errorResults.forEach((errorObj) => {
          this.displayExpectError(errorObj, indent);
        });
      }

      if (this._stopOnFail) {
        return;
      }
    } else if (!isDescribe && !shouldSkip) {
      this._numTests.passed += 1;
      this.info(indent, this.symbols.passed, description);
    }

    this.display(contexts);
  }

  displayExpectError(
    { firstValue, secondValue, message, isNot, stack, unmatchedIdx },
    indent_
  ) {
    const indent = indent_ + "  ";

    if (message) {
      this.warn(indent, message);
    }

    if (isNot) {
      this.warn(indent, `Both values were: ${firstValue}`);
      this.warn(indent, `The results should not match each other`);
    } else {
      this.warn(indent, `This:          ${firstValue}`);
      this.warn(indent, `Did not match: ${secondValue}`);
    }

    if (typeof firstValue === "string" && typeof secondValue === "string") {
      const diffIdx = this.getDiffStringsIdx(firstValue, secondValue);
      this.warn(`Strings differ at position: ${diffIdx}`);

      if (diffIdx !== 0) {
        this.warn(indent, firstValue.slice(0, diffIdx), "<-");
      }
    }

    if (unmatchedIdx !== -1) {
      this.warn(indent, `At index: ${unmatchedIdx}`);

      this.warn(indent, `First value:  ${firstValue[unmatchedIdx]}`);
      this.warn(indent, `Second value: ${secondValue[unmatchedIdx]}`);
    }

    this.info("Stack:");
    this.parseErrorStack(stack).forEach((line) => this.info(line));
  }

  parseErrorStack(stack) {
    // Firefox and Chrome have different stacks
    return stack.slice(0, 3);
  }
}
