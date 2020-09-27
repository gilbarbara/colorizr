import hex2hsl from './hex2hsl';
import hsl2hex from './hsl2hex';
import parseCSS from './parse-css';
import rotate from './rotate';
import { invariant, isPlainObject, isString, messages } from './utils';

import { PaletteOptions } from './types';

export default function palette(input: string, options: PaletteOptions = {}): string[] {
  invariant(!isString(input), messages.inputString);
  invariant(!isPlainObject(options), messages.options);

  const { lightness, saturation, size = 6, type } = options;
  const hsl = hex2hsl(parseCSS(input));
  const output: string[] = [];

  switch (type) {
    case 'monochromatic': {
      const step = 80 / size;

      for (let i = size; i > 0; i--) {
        output.push(hsl2hex({ ...hsl, l: step * i }));
      }

      break;
    }
    default: {
      const step = 360 / size;
      output.push(hsl2hex({ ...hsl, l: lightness || hsl.l, s: saturation || hsl.s }));
      for (let i = 1; i < size; i++) {
        const color = rotate(input, hsl.h + step * i);

        output.push(hsl2hex({ ...hex2hsl(color), l: lightness || hsl.l, s: saturation || hsl.s }));
      }

      break;
    }
  }

  return output;
}
