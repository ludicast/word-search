import { merge, difference, cloneDeep, shuffle } from "lodash";
import * as utils from "./utils";
import { defaultSettings } from "./defaultsettings";

export class WordSearch {
    settings: typeof defaultSettings
    data: { grid: string[][], words: Array<{ word: string, clean: string, path: any }> }
    forbiddenWordsFound: any[]

	constructor(options = {}) {
		this.settings = merge(cloneDeep(defaultSettings), cloneDeep(options));
		this.settings.allowedDirections = difference(
			this.settings.allowedDirections,
			this.settings.disabledDirections
		);
		this.forbiddenWordsFound = [];
		this.data = this.buildGame();
	}
	get grid() {
		return cloneDeep(this.data.grid);
	}
	get words() {
		return cloneDeep(this.data.words);
	}
	get cleanForbiddenWords() {
		return cloneDeep(this.settings.forbiddenWords).map(w => this.cleanWord(w));
	}
	get forbiddenWordsIncluded() {
		return cloneDeep(this.forbiddenWordsFound);
	}
	get defaultSettings() {
		return cloneDeep(defaultSettings);
	}
	get utils() {
		return utils;
	}
	buildGame(retries = 0): { grid: string[][], words: Array<{ word: string, clean: string, path: any }> } {
		let grid = utils.createGrid(this.settings.cols, this.settings.rows);
		const addedWords: Array<{ word: string, clean: string, path: any }> = [];
		const dict = shuffle(this.settings.dictionary);
		dict.forEach(word => {
			const clean = this.cleanWord(word);
			if (this.cleanForbiddenWords.some(fw => clean.includes(fw))) {
				return;
			}
			if (addedWords.length < this.settings.maxWords) {
				const path = utils.findPathInGrid(
					clean,
					grid,
					this.settings.allowedDirections,
					this.settings.backwardsProbability
				);
				if (path !== false) {
					grid = utils.addWordToGrid(clean, path, grid);
					addedWords.push({ word, clean, path });
				}
			}
		});
		addedWords.sort((a, b) => (a.clean > b.clean ? 1 : -1));
		grid = utils.fillGrid(grid, this.settings.upperCase);

		if (this.cleanForbiddenWords.length) {
			const forbiddenWordsFound = utils.filterWordsInGrid(this.cleanForbiddenWords, grid);
			if (forbiddenWordsFound.length) {
				if (retries < this.settings.maxRetries) {
					return this.buildGame(retries + 1);
				} else {
					// Too many retries, we output the grid even
					// if it contains forbidden words, after populating
					// this to let the developer see which ones:
					this.forbiddenWordsFound = forbiddenWordsFound;
				}
			}
		}

		return { grid, words: addedWords };
	}
	cleanWord(word: string) {
		return utils.normalizeWord(
			word,
			this.settings.upperCase,
			this.settings.diacritics
		);
	}
	dump() {
		return cloneDeep({ settings: this.settings, data: this.data });
	}
	load(config: typeof defaultSettings) {
		merge(this, config);
		return this;
	}
	read(start: utils.Position, end: utils.Position) {
		const path = utils.createPathFromPair(start, end);
		if (path) {
			return path.map(pos => this.data.grid[pos.y][pos.x]).join("");
		}
		return null;
	}
	toString() {
		return this.data.grid.map(l => l.join(" ")).join("\n");
	}
}