export default function expect(firstValue) {
  const errorObj = {
    firstValue,
    message: "",
    isTest: true,
  };
  let shouldEquals = true;

  const expectObject = {
    toBe(secondValue, message = "") {
      const failed = shouldEquals
        ? firstValue !== secondValue
        : firstValue === secondValue;

      if (failed) {
        throw { ...errorObj, secondValue, message };
      }

      return expectObject;
    },
    get not() {
      shouldEquals = !shouldEquals;
      return expectObject;
    },
  };

  return expectObject;
}
