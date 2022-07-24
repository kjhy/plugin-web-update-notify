import { defineConfig } from 'tsup'
import { INJECT_SCRIPT_FILE_NAME, INJECT_STYLE_FILE_NAME } from './src/constant'

export default defineConfig((options) => { // The options here is derived from CLI flags.
  return {
    entry: {
      index: 'src/index.ts',
      [INJECT_SCRIPT_FILE_NAME]: 'src/notify.ts',
      script: 'src/script.ts',
    },
    splitting: false,
    sourcemap: true,
    clean: true,
    dts: true,
    format: ['cjs', 'esm'],
    minify: !options.watch,
    onSuccess: `stylus -c src/notify.styl -o dist/${INJECT_STYLE_FILE_NAME}.css`,
  }
})
