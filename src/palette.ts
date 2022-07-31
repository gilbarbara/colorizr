import hex2hsl from './hex2hsl';
import hsl2hex from './hsl2hex';
import { invariant, isPlainObject, isString, messages } from './modules/utils';
import parseCSS from './parse-css';
import rotate from './rotate';
import { PaletteOptions } from './types';

export default function palette(input: string, options: PaletteOptions = {}): string[] {
  invariant(isString(input), messages.inputString);
  invariant(isPlainObject(options), messages.options);

  const { lightness, saturation, size = 6, type } = options;
  const hsl = hex2hsl(parseCSS(input));
  const output: string[] = [];

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

      output.push(hsl2hex({ ...hsl, l: lightness || hsl.l, s: saturation || hsl.s }));

      for (let index = 1; index < size; index++) {
        const color = rotate(input, hsl.h + step * index);

        output.push(hsl2hex({ ...hex2hsl(color), l: lightness || hsl.l, s: saturation || hsl.s }));
      }

      break;
    }
  }

  return output;
}
