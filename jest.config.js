"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    preset: 'ts-jest', // Preset to use TypeScript through ts-jest
    testEnvironment: 'node', // Environment under which the tests will be run
    collectCoverage: true, // Enable coverage collection
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'], // File extensions to process
    modulePathIgnorePatterns: ["<rootDir>/cdk.out/"], // Ignore cdk.out directory to prevent module naming collisions
    testPathIgnorePatterns: ["/node_modules/", "\\.js$", "/cdk.out/"], // Ignore node_modules and cdk.out in test paths
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
exports.default = config;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamVzdC5jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJqZXN0LmNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLE1BQU0sTUFBTSxHQUEwQjtJQUNsQyxNQUFNLEVBQUUsU0FBUyxFQUFFLDJDQUEyQztJQUM5RCxlQUFlLEVBQUUsTUFBTSxFQUFFLGdEQUFnRDtJQUN6RSxlQUFlLEVBQUUsSUFBSSxFQUFFLDZCQUE2QjtJQUNwRCxvQkFBb0IsRUFBRSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLEVBQUUsNkJBQTZCO0lBQy9GLHdCQUF3QixFQUFFLENBQUMsb0JBQW9CLENBQUMsRUFBRSwrREFBK0Q7SUFDakgsc0JBQXNCLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxRQUFRLEVBQUcsV0FBVyxDQUFDLEVBQUUsZ0RBQWdEO0lBQ3BILDBCQUEwQixFQUFFLENBQUMsZ0JBQWdCLEVBQUUsV0FBVyxDQUFDLEVBQUUsbURBQW1EO0lBQ2hILFNBQVMsRUFBRTtRQUNQLFdBQVcsRUFBRSxTQUFTLEVBQUUsK0NBQStDO0tBQzFFO0lBQ0QsbUJBQW1CLEVBQUU7UUFDakIsZUFBZSxFQUFFLGtFQUFrRTtRQUNuRixxQkFBcUIsRUFBRSw0Q0FBNEM7UUFDbkUsZUFBZSxFQUFFLHFEQUFxRDtRQUN0RSxZQUFZLEVBQUUscURBQXFEO1FBQ25FLGdCQUFnQixDQUFDLHdFQUF3RTtLQUM1RjtDQUNKLENBQUM7QUFFRixrQkFBZSxNQUFNLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IENvbmZpZyB9IGZyb20gJ0BqZXN0L3R5cGVzJztcblxuY29uc3QgY29uZmlnOiBDb25maWcuSW5pdGlhbE9wdGlvbnMgPSB7XG4gICAgcHJlc2V0OiAndHMtamVzdCcsIC8vIFByZXNldCB0byB1c2UgVHlwZVNjcmlwdCB0aHJvdWdoIHRzLWplc3RcbiAgICB0ZXN0RW52aXJvbm1lbnQ6ICdub2RlJywgLy8gRW52aXJvbm1lbnQgdW5kZXIgd2hpY2ggdGhlIHRlc3RzIHdpbGwgYmUgcnVuXG4gICAgY29sbGVjdENvdmVyYWdlOiB0cnVlLCAvLyBFbmFibGUgY292ZXJhZ2UgY29sbGVjdGlvblxuICAgIG1vZHVsZUZpbGVFeHRlbnNpb25zOiBbJ3RzJywgJ3RzeCcsICdqcycsICdqc3gnLCAnanNvbicsICdub2RlJ10sIC8vIEZpbGUgZXh0ZW5zaW9ucyB0byBwcm9jZXNzXG4gICAgbW9kdWxlUGF0aElnbm9yZVBhdHRlcm5zOiBbXCI8cm9vdERpcj4vY2RrLm91dC9cIl0sIC8vIElnbm9yZSBjZGsub3V0IGRpcmVjdG9yeSB0byBwcmV2ZW50IG1vZHVsZSBuYW1pbmcgY29sbGlzaW9uc1xuICAgIHRlc3RQYXRoSWdub3JlUGF0dGVybnM6IFtcIi9ub2RlX21vZHVsZXMvXCIsIFwiXFxcXC5qcyRcIiwgIFwiL2Nkay5vdXQvXCJdLCAvLyBJZ25vcmUgbm9kZV9tb2R1bGVzIGFuZCBjZGsub3V0IGluIHRlc3QgcGF0aHNcbiAgICBjb3ZlcmFnZVBhdGhJZ25vcmVQYXR0ZXJuczogW1wiL25vZGVfbW9kdWxlcy9cIiwgXCIvY2RrLm91dC9cIl0sIC8vIEF2b2lkIGNvbGxlY3RpbmcgY292ZXJhZ2UgZnJvbSB0aGVzZSBkaXJlY3Rvcmllc1xuICAgIHRyYW5zZm9ybToge1xuICAgICAgICAnXi4rXFxcXC50cyQnOiAndHMtamVzdCcsIC8vIFVzZSB0cy1qZXN0IGZvciB0cmFuc3BpbGluZyBUeXBlU2NyaXB0IGZpbGVzXG4gICAgfSxcbiAgICBjb2xsZWN0Q292ZXJhZ2VGcm9tOiBbXG4gICAgICAgICcqKi8qLnt0cyx0c3h9JywgLy8gQ29sbGVjdCBjb3ZlcmFnZSBmcm9tIGFsbCBUeXBlU2NyaXB0IGFuZCBUeXBlU2NyaXB0IFJlYWN0IGZpbGVzXG4gICAgICAgICchKiovbm9kZV9tb2R1bGVzLyoqJywgLy8gRG8gbm90IGNvbGxlY3QgY292ZXJhZ2UgZnJvbSBub2RlX21vZHVsZXNcbiAgICAgICAgJyEqKi92ZW5kb3IvKionLCAvLyBEbyBub3QgY29sbGVjdCBjb3ZlcmFnZSBmcm9tIHZlbmRvciwgaWYgYXBwbGljYWJsZVxuICAgICAgICAnISoqLyouZC50cycsIC8vIEV4Y2x1ZGUgVHlwZVNjcmlwdCBkZWNsYXJhdGlvbiBmaWxlcyBmcm9tIGNvdmVyYWdlXG4gICAgICAgICchKiovY2RrLm91dC8qKicgLy8gRXhjbHVkZSBjZGsub3V0IGZyb20gY292ZXJhZ2UgaWYgaXQgY29udGFpbnMgdHJhbnNwaWxlZCBjb2RlIG9yIHRlc3RzXG4gICAgXSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbmZpZzsiXX0=