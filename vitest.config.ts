import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    pool: 'forks', // Use process forking for better MSW compatibility
    setupFiles: ['./tests/msw/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'src/Controllers/**/*.ts',
        'src/FormatUtils/**/*.ts',
        'src/app.ts',
        'src/leetCode.ts',
      ],
      exclude: [
        'node_modules/',
        'dist/',
        'tests/',
        'src/GQLQueries/**/*.ts',
        'src/schema/**/*.ts',
        'src/__tests__/**/*.ts',
        '**/*.spec.ts',
        '**/*.test.ts',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
});
