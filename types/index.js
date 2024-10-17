"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WordSearch = void 0;
var lodash_1 = require("lodash");
var utils = require("./utils");
var defaultsettings_1 = require("./defaultsettings");
var WordSearch = /** @class */ (function () {
    function WordSearch(options) {
        if (options === void 0) { options = {}; }
        this.settings = (0, lodash_1.merge)((0, lodash_1.cloneDeep)(defaultsettings_1.defaultSettings), (0, lodash_1.cloneDeep)(options));
        this.settings.allowedDirections = (0, lodash_1.difference)(this.settings.allowedDirections, this.settings.disabledDirections);
        this.forbiddenWordsFound = [];
        this.data = this.buildGame();
    }
    Object.defineProperty(WordSearch.prototype, "grid", {
        get: function () {
            return (0, lodash_1.cloneDeep)(this.data.grid);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WordSearch.prototype, "words", {
        get: function () {
            return (0, lodash_1.cloneDeep)(this.data.words);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WordSearch.prototype, "cleanForbiddenWords", {
        get: function () {
            var _this = this;
            return (0, lodash_1.cloneDeep)(this.settings.forbiddenWords).map(function (w) { return _this.cleanWord(w); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WordSearch.prototype, "forbiddenWordsIncluded", {
        get: function () {
            return (0, lodash_1.cloneDeep)(this.forbiddenWordsFound);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WordSearch.prototype, "defaultSettings", {
        get: function () {
            return (0, lodash_1.cloneDeep)(defaultsettings_1.defaultSettings);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WordSearch.prototype, "utils", {
        get: function () {
            return utils;
        },
        enumerable: false,
        configurable: true
    });
    WordSearch.prototype.buildGame = function (retries) {
        var _this = this;
        if (retries === void 0) { retries = 0; }
        var grid = utils.createGrid(this.settings.cols, this.settings.rows);
        var addedWords = [];
        var dict = (0, lodash_1.shuffle)(this.settings.dictionary);
        dict.forEach(function (word) {
            var clean = _this.cleanWord(word);
            if (_this.cleanForbiddenWords.some(function (fw) { return clean.includes(fw); })) {
                return;
            }
            if (addedWords.length < _this.settings.maxWords) {
                var path = utils.findPathInGrid(clean, grid, _this.settings.allowedDirections, _this.settings.backwardsProbability);
                if (path !== false) {
                    grid = utils.addWordToGrid(clean, path, grid);
                    addedWords.push({ word: word, clean: clean, path: path });
                }
            }
        });
        addedWords.sort(function (a, b) { return (a.clean > b.clean ? 1 : -1); });
        grid = utils.fillGrid(grid, this.settings.upperCase);
        if (this.cleanForbiddenWords.length) {
            var forbiddenWordsFound = utils.filterWordsInGrid(this.cleanForbiddenWords, grid);
            if (forbiddenWordsFound.length) {
                if (retries < this.settings.maxRetries) {
                    return this.buildGame(retries + 1);
                }
                else {
                    // Too many retries, we output the grid even
                    // if it contains forbidden words, after populating
                    // this to let the developer see which ones:
                    this.forbiddenWordsFound = forbiddenWordsFound;
                }
            }
        }
        return { grid: grid, words: addedWords };
    };
    WordSearch.prototype.cleanWord = function (word) {
        return utils.normalizeWord(word, this.settings.upperCase, this.settings.diacritics);
    };
    WordSearch.prototype.dump = function () {
        return (0, lodash_1.cloneDeep)({ settings: this.settings, data: this.data });
    };
    WordSearch.prototype.load = function (config) {
        (0, lodash_1.merge)(this, config);
        return this;
    };
    WordSearch.prototype.read = function (start, end) {
        var _this = this;
        var path = utils.createPathFromPair(start, end);
        if (path) {
            return path.map(function (pos) { return _this.data.grid[pos.y][pos.x]; }).join("");
        }
        return null;
    };
    WordSearch.prototype.toString = function () {
        return this.data.grid.map(function (l) { return l.join(" "); }).join("\n");
    };
    return WordSearch;
}());
exports.WordSearch = WordSearch;
