// Build script: bundles src/ into the single main.js the game loads.
// Usage: `npm run build` (one-shot) or `npm run watch` (rebuild on save).
import { build, context } from 'esbuild';

const options = {
    entryPoints: ['src/index.js'],
    bundle: true,
    format: 'iife',          // game loads main.js as a plain script, not a module
    target: 'es2020',        // Cookie Clicker runs in a modern Electron/Chromium
    outfile: 'main.js',
    legalComments: 'none',
    banner: {
        js: '// GENERATED from src/ by esbuild — DO NOT edit main.js directly.\n'
          + '// Edit the files under src/ and run `npm run build` (or `npm run watch`).',
    },
};

if (process.argv.includes('--watch')) {
    const ctx = await context(options);
    await ctx.watch();
    console.log('esbuild: watching src/ …');
} else {
    await build(options);
    console.log('esbuild: built main.js');
}
