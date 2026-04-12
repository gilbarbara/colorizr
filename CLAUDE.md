# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Colorizr is a TypeScript color manipulation library supporting Hex, HSL, OkLab, OkLCH, and RGB color formats. It provides color conversion, generation, manipulation, comparison, and WCAG accessibility analysis.

## Commands

```bash
# Development
pnpm install              # Install dependencies
pnpm build                # Clean and build with tsup
pnpm watch                # Build in watch mode

# Testing
pnpm test                 # Run all tests
pnpm test:watch           # Interactive test watching
pnpm test:coverage        # Run tests with coverage
pnpm test filename.spec   # Run single test file

# Quality
pnpm lint                 # ESLint on src and test
pnpm typecheck            # TypeScript check
pnpm validate             # Full validation (lint + typecheck + test + build + size + typevalidation)
```

## Architecture

### Source Structure (`src/`)

- **Entry point**: `index.ts` exports all public functions and the `Colorizr` class
- **Path alias**: `~/*` maps to `src/*`

### Module Organization

- **Root level functions**: Each public function has its own file (e.g., `lighten.ts`, `darken.ts`, `contrast.ts`)
- **`converters/`**: Color format conversion functions (hex↔hsl↔rgb↔oklab↔oklch)
- **`modules/`**: Internal utilities
  - `parsed-color.ts`: Parse color strings to internal representations (with caching)
  - `validators.ts`: Type guards (`isHex`, `isHSL`, `isRGB`, `isLAB`, `isLCH`)
  - `alpha.ts`: Alpha channel utilities (add, extract, convert, remove)
  - `css-colors.ts`: Named CSS colors mapping
  - `constants.ts`: Shared constants and color range definitions
  - `invariant.ts`: Assertion helper for input validation
  - `updater.ts`: Color property update helpers
  - `utils.ts`: Shared utility functions
  - `linear-rgb.ts`: Linear RGB conversion matrices
  - `hue2rgb.ts`: Hue to RGB conversion helper
- **`types/`**: TypeScript type definitions
- **`colorizr.ts`**: Main class wrapping all functionality

### Color Types

The library works with these internal representations:
- `HSL`: `{ h: number, s: number, l: number }`
- `RGB`: `{ r: number, g: number, b: number }`
- `LAB` (OkLab): `{ l: number, a: number, b: number }`
- `LCH` (OkLCH): `{ l: number, c: number, h: number }`
- `ColorTuple`: `[number, number, number]`

### Test Structure

Tests are in `test/` with `.spec.ts` suffix. Vitest globals are enabled (no imports needed for `describe`, `it`, `expect`).

## Code Style

- ESLint config: `@gilbarbara/eslint-config`
- Prettier config: `@gilbarbara/prettier-config`
- TypeScript config: `@gilbarbara/tsconfig`
- Converters return full float precision by default; CSS output uses 5 significant digits
