import { getExpectResults } from "./expect.js";

import BrowserConsoleReporter from "./reporters/BrowserConsoleReporter.js";

let contexts = [];

function mapContexts(
  [context, ...rest],
  level = 0,
  skipLevel = 0,
  newContexts = []
) {
  if (!context) return newContexts;

  const { type, action, shouldRun } = context;
  const isEntering = action === "entering";
  const isDescribe = type === "describe";
  const isSkipping = skipLevel > 0;
  const isFirstDontRunDescribe = isDescribe && !shouldRun && skipLevel === 0;
  const shouldIncreaseSkipLevel = isDescribe && isEntering && isSkipping;
  let newContext = { ...context, level, skipLevel, expectResults: [] };

  if (isDescribe) {
    level += isEntering ? 1 : -1;
  }

  if (isFirstDontRunDescribe || shouldIncreaseSkipLevel) {
    skipLevel++;
  }

  if (!isEntering && isSkipping) {
    skipLevel--;
    newContext.skipLevel = skipLevel;
  }

  if (!isDescribe) {
    context.exec();
    newContext.expectResults = [...getExpectResults()];
  }

  newContexts.push(newContext);

  return mapContexts(rest, level, skipLevel, newContexts);
}

// allow user to turn off stop on fail
function runTests() {
  let reporter = new BrowserConsoleReporter();
  reporter.display(mapContexts(contexts));
}

function makeTestingContext(type) {
  return (description, exec, shouldRun = true) => {
    const context = {
      type,
      description,
      shouldRun,
      action: "entering",
    };

    if (type === "describe") {
      contexts.push(context);

      exec();

      contexts.push({ ...context, action: "leaving" });
    } else {
      contexts.push({ ...context, exec: exec });
    }
  };
}

const describe = makeTestingContext("describe");
const test = makeTestingContext("test");

export { describe, test, runTests };
