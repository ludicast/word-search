import { inRange, range, fill, flatten, cloneDeep } from "lodash";
import diacritics from "diacritics";
import { seededShuffle, seededRandom, type Seeder } from "./random";

export type Position = {
	x: number;
	y: number;
};

/**
 * Returns an array of positions, following a direction
 * from a starting point.
 * @kind function
 * @name createPath
 * @param {number} x - Start position x
 * @param {number} y - Start position y
 * @param {string} dir - Direction ("N", "S", "E", "W", "NE", "NW", "SE", "SW")
 * @param {number} len - Length of the word
 * @returns {Array} Array of positions
 */
export const createPath = (x: number, y: number, dir: string, len: number): Position[] => {
	return fill(Array(len - 1), 0).reduce(
		path => {
			const { x: prevX, y: prevY } = path[path.length - 1];
			return path.concat({
				x: prevX + (dir.includes("E") ? 1 : dir.includes("W") ? -1 : 0),
				y: prevY + (dir.includes("S") ? 1 : dir.includes("N") ? -1 : 0)
			});
		},
		[{ x, y }]
	);
};

/**
 * Returns a path from a start position and an end position.
 * Returns null if it's not going in a straight direction.
 * @kind function
 * @name createPathFromPair
 * @param {Position} start - Start position object
 * @param {Position} end - End position object
 * @returns {(Array|null)} - Array of positions
 */
export const createPathFromPair = (start: Position, end: Position): Position[] | null => {
	const hDist = end.x - start.x;
	const vDist = end.y - start.y;
	const fn = (dir: string, len: number) => createPath(start.x, start.y, dir, len);
	if (hDist === vDist) {
		if (vDist > 0) {
			return fn("SE", vDist + 1);
		} else {
			return fn("NW", -vDist + 1);
		}
	} else if (vDist === -hDist) {
		if (vDist > 0) {
			return fn("SW", vDist + 1);
		} else {
			return fn("NE", -vDist + 1);
		}
	} else if (hDist === 0) {
		if (vDist > 0) {
			return fn("S", vDist + 1);
		} else {
			return fn("N", -vDist + 1);
		}
	} else if (vDist === 0) {
		if (hDist > 0) {
			return fn("E", hDist + 1);
		} else {
			return fn("W", -hDist + 1);
		}
	}
	return null;
};

/**
 * Returns the most extreme boundaries where a word can start,
 * based on its length, a direction, and a grid size.
 * Returns null if the result is out of boundaries.
 * @kind function
 * @name getWordStartBoundaries
 * @param {number} wordLength - Length of the word
 * @param {string} direction - Direction ("N", "S", "E", "W", "NE", "NW", "SE", "SW")
 * @param {number} cols - Column count
 * @param {number} rows - Row count
 * @returns {(Array|null)} - Array of positions
 */
export const getWordStartBoundaries = (wordLength: number, direction: string, cols: number, rows: number): { minX: number, maxX: number, minY: number, maxY: number } | null => {
	// Full grid
	const res = {
		minX: 0,
		maxX: cols - 1,
		minY: 0,
		maxY: rows - 1
	};
	let badInput = false;
	// For each subdirection (N, S, E, W)
	direction.split("").forEach(d => {
		let props;
		// We get the props to update
		switch (d) {
		case "N":
			props = { minY: wordLength - 1, maxY: rows - 1 };
			break;
		case "S":
			props = { minY: 0, maxY: rows - wordLength };
			break;
		case "E":
			props = { minX: 0, maxX: cols - wordLength };
			break;
		case "W":
			props = { minX: wordLength - 1, maxX: cols - 1 };
			break;
		default:
			// If the direction is unknown,
			// it's a bad input
			badInput = true;
			props = {};
		}
		// And we merge them to the result
		Object.assign(res, props);
	});

	// If the word is too long (out of boundaries),
	// it's a bad input
	if (
		[res.minX, res.maxX].some(v => !inRange(v, 0, cols + 1)) ||
    [res.minY, res.maxY].some(v => !inRange(v, 0, rows + 1))
	) {
		badInput = true;
	}

	return badInput ? null : res;
};


