import BrowserConsoleReporter from "../reporters/BrowserConsoleReporter.js";

let contexts = [];

let reporter = new BrowserConsoleReporter();

function setReporter(newReporter) {
  // TODO
}

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
  const isFirstDontRunDescribe = isDescribe && !shouldRun && skipLevel === 0;
  const shouldIncreaseSkipLevel = isDescribe && isEntering && skipLevel > 0;
  let newContext = { ...context, level, skipLevel };

  if (isDescribe) {
    level += isEntering ? 1 : -1;
  }

  if (isFirstDontRunDescribe || shouldIncreaseSkipLevel) {
    skipLevel++;
  }

  if (!isEntering && skipLevel > 0) {
    skipLevel--;
    newContext.skipLevel = skipLevel;
  }

  newContexts.push(newContext);

  return mapContexts(rest, level, skipLevel, newContexts);
}

function runTests() {
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

export { describe, test, setReporter, runTests };
