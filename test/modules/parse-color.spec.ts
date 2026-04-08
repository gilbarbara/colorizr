import parseColor from '~/modules/parse-color';
import { addAlpha } from '~/modules/utils';

import { LAB, LCH } from '~/types';

import { addOpacityToCssString, brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('parseColor', () => {
  it.each([
    {
      input: brightPink.hex,
      expected: {
        alpha: 1,
        hex: brightPink.hex,
        hsl: brightPink.hsl,
        oklab: brightPink.oklabLong,
        oklch: brightPink.oklchLong,
        rgb: brightPink.rgb,
        type: 'hex',
      },
    },
    {
      input: addOpacityToCssString(brightPink.hex, 0.9),
      expected: {
        alpha: 0.9,
        hex: addOpacityToCssString(brightPink.hex, 0.9),
        hsl: { alpha: 0.9, ...brightPink.hsl },
        oklab: { alpha: 0.9, ...brightPink.oklabLong },
        oklch: { alpha: 0.9, ...brightPink.oklchLong },
        rgb: { alpha: 0.9, ...brightPink.rgb },
        type: 'hex',
      },
    },
    {
      input: green.hslString,
      expected: {
        alpha: 1,
        hex: green.hex,
        hsl: green.hsl,
        oklab: green.oklabLong,
        oklch: green.oklchLong,
        rgb: green.rgb,
        type: 'hsl',
      },
    },
    {
      input: green.hsl,
      expected: {
        alpha: 1,
        hex: green.hex,
        hsl: green.hsl,
        oklab: green.oklabLong,
        oklch: green.oklchLong,
        rgb: green.rgb,
        type: 'hsl',
      },
    },
    {
      input: yellow.rgb,
      expected: {
        alpha: 1,
        hex: yellow.hex,
        hsl: yellow.hsl,
        oklab: yellow.oklabLong,
        oklch: yellow.oklchLong,
        rgb: yellow.rgb,
        type: 'rgb',
      },
    },
    {
      input: addOpacityToCssString(yellow.rgbString, 0.9),
      expected: {
        alpha: 0.9,
        hex: addOpacityToCssString(yellow.hex, 0.9),
        hsl: { alpha: 0.9, ...yellow.hsl },
        oklab: { alpha: 0.9, ...yellow.oklabLong },
        oklch: { alpha: 0.9, ...yellow.oklchLong },
        rgb: { alpha: 0.9, ...yellow.rgb },
        type: 'rgb',
      },
    },
  ])('should return properly for $input', ({ input, expected }) => {
    expect(parseColor(input)).toEqual(expected);
  });

  // Oklab/oklch inputs produce oklab/oklch values derived from the short input,
  // not from the original hex. We compute expected dynamically.
  it('should return properly for oklab object input', () => {
    const result = parseColor(orange.oklab);

    expect(result.alpha).toBe(1);
    expect(result.hex).toBe(orange.hex);
    expect(result.hsl).toEqual(orange.hsl);
    expect(result.rgb).toEqual(orange.rgb);
    expect(result.type).toBe('oklab');
    expect(result.oklab).toEqual(orange.oklab);
    expect(result.oklch.l).toBeCloseTo(orange.oklch.l, 4);
    expect(result.oklch.c).toBeCloseTo(orange.oklch.c, 4);
    expect(result.oklch.h).toBeCloseTo(orange.oklch.h, 2);
  });

  it('should return properly for oklab string input with alpha', () => {
    const result = parseColor(addOpacityToCssString(orange.oklabString, 0.9, true));
    const parsed = parseColor(orange.oklabString);

    expect(result.alpha).toBe(0.9);
    expect(result.hex).toBe(addOpacityToCssString(orange.hex, 0.9));
    expect(result.hsl).toEqual({ alpha: 0.9, ...orange.hsl });
    expect(result.rgb).toEqual({ alpha: 0.9, ...orange.rgb });
    expect(result.type).toBe('oklab');
    expect(result.oklab).toEqual(addAlpha<LAB>(parsed.oklab, 0.9));
    expect(result.oklch).toEqual(addAlpha<LCH>(parsed.oklch, 0.9));
  });

  it('should return properly for oklch string input', () => {
    const result = parseColor(violet.oklchString);

    expect(result.alpha).toBe(1);
    expect(result.hex).toBe(violet.hex);
    expect(result.hsl).toEqual(violet.hsl);
    expect(result.rgb).toEqual(violet.rgb);
    expect(result.type).toBe('oklch');
    expect(result.oklch.l).toBeCloseTo(violet.oklch.l, 4);
    expect(result.oklch.c).toBeCloseTo(violet.oklch.c, 4);
    expect(result.oklch.h).toBeCloseTo(violet.oklch.h, 2);
  });

  it('should return properly for oklch object input with alpha', () => {
    const result = parseColor({ alpha: 0.9, ...violet.oklch });

    expect(result.alpha).toBe(0.9);
    expect(result.hex).toBe(addOpacityToCssString(violet.hex, 0.9));
    expect(result.hsl).toEqual({ alpha: 0.9, ...violet.hsl });
    expect(result.rgb).toEqual({ alpha: 0.9, ...violet.rgb });
    expect(result.type).toBe('oklch');
    expect(result.oklch).toEqual({ alpha: 0.9, ...violet.oklch });
  });
});
