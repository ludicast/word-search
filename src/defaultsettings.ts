import { seederRandom } from "./random";

// exported temporarily from ludicast/word-search repo and same MIT license applies to this file
export const defaultSettings = {
  cols: 10,
  rows: 10,
  disabledDirections: [] as string[],
  allowedDirections: ["N", "S", "E", "W", "NE", "NW", "SE", "SW"],
  dictionary: [] as string[],
  maxWords: 20,
  backwardsProbability: 0.3,
  upperCase: true,
  diacritics: false,
  forbiddenWords: [] as string[],
  maxRetries: 10,
}
