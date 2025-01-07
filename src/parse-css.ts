import { MESSAGES, PRECISION } from '~/modules/constants';
import { CSSColor, cssColors } from '~/modules/css-colors';
import { convertAlphaToHex, extractAlphaFromHex, removeAlphaFromHex } from '~/modules/hex-utils';
import { invariant } from '~/modules/invariant';
import { addAlpha, round } from '~/modules/utils';
import { isHex, isNamedColor, isString } from '~/modules/validators';

import * as converters from '~/converters';
import extractColorParts from '~/extract-color-parts';
import { ColorReturn, ColorTuple, ColorType } from '~/types';

/**
 * Parse CSS color
 */
export default function parseCSS<T extends ColorType>(input: string, format?: T): ColorReturn<T> {
  invariant(isString(input), MESSAGES.inputString);

  let result: any;

  const value = isNamedColor(input) ? cssColors[input.toLowerCase() as CSSColor] : input;

  const output = format ?? (isHex(value) ? 'hex' : extractColorParts(value).model);

  const colorParams = (params: Record<string, number>) => Object.values(params) as ColorTuple;

  if (isHex(value)) {
    const alpha = extractAlphaFromHex(value);

    switch (output) {
      case 'hsl': {
        result = addAlpha(converters.hex2hsl(value), alpha);
        break;
      }
      case 'oklab': {
        result = addAlpha(converters.hex2oklab(value), alpha);
        break;
      }
      case 'oklch': {
        result = addAlpha(converters.hex2oklch(value), alpha);
        break;
      }
      case 'rgb': {
        result = addAlpha(converters.hex2rgb(value), alpha);
        break;
      }
      default: {
        result = `${removeAlphaFromHex(value)}${alpha !== 1 ? convertAlphaToHex(alpha) : ''}`;
        break;
      }
    }

    return result as ColorReturn<T>;
  }

  switch (output) {
    case 'hsl': {
      const { alpha, model, ...color } = extractColorParts(value);

      if (['oklab', 'oklch'].includes(model) && color.l > 1) {
        color.l = round(color.l / 100, PRECISION);
      }

      result = addAlpha(
        model === 'hsl' ? color : converters[`${model}2hsl`](colorParams(color)),
        alpha,
      );

      break;
    }
    case 'oklab': {
      const { alpha, model, ...color } = extractColorParts(value);

      if (['oklab', 'oklch'].includes(model) && color.l > 1) {
        color.l = round(color.l / 100, PRECISION);
      }

      result = addAlpha(
        model === 'oklab' ? color : converters[`${model}2oklab`](colorParams(color)),
        alpha,
      );

      break;
    }
    case 'oklch': {
      const { alpha, model, ...color } = extractColorParts(value);

      if (['oklab', 'oklch'].includes(model) && color.l > 1) {
        color.l = round(color.l / 100, PRECISION);
      }

      result = addAlpha(
        model === 'oklch' ? color : converters[`${model}2oklch`](colorParams(color)),
        alpha,
      );
      break;
    }
    case 'rgb': {
      const { alpha, model, ...color } = extractColorParts(value);

      if (['oklab', 'oklch'].includes(model) && color.l > 1) {
        color.l /= 100;
      }

      result = addAlpha(
        model === 'rgb' ? color : converters[`${model}2rgb`](colorParams(color)),
        alpha,
      );
      break;
    }

    case 'hex':
    default: {
      const { alpha, model, ...color } = extractColorParts(value);
      let alphaPrefix = '';

      if (['oklab', 'oklch'].includes(model) && color.l > 1) {
        color.l = round(color.l / 100, PRECISION);
      }

      if (alpha) {
        alphaPrefix = convertAlphaToHex(alpha);
      }

      result = `${converters[`${model}2hex`](colorParams(color))}${alphaPrefix}`;

      break;
    }
  }

  return result as ColorReturn<T>;
}
