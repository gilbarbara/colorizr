import hex2hsl from './hex2hsl';
import hex2rgb from './hex2rgb';
import hsl2hex from './hsl2hex';
import hsl2rgb from './hsl2rgb';
import isValidHex from './is-valid-hex';
import { cssColors } from './modules/css-colors';
import { invariant, isString, messages } from './modules/utils';
import rgb2hex from './rgb2hex';
import rgb2hsl from './rgb2hsl';
import { ColorTypes, Return } from './types';

/**
 * Parse CSS color
 */
export default function parseCSS<T extends ColorTypes = 'hex'>(
  input: unknown,
  output?: T,
): Return<T> {
  invariant(isString(input), messages.inputString);
  let result: any;

  const parsedInput = cssColors[input.toLowerCase() as keyof typeof cssColors] || input;

  if (isValidHex(parsedInput)) {
    switch (output) {
      case 'hsl': {
        result = hex2hsl(parsedInput);
        break;
      }
      case 'rgb': {
        result = hex2rgb(parsedInput);
        break;
      }
      default: {
        result = parsedInput;
        break;
      }
    }
  } else {
    // TODO: improve the pattern to require 3 groups
    const matches = parsedInput.match(
      /(hsl|rgb)a?\((\d+)(?:,\s*|\s+)(\d+)%?(?:,\s*|\s+)(\d+)%?[^)]*\)/i,
    );

    invariant(Array.isArray(matches), 'invalid CSS string');
    invariant(matches.length === 5, 'invalid CSS string');

    const [, model, hORr, sORg, lORb] = matches;
    let hex;
    let hsl;
    let rgb;

    if (model === 'hsl') {
      hsl = {
        h: parseInt(hORr, 10),
        s: parseInt(sORg, 10),
        l: parseInt(lORb, 10),
      };
      hex = hsl2hex(hsl);
      rgb = hsl2rgb(hsl);
    } else {
      rgb = {
        r: parseInt(hORr, 10),
        g: parseInt(sORg, 10),
        b: parseInt(lORb, 10),
      };
      hex = rgb2hex(rgb);
      hsl = rgb2hsl(rgb);
    }

    switch (output) {
      case 'hsl': {
        result = hsl;
        break;
      }
      case 'rgb': {
        result = rgb;
        break;
      }

      case 'hex':
      default: {
        result = hex;
        break;
      }
    }
  }

  return result as Return<T>;
}
