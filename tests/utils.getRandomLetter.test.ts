import { seederRandom } from "../src/random.js";
import { getRandomLetter } from "../src/utils.js";

describe("utils.getRandomLetter", () => {
  it(`returns an uppercase letter`, () => {
    const res = getRandomLetter(true, seederRandom());
    expect(res).toEqual(res.toUpperCase());
  });
  it(`returns an lowercase letter`, () => {
    const res = getRandomLetter(false, seederRandom());
    expect(res).toEqual(res.toLowerCase());
  });
});
