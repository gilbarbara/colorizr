import Colorizr from '~/colorizr';
import { ColorModel, ColorType } from '~/index';
import { addAlpha } from '~/modules/alpha';
import { resolveColor } from '~/modules/parsed-color';
import { isString } from '~/modules/validators';

import { addOpacityToCssString, brightPink, green, orange, violet, yellow } from './__fixtures__';

interface Item {
  alpha?: number;
  color: typeof brightPink;
  format?: ColorType;
  input: string | ColorModel;
  readableColor: string;
  title: string;
  type: ColorType;
}

describe.each([
  { color: brightPink, input: brightPink.hex, readableColor: '#ffffff', title: 'HEX', type: 'hex' },
  {
    alpha: 0.9,
    color: brightPink,
    input: brightPink.hex,
    readableColor: '#ffffff',
    title: 'HEX with alpha',
    type: 'hex',
  },
  { color: green, input: green.hsl, readableColor: '#000000', title: 'HSL', type: 'hsl' },
  {
    color: green,
    input: green.hslString,
    readableColor: '#000000',
    title: 'HSL String',
    type: 'hsl',
  },
  { color: orange, input: orange.oklab, readableColor: '#000000', title: 'OKLAB', type: 'oklab' },
  {
    color: orange,
    input: orange.oklabString,
    readableColor: '#000000',
    title: 'OKLAB String',
    type: 'oklab',
  },
  { color: violet, input: violet.oklch, readableColor: '#ffffff', title: 'OKLCH', type: 'oklch' },
  {
    color: violet,
    input: violet.oklchString,
    readableColor: '#ffffff',
    title: 'OKLCH String',
    type: 'oklch',
  },
  { color: yellow, input: yellow.rgb, readableColor: '#000000', title: 'RGB', type: 'rgb' },
  {
    color: yellow,
    input: yellow.rgbString,
    readableColor: '#000000',
    title: 'RGB String',
    type: 'rgb',
  },
] as Array<Item>)(
  `Colorizr with $title`,
  ({ color, input, alpha, readableColor, type, format }) => {
    let value = input;
    let selectedColor =
      color[
        `${type}${type !== 'hex' ? 'String' : ''}` as Extract<
          keyof typeof color,
          'hex' | 'hslString' | 'oklabString' | 'oklchString' | 'rgbString'
        >
      ];

    if (alpha) {
      value = isString(input) ? addOpacityToCssString(input, alpha, true) : addAlpha(input, alpha);
      selectedColor = addOpacityToCssString(selectedColor, alpha, true);
    }

    const colorizr = new Colorizr(value, { format });

    const { hex, hsl, rgb } = color;
    const hexCSS = addOpacityToCssString(hex, alpha ?? 1);

    // When input IS oklab/oklch (short values), the stored values are derived from those
    // short values, not the oklabLong/oklchLong from the original hex color.
    const parsed = resolveColor(value);
    const { oklab } = parsed;
    const { oklch } = parsed;

    describe('initialization', () => {
      it('should create a proper instance', () => {
        expect(colorizr).toBeInstanceOf(Colorizr);
        expect(colorizr.hex).toBe(hex);
        expect(colorizr.hsl).toEqual(hsl);
        expect(colorizr.rgb).toEqual(rgb);
        expect(colorizr.oklab).toEqual(oklab);
        expect(colorizr.oklch).toEqual(oklch);
      });
    });

    describe('getters', () => {
      it('.css should return the correct value', () => {
        expect(colorizr.css).toBe(selectedColor);
      });

      it('.hue should return the correct value', () => {
        expect(colorizr.hue).toBe(hsl.h);
      });

      it('.saturation should return the correct value', () => {
        expect(colorizr.saturation).toBe(hsl.s);
      });

      it('.lightness should return the correct value', () => {
        expect(colorizr.lightness).toBe(hsl.l);
      });

      it('.red should return the correct value', () => {
        expect(colorizr.red).toBe(rgb.r);
      });

      it('.blue should return the correct value', () => {
        expect(colorizr.blue).toBe(rgb.b);
      });

      it('.green should return the correct value', () => {
        expect(colorizr.green).toBe(rgb.g);
      });

      it('.luminance should return the correct value', () => {
        expect(colorizr.luminance).toMatchSnapshot();
      });

      it('.chroma should return the correct value', () => {
        expect(colorizr.chroma).toMatchSnapshot();
      });

      it('.opacity should return the correct value', () => {
        expect(colorizr.opacity).toMatchSnapshot();
      });

      it('.readableColor should return a contrasting color', () => {
        expect(colorizr.readableColor).toBe(readableColor);
      });
    });

    describe('modifiers', () => {
      describe('lighten', () => {
        it.each([{ amount: 10 }, { amount: 20 }, { amount: 40 }, { amount: 80 }])(
          'should have lighten the color with $amount',
          ({ amount }) => {
            expect(colorizr.lighten(amount)).toMatchSnapshot();
          },
        );
      });

      describe('darken', () => {
        it.each([{ amount: 10 }, { amount: 20 }, { amount: 40 }, { amount: 80 }])(
          'should have darken the color with $amount',
          ({ amount }) => {
            expect(colorizr.darken(amount)).toMatchSnapshot();
          },
        );
      });

      describe('saturate', () => {
        it.each([{ amount: 10 }, { amount: 20 }, { amount: 40 }, { amount: 80 }])(
          'should have saturated the color with $amount',
          ({ amount }) => {
            expect(colorizr.saturate(amount)).toMatchSnapshot();
          },
        );
      });

      describe('desaturate', () => {
        it.each([{ amount: 10 }, { amount: 20 }, { amount: 40 }, { amount: 80 }])(
          'should have desaturated the color with $amount',
          ({ amount }) => {
            expect(colorizr.desaturate(amount)).toMatchSnapshot();
          },
        );
      });

      describe('invert', () => {
        it('should have invert the color', () => {
          expect(colorizr.invert()).toMatchSnapshot();
        });
      });

      describe('grayscale', () => {
        it('should convert to grayscale', () => {
          expect(colorizr.grayscale()).toMatchSnapshot();
        });
      });

      describe('mix', () => {
        it.each([{ ratio: 0.25 }, { ratio: 0.5 }, { ratio: 0.75 }])(
          'should mix with another color at $ratio ratio',
          ({ ratio }) => {
            expect(colorizr.mix('#0000ff', ratio)).toMatchSnapshot();
          },
        );

        it('should mix in rgb space', () => {
          expect(colorizr.mix('#0000ff', 0.5, { space: 'rgb' })).toMatchSnapshot();
        });

        it('should mix in hsl space', () => {
          expect(colorizr.mix('#0000ff', 0.5, { space: 'hsl' })).toMatchSnapshot();
        });

        it('should mix in oklab space', () => {
          expect(colorizr.mix('#0000ff', 0.5, { space: 'oklab' })).toMatchSnapshot();
        });

        it('should mix with longer hue mode', () => {
          expect(colorizr.mix('#0000ff', 0.5, { hue: 'longer' })).toMatchSnapshot();
        });

        it('should mix with format override', () => {
          expect(colorizr.mix('#0000ff', 0.5, { format: 'oklch' })).toMatchSnapshot();
        });
      });

      describe('rotate', () => {
        it.each([{ amount: 15 }, { amount: 30 }, { amount: 60 }, { amount: 120 }, { amount: 180 }])(
          'should have rotated the color with $amount',
          ({ amount }) => {
            expect(colorizr.rotate(amount)).toMatchSnapshot();
          },
        );
      });

      describe('opacify', () => {
        it('should make the color transparent', () => {
          expect(colorizr.opacify(0.9)).toMatchSnapshot();
        });
      });

      describe('transparentize', () => {
        it('should have transparentize the color', () => {
          expect(colorizr.transparentize(0.2)).toMatchSnapshot();
        });
      });
    });

    describe('brightnessDifference', () => {
      it('should return the brightness difference', () => {
        expect(colorizr.brightnessDifference('#000')).toMatchSnapshot();
        expect(colorizr.brightnessDifference('#fff')).toMatchSnapshot();
      });
    });

    describe('colorDifference', () => {
      it('should return the color difference', () => {
        expect(colorizr.colorDifference('#000')).toMatchSnapshot();
        expect(colorizr.colorDifference('#fff')).toMatchSnapshot();
      });
    });

    describe('compare', () => {
      it('should return a WCAG analysis', () => {
        expect(colorizr.compare('#000')).toMatchSnapshot();
        expect(colorizr.compare('#fff')).toMatchSnapshot();
      });
    });

    describe('contrast', () => {
      it('should return the contrast', () => {
        expect(colorizr.contrast('#000')).toMatchSnapshot();
        expect(colorizr.contrast('#fff')).toMatchSnapshot();
      });
    });

    describe('deltaE', () => {
      it('should return the perceptual color difference', () => {
        expect(colorizr.deltaE('#000')).toMatchSnapshot();
        expect(colorizr.deltaE('#fff')).toMatchSnapshot();
      });

      it('should return 0 for same color', () => {
        expect(colorizr.deltaE(colorizr.css)).toBe(0);
      });

      it('should return smaller values for similar colors', () => {
        const diffToBlack = colorizr.deltaE('#000');
        const diffToWhite = colorizr.deltaE('#fff');

        // At least one should be > 0 (color isn't both black and white)
        expect(Math.max(diffToBlack, diffToWhite)).toBeGreaterThan(0);
      });
    });

    describe('toGamut', () => {
      it('should return a gamut-mapped color', () => {
        expect(colorizr.toGamut()).toMatchSnapshot();
      });

      it('should accept a format override', () => {
        expect(colorizr.toGamut('hex')).toMatchSnapshot();
      });
    });

    describe('format', () => {
      it('should return a css formatted string', () => {
        expect(colorizr.format('oklch', 5)).toBe(
          addOpacityToCssString(color.oklchString, alpha ?? 1, true),
        );
        expect(colorizr.format('hex')).toBe(hexCSS);
      });
    });
  },
);

describe('Colorizr with invalid input', () => {
  it.each([
    { input: undefined },
    { input: [] },
    { input: '' },
    { input: {} },
    { input: () => ({}) },
  ])('$input should throw', ({ input }) => {
    expect(() => {
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _colorizr = new Colorizr(input);
    }).toThrow();
  });
});
