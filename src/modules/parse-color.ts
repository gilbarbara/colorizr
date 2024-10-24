import { MESSAGES } from '~/modules/constants';
import { addAlphaToHex } from '~/modules/hex-utils';
import { invariant } from '~/modules/invariant';
import { addAlpha, limit } from '~/modules/utils';
import { isHex, isHSL, isLAB, isLCH, isPlainObject, isRGB, isString } from '~/modules/validators';

import * as converters from '~/converters';
import extractColorParts from '~/extract-color-parts';
import parseCSS from '~/parse-css';
import { Colors, HSL, LAB, LCH, PlainObject, RGB } from '~/types';

export default function parseColor(color: string | HSL | LAB | LCH | RGB): Colors {
  invariant(!!color, MESSAGES.input);

  const output: PlainObject = {};

  if (isString(color)) {
    const { alpha = 1 } = extractColorParts(color);
    const type = isHex(color) ? 'hex' : extractColorParts(color).model;

    output.hex = addAlphaToHex(parseCSS(color, 'hex'), alpha);
    output.hsl = addAlpha(parseCSS(color, 'hsl'), alpha);
    output.oklab = addAlpha(parseCSS(color, 'oklab'), alpha);
    output.oklch = addAlpha(parseCSS(color, 'oklch'), alpha);
    output.rgb = addAlpha(parseCSS(color, 'rgb'), alpha);

    output.alpha = alpha;
    output.type = type;
  } else if (isPlainObject(color)) {
    const { alpha = 1 } = color;

    if (isHSL(color)) {
      output.hsl = {
        h: limit(color.h, 'hsl', 'h'),
        s: limit(color.s, 'hsl', 's'),
        l: limit(color.l, 'hsl', 'l'),
      };
      output.rgb = converters.hsl2rgb(output.hsl);
      output.oklab = converters.hsl2oklab(output.hsl);
      output.oklch = converters.hsl2oklch(output.hsl);
      output.type = 'hsl';
    } else if (isLAB(color)) {
      output.hsl = converters.oklab2hsl(color);
      output.oklab = color;
      output.oklch = converters.oklab2oklch(color);
      output.rgb = converters.oklab2rgb(color);
      output.type = 'oklab';
    } else if (isLCH(color)) {
      output.hsl = converters.oklch2hsl(color);
      output.oklab = converters.oklch2oklab(color);
      output.oklch = color;
      output.rgb = converters.oklch2rgb(color);
      output.type = 'oklch';
    } else if (isRGB(color)) {
      output.rgb = {
        r: limit(color.r, 'rgb', 'r'),
        g: limit(color.g, 'rgb', 'g'),
        b: limit(color.b, 'rgb', 'b'),
      };
      output.hsl = converters.rgb2hsl(output.rgb);
      output.oklab = converters.rgb2oklab(output.rgb);
      output.oklch = converters.rgb2oklch(output.rgb);
      output.type = 'rgb';
    } else {
      throw new Error('invalid color');
    }

    output.hex = addAlphaToHex(converters.hsl2hex(output.hsl), alpha);
    output.hsl = addAlpha(output.hsl, alpha);
    output.oklab = addAlpha(output.oklab, alpha);
    output.oklch = addAlpha(output.oklch, alpha);
    output.rgb = addAlpha(output.rgb, alpha);

    output.alpha = alpha;
  } else {
    throw new Error(MESSAGES.input);
  }

  return output as Colors;
}
