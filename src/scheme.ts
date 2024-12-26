import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { isHex, isNamedColor, isString } from '~/modules/validators';

import convert from '~/convert';
import extractColorParts from '~/extract-color-parts';
import rotate from '~/rotate';
import { ColorType } from '~/types';

export type Scheme =
  | 'analogous'
  | 'complementary'
  | 'rectangle'
  | 'split'
  | 'split-complementary'
  | 'square'
  | 'tetradic'
  | 'triadic';

export interface SchemeOptions {
  /**
   * Output color format.
   *
   * If not specified, the output will use the same format as the input color.
   */
  format?: ColorType;
  /**
   * The type of scheme to generate.
   * @default 'complementary'
   */
  type?: Scheme;
}

/**
 * Get the scheme for a color.
 */
export default function scheme(input: string, typeOrOptions?: Scheme | SchemeOptions): string[] {
  invariant(isString(input), MESSAGES.inputString);
  const { format, type = 'complementary' } = isString(typeOrOptions)
    ? { type: typeOrOptions }
    : (typeOrOptions ?? {});

  const output = isHex(input) || isNamedColor(input) ? 'hex' : extractColorParts(input).model;

  const colors: string[] = [];

  switch (type) {
    case 'analogous': {
      colors.push(rotate(input, -30), input, rotate(input, 30));
      break;
    }
    case 'complementary': {
      colors.push(input, rotate(input, 180));
      break;
    }

    case 'split':
    case 'split-complementary': {
      colors.push(input, rotate(input, 150), rotate(input, 210));
      break;
    }
    case 'triadic': {
      colors.push(input, rotate(input, 120), rotate(input, 240));
      break;
    }

    case 'tetradic':
    case 'rectangle': {
      colors.push(input, rotate(input, 60), rotate(input, 180), rotate(input, 240));
      break;
    }
    case 'square': {
      colors.push(input, rotate(input, 90), rotate(input, 180), rotate(input, 270));
      break;
    }
    default: {
      throw new TypeError('invalid type');
    }
  }

  return colors.map(color => convert(color, format ?? output));
}
