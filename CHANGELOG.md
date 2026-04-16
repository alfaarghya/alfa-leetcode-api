# Changelog

All notable changes to this project will be documented in this file.

## [2.0.4] - 2026-04-14

### Added

- Swagger/OpenAPI documentation for all API routes - by [@Morgan-Ngetich](https://github.com/Morgan-Ngetich) ([#93](https://github.com/alfaarghya/alfa-leetcode-api/pull/93))

### Changed

- Replace swagger-jsdoc with static swagger.yaml for maintainability
- Multi-stage Dockerfile for dev and prod builds
- Separate MCP documentation into dedicated MCP.md
- Add Docker dev setup instructions to CONTRIBUTING.md
- Update and fix contributor list in README

### Fixed

- Resolve shared rate limit bucket issue behind reverse proxy

## [2.0.3] - 2025-12-16

### Added

- Zod schema validation for contest routes - by [@nickbar01234](https://github.com/nickbar01234) ([#81](https://github.com/alfaarghya/alfa-leetcode-api/pull/81))
- Error handling for contest routes - by [@nickbar01234](https://github.com/nickbar01234) ([#81](https://github.com/alfaarghya/alfa-leetcode-api/pull/81))
- Complete unit and integration test suite with Vitest ([#85](https://github.com/alfaarghya/alfa-leetcode-api/pull/85))
- Husky pre-commit hooks with lint-staged
- BiomeJS for linting and formatting
- Contributing guide documentation (CONTRIBUTING.md)

### Changed

- Migrate test framework from Jest to Vitest ([#83](https://github.com/alfaarghya/alfa-leetcode-api/pull/83))
- Format all source and test files with Biome
- Update demo images and fix typos in documentation - by [@DarrylMathias](https://github.com/DarrylMathias) ([#82](https://github.com/alfaarghya/alfa-leetcode-api/pull/82))

### Removed

- Prettier configuration (replaced by BiomeJS)
- Jest configuration and dependencies

## [2.0.2] - 2025-10-25

### Added

- MCP (Model Context Protocol) server with modular architecture for AI assistant integration - by [@devroopsaha744](https://github.com/devroopsaha744) ([#71](https://github.com/alfaarghya/alfa-leetcode-api/pull/71))
- Endpoints for `/all-contests` and `/upcoming-contests` - by [@Ayushman2004](https://github.com/Ayushman2004) ([#74](https://github.com/alfaarghya/alfa-leetcode-api/pull/74))
- Remaining TODO route implementations - by [@Ahmed-Armaan](https://github.com/Ahmed-Armaan) ([#66](https://github.com/alfaarghya/alfa-leetcode-api/pull/66))
- API route documentation on root endpoint - by [@Ahmed-Armaan](https://github.com/Ahmed-Armaan) ([#66](https://github.com/alfaarghya/alfa-leetcode-api/pull/66))
- GitHub issue templates

### Changed

- Refactor code structure and organize codebase
- Migrate unformatted routes to formatted routes ([#70](https://github.com/alfaarghya/alfa-leetcode-api/pull/70))
- Increase API rate limit
- Update all package versions and run npm audit fix
- Update Docker image configuration
- Refactor MCP server: extract types to `types.ts` and simplify architecture - by [@devroopsaha744](https://github.com/devroopsaha744) ([#71](https://github.com/alfaarghya/alfa-leetcode-api/pull/71))

## [2.0.1] - 2025-06-29

### Added

- New `/selectQuestion` API endpoint to get raw version of a selected question by title slug - by [@Ar0manKhan](https://github.com/Ar0manKhan) ([#60](https://github.com/alfaarghya/alfa-leetcode-api/pull/60))

## [2.0.0] - 2024-11-02

### Added

- Docker image and Docker Compose support
- `skip` parameter for `/problems` API pagination - by [@ajchili](https://github.com/ajchili) ([#27](https://github.com/alfaarghya/alfa-leetcode-api/pull/27))
- Difficulty-based filtering for problems endpoint - by [@P-M-Manmohan](https://github.com/P-M-Manmohan) ([#40](https://github.com/alfaarghya/alfa-leetcode-api/pull/40))
- API route descriptions and method documentation - by [@123xylem](https://github.com/123xylem) ([#38](https://github.com/alfaarghya/alfa-leetcode-api/pull/38))

### Changed

- Complete V2 architecture rewrite
- Rename and rebrand project to alfa-leetcode-api
- Refactor trendingDiscuss and languageStats to follow code conventions - by [@changchunlei](https://github.com/changchunlei) ([#17](https://github.com/alfaarghya/alfa-leetcode-api/pull/17))
- Improve documentation wording and fix typos - by [@sazsu](https://github.com/sazsu) ([#37](https://github.com/alfaarghya/alfa-leetcode-api/pull/37))

### Fixed

- Hot reload issue in development environment - by [@merakesh99](https://github.com/merakesh99) ([#25](https://github.com/alfaarghya/alfa-leetcode-api/pull/25))
- Route naming corrections
- Skip parameter handling - by [@theinit01](https://github.com/theinit01) ([#33](https://github.com/alfaarghya/alfa-leetcode-api/pull/33))

### Removed

- `questionOfTodayQuery` (replaced with updated daily problem query) - by [@changchunlei](https://github.com/changchunlei) ([#17](https://github.com/alfaarghya/alfa-leetcode-api/pull/17))
- Undefined and unused routes

## [1.0.0] - 2024-05-29

### Added

- AC (Accepted) Submissions API endpoint (`/acSubmission`) - by [@aryanpingle](https://github.com/aryanpingle) ([#1](https://github.com/alfaarghya/alfa-leetcode-api/pull/1))
- TypeScript refactor with full type safety - by [@jamesh48](https://github.com/jamesh48) ([#5](https://github.com/alfaarghya/alfa-leetcode-api/pull/5))
- Test suite for user, daily problem, problems, and selectProblem endpoints - by [@jamesh48](https://github.com/jamesh48) ([#6](https://github.com/alfaarghya/alfa-leetcode-api/pull/6))
- Language statistics, user profile calendar, contest details, and discussion APIs - by [@changchunlei](https://github.com/changchunlei) ([#15](https://github.com/alfaarghya/alfa-leetcode-api/pull/15))
- User birthday details endpoint
- CORS support for cross-origin requests
- Rate limiting middleware (express-rate-limit)
- Contribution guide (CONTRIBUTING.md)

### Changed

- Use `PORT` environment variable for server configuration - by [@kvqn](https://github.com/kvqn) ([#10](https://github.com/alfaarghya/alfa-leetcode-api/pull/10))
- Add Bun lock file for alternative package manager support - by [@kvqn](https://github.com/kvqn) ([#10](https://github.com/alfaarghya/alfa-leetcode-api/pull/10))

## [0.1.0] - 2024-01-22

### Added

- Initial LeetCode REST API with JavaScript, Node.js and Express.js
- User profile, badges, and solved questions endpoints
- Daily question and problem selection endpoints
- Vercel deployment configuration
- README with project documentation and demo images
- MIT License
