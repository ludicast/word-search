import { seededShuffle, seededRandom} from "../src/random";

describe("random.seededRandom", () => {
  it("has a different output for different seeds", () => {
    const random1 = seededRandom("123");
    const random2 = seededRandom("456");
    expect(random1()).not.toEqual(random2());
  });
  it("has an identical output for identical seeds", () => {
    const random1 = seededRandom("123");
    const random2 = seededRandom("123");
    expect(random1()).toEqual(random2());
  });
  it("has a different output for the same seed on multiple calls", () => {
    const random1 = seededRandom("123");
    const random2 = seededRandom("123");
    random2()
    expect(random1()).not.toEqual(random2());
  });
  it("takes a max", () => {
    const random = seededRandom()
    const arr = new Array(3)
    for (let i = 0; i < 100; i++) {
      const r = random(2)
      arr[r] = true
    }
    expect(arr).toEqual([true, true, true])
  })
});

describe("random.seededShuffle", () => {
  it("shuffles", () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const shuffled = seededShuffle(arr)
    expect(shuffled).not.toEqual(arr)
  });
  it("shuffles differently by default", () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const shuffled1 = seededShuffle(arr)
    const shuffled2 = seededShuffle(arr)
    expect(shuffled1).not.toEqual(shuffled2)
  });
  it("shuffles differently with a different seed", () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const shuffled1 = seededShuffle(arr, seededRandom("123"))
    const shuffled2 = seededShuffle(arr, seededRandom("456"))
    expect(shuffled1).not.toEqual(shuffled2)
  });
  it("shuffles the same with the same seed", () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const shuffled1 = seededShuffle(arr, seededRandom("123"))
    const shuffled2 = seededShuffle(arr, seededRandom("123"))
    expect(shuffled1).toEqual(shuffled2)
  });
});