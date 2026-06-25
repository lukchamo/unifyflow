import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Product docs & the original HTML prototype (generated runtime JS) — not app code.
    "docs/**",
    // Cloud Functions have their own toolchain (CommonJS, own tsconfig); the
    // compiled lib/ output and src/ are linted via `npm --prefix functions run lint`.
    "functions/**",
  ]),
]);

export default eslintConfig;
