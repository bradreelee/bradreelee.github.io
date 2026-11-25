// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// GitHub Pages:
// - Repo named "<username>.github.io" → site: 'https://<username>.github.io', no base.
// - Any other repo name (e.g. "portfolio") → also set base: '/portfolio'.
// https://astro.build/config
export default defineConfig({
  site: 'https://bradreelee.github.io',
  vite: {
    plugins: [tailwindcss()]
  }
});
