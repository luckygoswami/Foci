import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import Pages from 'vite-plugin-pages';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    Pages({
      extensions: ['tsx'],

      // Eagerly load all /app routes to avoid re-rendering in authenticated paths
      importMode(filepath) {
        if (filepath.includes('/pages/app')) return 'sync';

        // Eagerly load root route to avoid re-rendering while redirecting to /app path
        if (filepath.includes('/pages/index')) return 'sync';

        return 'async';
      },
      extendRoute(route) {
        if (route.path == 'auth') {
          return route;
        }
        return {
          ...route,
          meta: {
            requiresAuth: true,
          },
        };
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
