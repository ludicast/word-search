import random from "seedrandom"

export type Seeder = (max?: number) => number

export function seededRandom(seed?: string): Seeder {
    const genRandom = random(seed)
    return (max?: number) => {
        if (max) {
            const res = Math.floor(genRandom() * (max + 1))
            return Math.min(res, max)
        }
        return genRandom()
    }
  }
  
export function seededShuffle<T>(array: T[], random: Seeder = seededRandom()): T[] {
	const result = array.slice();
  
	// Fisher-Yates
	for (let i = result.length - 1; i > 0; i--) {
	  const j = Math.floor(random() * (i + 1));
	  [result[i], result[j]] = [result[j], result[i]];
	}
  
	return result;
  }
