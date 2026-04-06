import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    // Use jsdom so tests can interact with DOM APIs (localStorage, etc.)
    environment: 'jsdom',
    // Auto-import @testing-library/jest-dom matchers in every test file
    setupFiles: ['./src/test/setup.js'],
    globals: true,
  },
});
