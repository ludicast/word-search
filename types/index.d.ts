import * as utils from "./utils";
import { defaultSettings } from "./defaultsettings";
export declare class WordSearch {
    settings: typeof defaultSettings;
    data: {
        grid: string[][];
        words: Array<{
            word: string;
            clean: string;
            path: any;
        }>;
    };
    forbiddenWordsFound: any[];
    constructor(options?: {});
    get grid(): string[][];
    get words(): {
        word: string;
        clean: string;
        path: any;
    }[];
    get cleanForbiddenWords(): string[];
    get forbiddenWordsIncluded(): any[];
    get defaultSettings(): {
        cols: number;
        rows: number;
        disabledDirections: any[];
        allowedDirections: string[];
        dictionary: string[];
        maxWords: number;
        backwardsProbability: number;
        upperCase: boolean;
        diacritics: boolean;
        forbiddenWords: string[];
        maxRetries: number;
    };
    get utils(): typeof utils;
    buildGame(retries?: number): {
        grid: string[][];
        words: Array<{
            word: string;
            clean: string;
            path: any;
        }>;
    };
    cleanWord(word: string): string;
    dump(): {
        settings: {
            cols: number;
            rows: number;
            disabledDirections: any[];
            allowedDirections: string[];
            dictionary: string[];
            maxWords: number;
            backwardsProbability: number;
            upperCase: boolean;
            diacritics: boolean;
            forbiddenWords: string[];
            maxRetries: number;
        };
        data: {
            grid: string[][];
            words: Array<{
                word: string;
                clean: string;
                path: any;
            }>;
        };
    };
    load(config: typeof defaultSettings): this;
    read(start: utils.Position, end: utils.Position): string;
    toString(): string;
}
