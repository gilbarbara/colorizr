import { invariant, isHSL, isPlainObject, isRGB, isString, limit, messages } from './utils';

import hex2hsl from '../hex2hsl';
import hex2rgb from '../hex2rgb';
import hsl2hex from '../hsl2hex';
import hsl2rgb from '../hsl2rgb';
import isValidHex from '../is-valid-hex';
import parseCSS from '../parse-css';
import rgb2hex from '../rgb2hex';
import rgb2hsl from '../rgb2hsl';
import { Colors, HSL, PlainObject, RGB, RGBArray } from '../types';

export default function parseColor(color: string | HSL | RGB | RGBArray): Colors {
  invariant(!!color, messages.input);

  const output: PlainObject = {};

  if (isString(color)) {
    const hex = parseCSS(color) as string;

    invariant(isValidHex(hex), 'input is not valid');

    output.hex = hex;
    output.rgb = hex2rgb(hex);
    output.hsl = hex2hsl(hex);
  } else if (Array.isArray(color)) {
    output.rgb = {
      r: limit(color[0], 'r'),
      g: limit(color[1], 'g'),
      b: limit(color[2], 'b'),
    };

    output.hex = rgb2hex(output.rgb);
    output.hsl = rgb2hsl(output.rgb);
  } else if (isPlainObject(color)) {
    if (isHSL(color)) {
      output.hsl = {
        h: limit(color.h, 'h'),
        s: limit(color.s, 's'),
        l: limit(color.l, 'l'),
      };
      output.rgb = hsl2rgb(output.hsl);
    } else if (isRGB(color)) {
      output.rgb = {
        r: limit(color.r, 'r'),
        g: limit(color.g, 'g'),
        b: limit(color.b, 'b'),
      };
      output.hsl = rgb2hsl(output.rgb);
    } else {
      throw new Error('invalid color');
    }

    output.hex = hsl2hex(output.hsl);
  } else {
    throw new Error(messages.input);
  }

  return output as Colors;
}
