import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/schema/index.ts',
  ],
  sourcemap: false,
  clean: true,
  dts: true,
  shims: true,
  treeshake: true,
  format: ['cjs', 'esm'],
  outExtension({ format }) {
    if (format === 'cjs')
      return { js: '.cjs' }
    else if (format === 'esm')
      return { js: '.mjs' }
    else
      return { js: '.js' }
  },
})
