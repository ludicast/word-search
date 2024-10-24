// exported temporarily from ludicast/word-search repo and same MIT license applies to this file
import random from "seedrandom"
import * as _ from "lodash"
export type Seeder = (max?: number) => number

export function seederRandom(seed?: string): Seeder {
  const genRandom = random(seed)
  
  return (max?: number) => {
    if (max) {
      const res = Math.floor(genRandom() * (max + 1))
      return Math.min(res, max)
    }
    return genRandom()
  }
}

export function seededShuffle<T>(array: T[], random: Seeder): T[] {
  const result = array.slice()

  // Fisher-Yates
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }

  return result
}