/**
 * Returns a normalized string with or without any accent,
 * all uppercase or all lowercase.
 * @kind function
 * @name normalizeWord
 * @param {string} word - Word
 * @param {boolean} upperCase - Whether to transform the string to uppercase
 * @param {boolean} keepDiacritics - Whether to keep diacritics (accents)
 * @returns {string} - The transformed word
 */
export const normalizeWord = (word: string, upperCase = true, keepDiacritics = false): string => {
	let res = keepDiacritics ? word : diacritics.remove(word);
	return res[upperCase ? "toUpperCase" : "toLowerCase"]();
};

/**
 * Returns a random letter, uppercase or lowercase.
 * @kind function
 * @name getRandomLetter
 * @param {boolean} upperCase - Whether to return an uppercase letter
 * @returns {string} - A random letter
 */
export const getRandomLetter = (upperCase: boolean, random: Seeder = seededRandom()): string => {
	let alphabet = "abcdefghijklmnopqrstuvwxyz";
	if (upperCase) {
		alphabet = alphabet.toUpperCase();
	}
	return alphabet[random(alphabet.length - 1)];
};

/**
 * Returns a new grid with a word added in the given path.
 * @kind function
 * @name addWordToGrid
 * @param {string} word - Word
 * @param {Array} path - Array of positions
 * @param {Array} grid - Grid to add the word to
 * @returns {Array} - A new grid
 */
export const addWordToGrid = (word: string, path: Position[], grid: string[][]): string[][] => {
	const updatedGrid = cloneDeep(grid);
	path.forEach((pos, i) => (updatedGrid[pos.y][pos.x] = word[i]));
	return updatedGrid;
};

/**
 * Returns a new grid with the given dimensions,
 * containing only ".".
 * @kind function
 * @name createGrid
 * @param {number} cols - Column count
 * @param {number} rows - Row count
 * @returns {Array} - A new grid
 */
export const createGrid = (cols: number, rows: number): string[][] => {
	const grid = [];
	for (var y = 0; y < rows; y++) {
		const line = [];
		for (var x = 0; x < cols; x++) {
			line.push(".");
		}
		grid.push(line);
	}
	return grid;
};

/**
 * Returns a new grid after filling the given one's empty cells.
 * @kind function
 * @name fillGrid
 * @param {Array} grid - Grid to fill
 * @param {boolean} upperCase - Whether to fill the grid with uppercase letters
 * @returns {Array} - A new grid
 */
export const fillGrid = (grid: string[][], upperCase: boolean, seeder: Seeder = seededRandom()): string[][] => {
	return grid.map(row =>
		row.map(cell => (cell === "." ? getRandomLetter(upperCase, seeder) : cell))
	);
};

function shuffleDirections(allowedDirections: string[], tryBackardsFirst: boolean, seeder: Seeder = seededRandom()): string[] {
	const backwardsDirections = seededShuffle(["N", "W", "NW", "SW"], seeder);
	const forwardDirections = seededShuffle(["S", "E", "NE", "SE"], seeder);
	const allDirections = tryBackardsFirst
		? backwardsDirections.concat(forwardDirections)
		: forwardDirections.concat(backwardsDirections);
	return allDirections.filter(d => allowedDirections.includes(d));
}

/**
 * Returns a random path for a word in a grid if it can find one,
 * null otherwise.
 * @kind function
 * @name findPathInGrid
 * @param {string} word - Word
 * @param {Array} grid - Grid
 * @param {Array} allowedDirections - Array of allowed directions ("N", "S", "E", "W", "NE", "NW", "SE", "SW")
 * @param {number} backwardsProbability - Probability to have each word written backwards
 * @returns {(Array<Position>|false)} - Array of positions
 */
