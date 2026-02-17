/**
 * Theme creation utility.
 *
 * `createTheme()` deep-merges partial overrides with the default base theme,
 * producing a complete `CastTheme` object. This is the primary API for
 * creating custom branded themes.
 *
 * ```ts
 * import { createTheme, defaultTheme } from '@castui/cast-ui';
 * import overrides from './my-brand.json';
 *
 * const myTheme = createTheme(overrides);
 * // → complete CastTheme with your overrides applied on top of defaultTheme
 * ```
 */

import type { CastTheme } from './types';

// ---------------------------------------------------------------------------
// DeepPartial utility type
// ---------------------------------------------------------------------------

/**
 * Recursively makes all properties of `T` optional.
 * Useful for typing partial theme overrides passed to `createTheme()`.
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// ---------------------------------------------------------------------------
// Deep merge
// ---------------------------------------------------------------------------

/**
 * Recursively merge `source` into `target`, returning a new object.
 * - Objects are recursed into.
 * - Arrays and primitives from `source` replace `target` values.
 */
function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Record<string, unknown>,
): T {
  const result = { ...target } as Record<string, unknown>;

  for (const key of Object.keys(source)) {
    const sourceVal = source[key];
    const targetVal = result[key];

    if (
      sourceVal !== null &&
      typeof sourceVal === 'object' &&
      !Array.isArray(sourceVal) &&
      targetVal !== null &&
      typeof targetVal === 'object' &&
      !Array.isArray(targetVal)
    ) {
      result[key] = deepMerge(
        targetVal as Record<string, unknown>,
        sourceVal as Record<string, unknown>,
      );
    } else {
      result[key] = sourceVal;
    }
  }

  return result as T;
}

// ---------------------------------------------------------------------------
// createTheme
// ---------------------------------------------------------------------------

// Lazy reference to avoid circular import at module load time.
// `defaultTheme` is generated and imports from `types.ts`; this file also
// imports from `types.ts`, but we only need the *value* at call time.
let _defaultTheme: CastTheme | undefined;

function getDefaultTheme(): CastTheme {
  if (!_defaultTheme) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    _defaultTheme = require('../tokens/generated').defaultTheme as CastTheme;
  }
  return _defaultTheme;
}

/**
 * Create a complete `CastTheme` by deep-merging partial overrides with a
 * base theme (defaults to `defaultTheme`).
 *
 * Works with both small partial overrides *and* complete theme objects
 * exported from Figma.
 *
 * @param overrides – Partial theme values to apply on top of the base.
 * @param base – Optional base theme. Defaults to `defaultTheme`.
 * @returns A complete, merged `CastTheme` object.
 *
 * @example
 * ```ts
 * // Minimal override – only change the primary colour
 * const myTheme = createTheme({
 *   name: 'my-brand',
 *   semantic: { color: { primary: '#FF0000' } },
 * });
 *
 * // Full override from a JSON file
 * import overrides from './my-brand.json';
 * const myTheme = createTheme(overrides);
 * ```
 */
export function createTheme(
  overrides: DeepPartial<CastTheme>,
  base?: CastTheme,
): CastTheme {
  const baseTheme = base ?? getDefaultTheme();
  return deepMerge(
    baseTheme as unknown as Record<string, unknown>,
    overrides as unknown as Record<string, unknown>,
  ) as unknown as CastTheme;
}
