import rgb2Hsl from './rgb2hsl';
import { isRGB, isHSL, isNumber, isPlainObject, invariant, messages } from './utils';
import { FormatOptions, HSL, RGB } from './types';
import hsl2rgb from './hsl2rgb';

export default function formatCSS(input: HSL | RGB, options: FormatOptions = {}): string {
  invariant(!isPlainObject(input) || (!isRGB(input) && !isHSL(input)), messages.invalid);

  const { alpha, model = isRGB(input) ? 'rgb' : 'hsl' } = options;
  const prefix = `${model}${isNumber(alpha) ? 'a' : ''}`;
  let color = input;
  let params = [];

  if (model === 'rgb') {
    if (isHSL(color)) {
      color = hsl2rgb(color);
    }

    params = [Math.round(color.r), Math.round(color.g), Math.round(color.b)];
  } else {
    if (isRGB(color)) {
      color = rgb2Hsl(color);
    }

    params = [Math.round(color.h), `${Math.round(color.s)}%`, `${Math.round(color.l)}%`];
  }

  if (isNumber(alpha)) {
    params.push(alpha);
  }

  return `${prefix}(${params.join(', ')})`;
}
