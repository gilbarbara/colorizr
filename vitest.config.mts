import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    include: ['test/**/*.spec.ts?(x)'],
    isolate: false,
    coverage: {
      exclude: ['src/types/*.ts'],
      include: ['src/**/*.ts?(x)'],
      provider: 'v8',
      reporter: ['text', 'lcov'],
      thresholds: {
        statements: 90,
        branches: 80,
        functions: 90,
        lines: 90,
      },
    },
    globals: true,
  },
});
