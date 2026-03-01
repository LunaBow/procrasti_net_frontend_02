// @ts-nocheck
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import svelte from '@astrojs/svelte';

import tailwindcss from '@tailwindcss/vite';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  output: 'server',

  adapter: netlify(),

  integrations: [svelte()],

  vite: {
    plugins: [tailwindcss()]
  }
});