import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest', // Preset to use TypeScript through ts-jest
    testEnvironment: 'node', // Environment under which the tests will be run
    collectCoverage: true, // Enable coverage collection
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'], // File extensions to process
    modulePathIgnorePatterns: ["<rootDir>/cdk.out/"], // Ignore cdk.out directory to prevent module naming collisions
    testPathIgnorePatterns: ["/node_modules/", "\\.js$",  "/cdk.out/"], // Ignore node_modules and cdk.out in test paths
    coveragePathIgnorePatterns: ["/node_modules/", "/cdk.out/"], // Avoid collecting coverage from these directories
    transform: {
        '^.+\\.ts$': 'ts-jest', // Use ts-jest for transpiling TypeScript files
    },
    collectCoverageFrom: [
        '**/*.{ts,tsx}', // Collect coverage from all TypeScript and TypeScript React files
        '!**/node_modules/**', // Do not collect coverage from node_modules
        '!**/vendor/**', // Do not collect coverage from vendor, if applicable
        '!**/*.d.ts', // Exclude TypeScript declaration files from coverage
        '!**/cdk.out/**' // Exclude cdk.out from coverage if it contains transpiled code or tests
    ],
};

export default config;