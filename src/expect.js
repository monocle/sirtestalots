let expectResults = [];

function getExpectResults() {
  const results = [...expectResults];
  expectResults = [];
  return results;
}

function toBe(secondValue, message = "") {
  const { firstValue, isNot } = this;
  const errorObj = {
    firstValue,
    secondValue,
    message,
    isNot,
    isTest: true,
  };

  const failed = isNot
    ? firstValue === secondValue
    : firstValue !== secondValue;

  if (failed) {
    errorObj.stack = new Error().stack.split("\n");
    expectResults.push({ ...errorObj });
  }

  return this;
}

function makeExpectObject(firstValue) {
  const expectObject = {
    firstValue,
    isNot: false,
  };

  expectObject.toBe = toBe.bind(expectObject);

  Object.defineProperty(expectObject, "not", {
    get() {
      expectObject.isNot = !expectObject.isNot;
      return this;
    },
  });

  return expectObject;
}

export default function expect(firstValue) {
  return makeExpectObject(firstValue);
}

export { getExpectResults };
