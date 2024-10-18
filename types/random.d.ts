export type Seeder = (max?: number) => number;
export declare function seederRandom(seed?: string): Seeder;
export declare function seededShuffle<T>(array: T[], random?: Seeder): T[];
