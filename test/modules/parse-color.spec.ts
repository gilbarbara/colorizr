import parseColor from '~/modules/parse-color';

import { addOpacityToCssString, brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('parseColor', () => {
  it.each([
    {
      input: brightPink.hex,
      expected: {
        alpha: 1,
        hex: brightPink.hex,
        hsl: brightPink.hsl,
        oklab: brightPink.oklab,
        oklch: brightPink.oklch,
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
        oklab: { alpha: 0.9, ...brightPink.oklab },
        oklch: { alpha: 0.9, ...brightPink.oklch },
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
        oklab: green.oklab,
        oklch: green.oklch,
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
        oklab: green.oklab,
        oklch: green.oklch,
        rgb: green.rgb,
        type: 'hsl',
      },
    },
    {
      input: orange.oklab,
      expected: {
        alpha: 1,
        hex: orange.hex,
        hsl: orange.hsl,
        oklab: orange.oklab,
        oklch: orange.oklch,
        rgb: orange.rgb,
        type: 'oklab',
      },
    },
    {
      input: addOpacityToCssString(orange.oklabString, 90, true),
      expected: {
        alpha: 0.9,
        hex: addOpacityToCssString(orange.hex, 0.9),
        hsl: { alpha: 0.9, ...orange.hsl },
        oklab: { alpha: 0.9, ...orange.oklab },
        oklch: { alpha: 0.9, ...orange.oklch },
        rgb: { alpha: 0.9, ...orange.rgb },
        type: 'oklab',
      },
    },
    {
      input: violet.oklchString,
      expected: {
        alpha: 1,
        hex: violet.hex,
        hsl: violet.hsl,
        oklab: violet.oklab,
        oklch: violet.oklch,
        rgb: violet.rgb,
        type: 'oklch',
      },
    },
    {
      input: { alpha: 0.9, ...violet.oklch },
      expected: {
        alpha: 0.9,
        hex: addOpacityToCssString(violet.hex, 0.9),
        hsl: { alpha: 0.9, ...violet.hsl },
        oklab: { alpha: 0.9, ...violet.oklab },
        oklch: { alpha: 0.9, ...violet.oklch },
        rgb: { alpha: 0.9, ...violet.rgb },
        type: 'oklch',
      },
    },
    {
      input: yellow.rgb,
      expected: {
        alpha: 1,
        hex: yellow.hex,
        hsl: yellow.hsl,
        oklab: yellow.oklab,
        oklch: yellow.oklch,
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
        oklab: { alpha: 0.9, ...yellow.oklab },
        oklch: { alpha: 0.9, ...yellow.oklch },
        rgb: { alpha: 0.9, ...yellow.rgb },
        type: 'rgb',
      },
    },
  ])('should return properly for $input', ({ input, expected }) => {
    expect(parseColor(input)).toEqual(expected);
  });
});
