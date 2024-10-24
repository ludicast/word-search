import { seederRandom } from "../src/random.js";
import { fillGrid } from "../src/utils.js";

const testCases = [
  {
    name: "A",
    grid: [
      [".", ".", ".", ".", "."],
      [".", ".", ".", ".", "."],
      [".", ".", ".", ".", "."]
    ],
    upperCase: false
  },
  {
    name: "B",
    grid: [
      [".", "."],
      [".", "."],
      [".", "."],
      ["X", "X"],
      [".", "."],
      [".", "."],
      [".", "."]
    ],
    upperCase: true
  }
];

describe("utils.fillGrid", () => {
  testCases.forEach(t => {
    it(`returns correct grid (case ${t.name})`, () => {
      const res = fillGrid(t.grid, t.upperCase, seederRandom());
      const resString = res.map(l => l.join("")).join("");
      expect(resString).toEqual(
        resString[t.upperCase ? "toUpperCase" : "toLowerCase"]()
      );
    });
  });
});
