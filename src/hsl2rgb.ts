import hue2rgb from './modules/hue2rgb';
import { invariant, isHSL, messages, round } from './modules/utils';
import { HSL, RGB } from './types';

/**
 * Convert an HSL object to RGB.
 */
export default function hsl2rgb(input: HSL): RGB {
  invariant(!!input, messages.inputString);

  invariant(isHSL(input), 'invalid input');

  const h = round(input.h) / 360;
  const s = round(input.s) / 100;
  const l = round(input.l) / 100;

  let r;
  let g;
  let b;

  let point;
  let chroma;

  if (s === 0) {
    r = l;
    g = l;
    b = l;
  } else {
    chroma = l < 0.5 ? l * (1 + s) : l + s - l * s;
    point = 2 * l - chroma;

    r = hue2rgb(point, chroma, h + 1 / 3);
    g = hue2rgb(point, chroma, h);
    b = hue2rgb(point, chroma, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}
