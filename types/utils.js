"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPathInGrid = exports.fillGrid = exports.createGrid = exports.addWordToGrid = exports.getRandomLetter = exports.normalizeWord = exports.getWordStartBoundaries = exports.createPathFromPair = exports.createPath = void 0;
exports.filterWordsInGrid = filterWordsInGrid;
exports.getAllCharSequencesFromGrid = getAllCharSequencesFromGrid;
var lodash_1 = require("lodash");
var diacritics_1 = require("diacritics");
var random_1 = require("./random");
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
var createPath = function (x, y, dir, len) {
    return (0, lodash_1.fill)(Array(len - 1), 0).reduce(function (path) {
        var _a = path[path.length - 1], prevX = _a.x, prevY = _a.y;
        return path.concat({
            x: prevX + (dir.includes("E") ? 1 : dir.includes("W") ? -1 : 0),
            y: prevY + (dir.includes("S") ? 1 : dir.includes("N") ? -1 : 0)
        });
    }, [{ x: x, y: y }]);
};
exports.createPath = createPath;
/**
 * Returns a path from a start position and an end position.
 * Returns null if it's not going in a straight direction.
 * @kind function
 * @name createPathFromPair
 * @param {Position} start - Start position object
 * @param {Position} end - End position object
 * @returns {(Array|null)} - Array of positions
 */
