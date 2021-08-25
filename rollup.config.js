
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json'

export default [
  {
    input: 'src/main.ts',
    output: {
      name: 'shareLocalstorage',
      file: 'dist/main.iife.js',
      format: 'iife'
    },
    plugins: [typescript(), json()]
  },
  {
    input: 'src/main.ts',
    output: {
      file: 'dist/main.es.js',
      format: 'es'
    },
    plugins: [typescript(), json()]
  },
  {
    input: 'src/main.ts',
    output: {
      exports: 'default',
      file: 'dist/main.cjs.js',
      format: 'cjs'
    },
    plugins: [typescript(), json()]
  }
]
