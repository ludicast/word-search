"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seederRandom = seederRandom;
exports.seededShuffle = seededShuffle;
var seedrandom_1 = require("seedrandom");
function seederRandom(seed) {
    var genRandom = (0, seedrandom_1.default)(seed);
    return function (max) {
        if (max) {
            var res = Math.floor(genRandom() * (max + 1));
            return Math.min(res, max);
        }
        return genRandom();
    };
}
function seededShuffle(array, random) {
    var _a;
    if (random === void 0) { random = seederRandom(); }
    var result = array.slice();
    // Fisher-Yates
    for (var i = result.length - 1; i > 0; i--) {
        var j = Math.floor(random() * (i + 1));
        _a = [result[j], result[i]], result[i] = _a[0], result[j] = _a[1];
    }
    return result;
}