var createPathFromPair = function (start, end) {
    var hDist = end.x - start.x;
    var vDist = end.y - start.y;
    var fn = function (dir, len) { return (0, exports.createPath)(start.x, start.y, dir, len); };
    if (hDist === vDist) {
        if (vDist > 0) {
            return fn("SE", vDist + 1);
        }
        else {
            return fn("NW", -vDist + 1);
        }
    }
    else if (vDist === -hDist) {
        if (vDist > 0) {
            return fn("SW", vDist + 1);
        }
        else {
            return fn("NE", -vDist + 1);
        }
    }
    else if (hDist === 0) {
        if (vDist > 0) {
            return fn("S", vDist + 1);
        }
        else {
            return fn("N", -vDist + 1);
        }
    }
    else if (vDist === 0) {
        if (hDist > 0) {
            return fn("E", hDist + 1);
        }
        else {
            return fn("W", -hDist + 1);
        }
    }
    return null;
};
exports.createPathFromPair = createPathFromPair;
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
var getWordStartBoundaries = function (wordLength, direction, cols, rows) {
    // Full grid
    var res = {
        minX: 0,
        maxX: cols - 1,
        minY: 0,
        maxY: rows - 1
    };
    var badInput = false;
    // For each subdirection (N, S, E, W)
    direction.split("").forEach(function (d) {
        var props;
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
    if ([res.minX, res.maxX].some(function (v) { return !(0, lodash_1.inRange)(v, 0, cols + 1); }) ||
        [res.minY, res.maxY].some(function (v) { return !(0, lodash_1.inRange)(v, 0, rows + 1); })) {
        badInput = true;
    }
    return badInput ? null : res;
};
exports.getWordStartBoundaries = getWordStartBoundaries;
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
var normalizeWord = function (word, upperCase, keepDiacritics) {
    if (upperCase === void 0) { upperCase = true; }
    if (keepDiacritics === void 0) { keepDiacritics = false; }
    var res = keepDiacritics ? word : diacritics_1.default.remove(word);
    return res[upperCase ? "toUpperCase" : "toLowerCase"]();
};
exports.normalizeWord = normalizeWord;
/**
 * Returns a random letter, uppercase or lowercase.
 * @kind function
 * @name getRandomLetter
 * @param {boolean} upperCase - Whether to return an uppercase letter
 * @returns {string} - A random letter
 */
var getRandomLetter = function (upperCase, random) {
    if (random === void 0) { random = (0, random_1.seededRandom)(); }
    var alphabet = "abcdefghijklmnopqrstuvwxyz";
    if (upperCase) {
        alphabet = alphabet.toUpperCase();
    }
    return alphabet[random(alphabet.length - 1)];
};
exports.getRandomLetter = getRandomLetter;
/**
 * Returns a new grid with a word added in the given path.
 * @kind function
 * @name addWordToGrid
 * @param {string} word - Word
 * @param {Array} path - Array of positions
 * @param {Array} grid - Grid to add the word to
 * @returns {Array} - A new grid
 */
var addWordToGrid = function (word, path, grid) {
    var updatedGrid = (0, lodash_1.cloneDeep)(grid);
    path.forEach(function (pos, i) { return (updatedGrid[pos.y][pos.x] = word[i]); });
    return updatedGrid;
};
exports.addWordToGrid = addWordToGrid;
/**
 * Returns a new grid with the given dimensions,
 * containing only ".".
 * @kind function
 * @name createGrid
 * @param {number} cols - Column count
 * @param {number} rows - Row count
 * @returns {Array} - A new grid
 */
var createGrid = function (cols, rows) {
    var grid = [];
    for (var y = 0; y < rows; y++) {
        var line = [];
        for (var x = 0; x < cols; x++) {
            line.push(".");
        }
        grid.push(line);
    }
    return grid;
};
exports.createGrid = createGrid;
/**
 * Returns a new grid after filling the given one's empty cells.
 * @kind function
 * @name fillGrid
 * @param {Array} grid - Grid to fill
 * @param {boolean} upperCase - Whether to fill the grid with uppercase letters
 * @returns {Array} - A new grid
 */
var fillGrid = function (grid, upperCase, seeder) {
    if (seeder === void 0) { seeder = (0, random_1.seededRandom)(); }
    return grid.map(function (row) {
        return row.map(function (cell) { return (cell === "." ? (0, exports.getRandomLetter)(upperCase, seeder) : cell); });
    });
};
exports.fillGrid = fillGrid;
function shuffleDirections(allowedDirections, tryBackardsFirst, seeder) {
    if (seeder === void 0) { seeder = (0, random_1.seededRandom)(); }
    var backwardsDirections = (0, random_1.seededShuffle)(["N", "W", "NW", "SW"], seeder);
    var forwardDirections = (0, random_1.seededShuffle)(["S", "E", "NE", "SE"], seeder);
    var allDirections = tryBackardsFirst
        ? backwardsDirections.concat(forwardDirections)
        : forwardDirections.concat(backwardsDirections);
    return allDirections.filter(function (d) { return allowedDirections.includes(d); });
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
var findPathInGrid = function (word, grid, allowedDirections, backwardsProbability, seeder) {
    if (seeder === void 0) { seeder = (0, random_1.seededRandom)(); }
    var foundPath = false;
    var path;
    var tryBackwardsFirst = Math.random() < backwardsProbability;
    // We'll try all possible directions in random order until we find a spot
    var directionsToTry = shuffleDirections(allowedDirections, tryBackwardsFirst, seeder);
    var _loop_1 = function () {
        var direction = directionsToTry.shift();
        // Get the boundaries of where the word can start
        var boundaries = (0, exports.getWordStartBoundaries)(word.length, direction, grid[0].length, grid.length);
        if (boundaries !== null) {
            var xToTry = (0, lodash_1.range)(boundaries.minX, boundaries.maxX + 1);
            var yToTry_1 = (0, lodash_1.range)(boundaries.minY, boundaries.maxY + 1);
            // We'll try all possible positions in random order until we find a spot
            var positionsToTry = (0, random_1.seededShuffle)((0, lodash_1.flatten)(xToTry.map(function (x) { return yToTry_1.map(function (y) { return ({ x: x, y: y }); }); })), seeder);
            while (positionsToTry.length && !foundPath) {
                var _a = positionsToTry.shift(), x = _a.x, y = _a.y;
                var invalidSpot = false;
                path = (0, exports.createPath)(x, y, direction, word.length);
                var i = 0;
                while (i < path.length && !invalidSpot) {
                    var letter = word[i];
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
    };
    while (directionsToTry.length && !foundPath) {
        _loop_1();
    }
    return foundPath;
};
exports.findPathInGrid = findPathInGrid;
/**
 * Filters an Array of words to only keep
 * those found in a grid, in all directions.
 * @param {Array} words - Array of normalized words
 * @param {Array} grid - Grid
 */
function filterWordsInGrid(words, grid) {
    var forwardSequences = getAllCharSequencesFromGrid(grid);
    var sequences = forwardSequences + "|" + forwardSequences.split("").reverse();
    return words.filter(function (w) { return sequences.includes(w); });
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
function readPathFromGrid(x, y, direction, len, grid) {
    var path = (0, exports.createPath)(x, y, direction, len);
    return path.map(function (pos) { return grid[pos.y][pos.x]; }).join("");
}
/**
 * Returns a pipe-separated String aggregating all
 * character sequences found in the grid,
 * in all forward directions (E, S, NE, SE).
 * @param {Array} grid - Grid
 * @return {string}
 */
function getAllCharSequencesFromGrid(grid) {
    var sequences = [];
    for (var y = 0; y < grid.length; y++) {
        sequences.push(
        // Row
        grid[y].join(""), 
        // South East direction
        readPathFromGrid(0, y, "SE", Math.min(grid.length - y, grid[0].length), grid), 
        // North East direction
        readPathFromGrid(0, y, "NE", Math.min(y + 1, grid[0].length), grid));
    }
    var _loop_2 = function (x) {
        // Column
        sequences.push(grid.map(function (row) { return row[x]; }).join(""));
        if (x > 0) {
            sequences.push(
            // South East direction
            readPathFromGrid(x, 0, "SE", Math.min(grid[0].length - x, grid.length), grid), 
            // North East direction
            readPathFromGrid(x, grid.length - 1, "NE", Math.min(grid[0].length - x, grid.length), grid));
        }
    };
    for (var x = 0; x < grid[0].length; x++) {
        _loop_2(x);
    }
    return sequences.filter(function (x) { return x.length > 1; }).join("|");
}
