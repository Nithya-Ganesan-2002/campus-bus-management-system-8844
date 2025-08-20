import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    include: [
      'src/**/*.{spec,test}.{ts,tsx,js,jsx}',
      'src/**/__tests__/**/test_*.{ts,tsx,js,jsx}',
    ],
    watch: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        'vitest.config.ts',
        'src/styles/**',
        'src/assets/**',
        'src/**/*.astro', // cover logic via TS modules
      ],
    },
  },
});
