import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  dts: true,
  clean: true,
  outExtensions: () => ({ js: '.js', dts: '.d.ts' }),
  external: [/^react/, /^@?radix-ui/, 'sonner', 'motion', 'recharts', /^@tanstack/],
})
