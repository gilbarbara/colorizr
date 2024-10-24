import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { isHex, isNamedColor, isPlainObject, isString } from '~/modules/validators';

import convert from '~/convert';
import hex2hsl from '~/converters/hex2hsl';
import hsl2hex from '~/converters/hsl2hex';
import extractColorParts from '~/extract-color-parts';
import parseCSS from '~/parse-css';
import rotate from '~/rotate';
import { ColorType, HEX } from '~/types';

export interface PaletteOptions {
  format?: ColorType;
  lightness?: number;
  saturation?: number;
  /**
   * The number of colors to generate
   * @default 6
   */
  size?: number;
  type?: 'monochromatic';
}

export default function palette(input: string, options: PaletteOptions = {}): string[] {
  invariant(isString(input), MESSAGES.inputString);
  invariant(isPlainObject(options), MESSAGES.options);

  const { format, lightness, saturation, size = 6, type } = options;
  const hsl = parseCSS(input, 'hsl');
  const output: string[] = [];
  const colorFormat = isHex(input) || isNamedColor(input) ? 'hex' : extractColorParts(input).model;

  switch (type) {
    case 'monochromatic': {
      const step = 80 / size;

      for (let index = size; index > 0; index--) {
        output.push(hsl2hex({ ...hsl, l: step * index }));
      }

      break;
    }
    default: {
      const step = 360 / size;

      output.push(hsl2hex({ ...hsl, l: lightness ?? hsl.l, s: saturation ?? hsl.s }));

      for (let index = 1; index < size; index++) {
        const color = rotate(input, hsl.h + step * index, 'hex') as HEX;

        output.push(hsl2hex({ ...hex2hsl(color), l: lightness ?? hsl.l, s: saturation ?? hsl.s }));
      }

      break;
    }
  }

  return output.map(color => convert(color, format ?? colorFormat));
}
