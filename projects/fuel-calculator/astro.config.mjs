// astro.config.mjs
import { defineConfig } from 'astro/config';

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  site: 'https://jamirawan.github.io',
  base: isProd ? '/tent-pg/projects/fuel-calculator' : '/',
});