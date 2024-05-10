import { babel } from '@rollup/plugin-babel'
import commonJS from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import size from 'rollup-plugin-size'
import { terser } from 'rollup-plugin-terser'
import visualizer from 'rollup-plugin-visualizer'

const replaceDevPlugin = type =>
  replace({
    'process.env.NODE_ENV': `"${type}"`,
    delimiters: ['', ''],
    preventAssignment: true,
  })
const extensions = ['.ts', '.tsx']
const babelPlugin = babel({
  babelHelpers: 'bundled',
  exclude: /node_modules/,
  extensions,
})

export default function rollup() {
  const options = {
    input: 'src/index.ts',
    jsName: 'ReactQueryKit',
    external: ['@tanstack/react-query'],
    globals: {
      '@tanstack/react-query': 'ReactQuery',
    },
  }

  return [
    mjs(options),
    esm(options),
    cjs(options),
    umdDev(options),
    umdProd(options),
  ]
}

function mjs({ input, external }) {
  return {
    // ESM
    external,
    input,
    output: {
      format: 'esm',
      sourcemap: true,
      dir: `build/lib`,
      preserveModules: true,
      entryFileNames: '[name].mjs',
    },
    plugins: [babelPlugin, commonJS(), nodeResolve({ extensions })],
  }
}

function esm({ input, external }) {
  return {
    // ESM
    external,
    input,
    output: {
      format: 'esm',
      dir: `build/lib`,
      sourcemap: true,
      preserveModules: true,
      entryFileNames: '[name].esm.js',
    },
    plugins: [babelPlugin, commonJS(), nodeResolve({ extensions })],
  }
}

function cjs({ input, external }) {
  return {
    // CJS
    external,
    input,
    output: {
      format: 'cjs',
      sourcemap: true,
      dir: `build/lib`,
      preserveModules: true,
      exports: 'named',
      entryFileNames: '[name].js',
    },
    plugins: [babelPlugin, commonJS(), nodeResolve({ extensions })],
  }
}

function umdDev({ input, external, globals, jsName }) {
  return {
    // UMD (Dev)
    external,
    input,
    output: {
      format: 'umd',
      sourcemap: true,
      file: `build/umd/index.development.js`,
      name: jsName,
      globals,
    },
    plugins: [
      babelPlugin,
      commonJS(),
      nodeResolve({ extensions }),
      replaceDevPlugin('development'),
    ],
  }
}

function umdProd({ input, external, globals, jsName }) {
  return {
    // UMD (Prod)
    external,
    input,
    output: {
      format: 'umd',
      sourcemap: true,
      file: `build/umd/index.production.js`,
      name: jsName,
      globals,
    },
    plugins: [
      babelPlugin,
      commonJS(),
      nodeResolve({ extensions }),
      replaceDevPlugin('production'),
      terser({
        mangle: true,
        compress: true,
      }),
      size({}),
      visualizer({
        filename: `build/stats-html.html`,
        gzipSize: true,
      }),
      visualizer({
        filename: `build/stats.json`,
        json: true,
        gzipSize: true,
      }),
    ],
  }
}
