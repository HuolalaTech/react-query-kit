import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import size from 'rollup-plugin-size'
import { terser } from 'rollup-plugin-terser'
import visualizer from 'rollup-plugin-visualizer'

const umdDevPlugin = type =>
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

  return [esm(options), cjs(options), umdDev(options), umdProd(options)]
}

function esm({ input, external }) {
  return {
    // ESM
    external,
    input,
    output: {
      format: 'esm',
      sourcemap: true,
      dir: `build/esm`,
    },
    plugins: [babelPlugin, nodeResolve({ extensions })],
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
      dir: `build/cjs`,
      preserveModules: true,
      exports: 'named',
    },
    plugins: [babelPlugin, nodeResolve({ extensions })],
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
      nodeResolve({ extensions }),
      umdDevPlugin('development'),
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
      nodeResolve({ extensions }),
      umdDevPlugin('production'),
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
