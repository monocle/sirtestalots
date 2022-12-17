let _ = {};
_.findUnmatchedArrayIdx = function findUnmatchArrayElement(first, second) {
  // what to do if element is array or object
  let idx = first.findIndex((elem, i) => {
    return elem !== second[i];
  });

  if (first.length !== second.length) {
    idx = first.length;
  }

  return idx;
};

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
    stack: undefined,
    unmatchedIdx: -1,
  };
  let failed = true;

  if (Array.isArray(firstValue) && Array.isArray(secondValue)) {
    let failedIdx = -1;

    failedIdx = _.findUnmatchedArrayIdx(firstValue, secondValue);
    errorObj.unmatchedIdx = failedIdx;

    failed = failedIdx !== -1;
  } else {
    failed = firstValue !== secondValue;
  }

  failed = isNot ? !failed : failed;

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
