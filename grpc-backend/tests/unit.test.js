const sum = (a, b) => a + b; // Example function for unit test

test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});