export const findPathInGrid = (
	word: string,
	grid: string[][],
	allowedDirections: string[],
	backwardsProbability: number,
	seeder: Seeder = seededRandom()
) => {
	let foundPath: Position[] | false = false;
	let path;
	const tryBackwardsFirst = Math.random() < backwardsProbability;
	// We'll try all possible directions in random order until we find a spot
	const directionsToTry = shuffleDirections(
		allowedDirections,
		tryBackwardsFirst,
		seeder
	);
	while (directionsToTry.length && !foundPath) {
		const direction = directionsToTry.shift()!;
		// Get the boundaries of where the word can start
		const boundaries = getWordStartBoundaries(
			word.length,
			direction,
			grid[0].length,
			grid.length
		);
		if (boundaries !== null) {
			const xToTry = range(boundaries.minX, boundaries.maxX + 1);
			const yToTry = range(boundaries.minY, boundaries.maxY + 1);
			// We'll try all possible positions in random order until we find a spot
			const positionsToTry = seededShuffle(
				flatten(xToTry.map(x => yToTry.map(y => ({ x, y })))), seeder
			);
			while (positionsToTry.length && !foundPath) {
				const { x, y } = positionsToTry.shift()!;
				let invalidSpot = false;
				path = createPath(x, y, direction, word.length);
				let i = 0;
				while (i < path.length && !invalidSpot) {
					const letter = word[i];
					if (![".", letter].includes(grid[path[i].y][path[i].x])) {
						invalidSpot = true;
					}
					i++;
				}
				if (!invalidSpot) {
					foundPath = path;
				}
			}
		}
	}

	return foundPath;
};

/**
 * Filters an Array of words to only keep
 * those found in a grid, in all directions.
 * @param {Array} words - Array of normalized words
 * @param {Array} grid - Grid
 */
export function filterWordsInGrid(words: string[], grid: string[][]): string[] {
	const forwardSequences = getAllCharSequencesFromGrid(grid);
	const sequences = forwardSequences + "|" + forwardSequences.split("").reverse();
	return words.filter(w => sequences.includes(w));
}

/**
 * Returns a string obtained by reading len characters
 * from a starting point following a direction.
 * @param {number} x - Start position x
 * @param {number} y - Start position y
 * @param {string} direction - Direction ("N", "S", "E", "W", "NE", "NW", "SE", "SW")
 * @param {number} len - Length of the string to read
 * @param {Array} grid - Grid
 * @returns {string}
 */
function readPathFromGrid(x: number, y: number, direction: string, len: number, grid: string[][]): string {
	const path = createPath(x, y, direction, len);
	return path.map(pos => grid[pos.y][pos.x]).join("");
}

/**
 * Returns a pipe-separated String aggregating all
 * character sequences found in the grid,
 * in all forward directions (E, S, NE, SE).
 * @param {Array} grid - Grid 
 * @return {string}
 */
export function getAllCharSequencesFromGrid(grid: string[][]): string {
	const sequences = [];

	for (let y = 0; y < grid.length; y++) {
		sequences.push(
			// Row
			grid[y].join(""),
			// South East direction
			readPathFromGrid(0, y, "SE", Math.min(grid.length - y, grid[0].length), grid),
			// North East direction
			readPathFromGrid(0, y, "NE", Math.min(y + 1, grid[0].length), grid)
		);
	}
	for (let x = 0; x < grid[0].length; x++) {
		// Column
		sequences.push(grid.map(row => row[x]).join(""));
		if (x > 0) {
			sequences.push(
				// South East direction
				readPathFromGrid(x, 0, "SE", Math.min(grid[0].length - x, grid.length), grid),
				// North East direction
				readPathFromGrid(x, grid.length - 1, "NE", Math.min(grid[0].length - x, grid.length), grid)
			);
		}
	}
	return sequences.filter(x => x.length > 1).join("|");
}
