import { type Seeder } from "./random";
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
export declare const createPath: (x: number, y: number, dir: string, len: number) => Position[];
/**
 * Returns a path from a start position and an end position.
 * Returns null if it's not going in a straight direction.
 * @kind function
 * @name createPathFromPair
 * @param {Position} start - Start position object
 * @param {Position} end - End position object
 * @returns {(Array|null)} - Array of positions
 */
export declare const createPathFromPair: (start: Position, end: Position) => Position[] | null;
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
export declare const getWordStartBoundaries: (wordLength: number, direction: string, cols: number, rows: number) => {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
} | null;
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
export declare const normalizeWord: (word: string, upperCase?: boolean, keepDiacritics?: boolean) => string;
/**
 * Returns a random letter, uppercase or lowercase.
 * @kind function
 * @name getRandomLetter
 * @param {boolean} upperCase - Whether to return an uppercase letter
 * @returns {string} - A random letter
 */
export declare const getRandomLetter: (upperCase: boolean, random?: Seeder) => string;
/**
 * Returns a new grid with a word added in the given path.
 * @kind function
 * @name addWordToGrid
 * @param {string} word - Word
 * @param {Array} path - Array of positions
 * @param {Array} grid - Grid to add the word to
 * @returns {Array} - A new grid
 */
export declare const addWordToGrid: (word: string, path: Position[], grid: string[][]) => string[][];
/**
 * Returns a new grid with the given dimensions,
 * containing only ".".
 * @kind function
 * @name createGrid
 * @param {number} cols - Column count
 * @param {number} rows - Row count
 * @returns {Array} - A new grid
 */
export declare const createGrid: (cols: number, rows: number) => string[][];
/**
 * Returns a new grid after filling the given one's empty cells.
 * @kind function
 * @name fillGrid
 * @param {Array} grid - Grid to fill
 * @param {boolean} upperCase - Whether to fill the grid with uppercase letters
 * @returns {Array} - A new grid
 */
export declare const fillGrid: (grid: string[][], upperCase: boolean, seeder?: Seeder) => string[][];
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
export declare const findPathInGrid: (word: string, grid: string[][], allowedDirections: string[], backwardsProbability: number, seeder?: Seeder) => false | Position[];
/**
 * Filters an Array of words to only keep
 * those found in a grid, in all directions.
 * @param {Array} words - Array of normalized words
 * @param {Array} grid - Grid
 */
export declare function filterWordsInGrid(words: string[], grid: string[][]): string[];
/**
 * Returns a pipe-separated String aggregating all
 * character sequences found in the grid,
 * in all forward directions (E, S, NE, SE).
 * @param {Array} grid - Grid
 * @return {string}
 */
export declare function getAllCharSequencesFromGrid(grid: string[][]): string;
