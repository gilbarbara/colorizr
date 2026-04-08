import convert from '~/convert';
import hsl2hex from '~/converters/hsl2hex';
import { MESSAGES, MONOCHROMATIC_LIGHTNESS_MAX } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { resolveColor } from '~/modules/parsed-color';
import { isPlainObject, isString } from '~/modules/validators';
import rotate from '~/rotate';

import { ColorType, HEX } from '~/types';

export interface PaletteOptions {
  /**
   * Output color format.
   *
   * If not specified, the output will use the same format as the input color.
   */
  format?: ColorType;
  /**
   * Adjusts the lightness of the base color before generating the palette.
   *
   * Value should be between 0 and 100.
   */
  lightness?: number;
  /**
   * Adjusts the saturation of the base color before generating the palette.
   *
   * Value should be between 0 and 100.
   */
  saturation?: number;
  /**
   * The number of colors to generate in the palette.
   *
   * Minimum value is 2.
   * @default 6
   */
  size?: number;
  /**
   * Generate a monochromatic palette.
   *
   * For more options, use the `scale` function.
   */
  type?: 'monochromatic';
}

/**
 * Generate a color palette from a base color.
 *
 * @param input - The base color string.
 * @param options - Palette generation options.
 * @returns An array of color strings.
 */
export default function palette(input: string, options: PaletteOptions = {}): string[] {
  invariant(isString(input), MESSAGES.inputString);
  invariant(isPlainObject(options), MESSAGES.options);

  const { format, lightness, saturation, size = 6, type } = options;

  invariant(size >= 2, MESSAGES.paletteSize);

  const parsed = resolveColor(input);
  const { hsl } = parsed;
  const colorFormat = format ?? parsed.type;

  const output: string[] = [];

  if (type === 'monochromatic') {
    const step = MONOCHROMATIC_LIGHTNESS_MAX / size;

    for (let index = size; index > 0; index--) {
      output.push(hsl2hex({ ...hsl, l: step * index }));
    }
  } else {
    const step = 360 / size;

    output.push(hsl2hex({ ...hsl, l: lightness ?? hsl.l, s: saturation ?? hsl.s }));

    for (let index = 1; index < size; index++) {
      const color = rotate(input, step * index, 'hex') as HEX;
      const rotatedHsl = resolveColor(color).hsl;

      output.push(hsl2hex({ ...rotatedHsl, l: lightness ?? hsl.l, s: saturation ?? hsl.s }));
    }
  }

  return output.map(color => convert(color, colorFormat));
}
