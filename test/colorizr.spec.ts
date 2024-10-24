import { addAlpha } from '~/modules/utils';
import { isString } from '~/modules/validators';

import Colorizr from '~/colorizr';
import { Alpha, ColorModel, ColorType, HSL, LAB, LCH, RGB } from '~/index';

import { addOpacityToCssString, brightPink, green, orange, violet, yellow } from './__fixtures__';

interface Item {
  alpha?: Alpha;
  color: typeof brightPink;
  format?: ColorType;
  input: string | ColorModel;
  textColor: string;
  title: string;
  type: ColorType;
}

describe.each([
  { color: brightPink, input: brightPink.hex, textColor: '#ffffff', title: 'HEX', type: 'hex' },
  {
    alpha: 0.9,
    color: brightPink,
    input: brightPink.hex,
    textColor: '#ffffff',
    title: 'HEX with alpha',
    type: 'hex',
  },
  { color: green, input: green.hsl, textColor: '#000000', title: 'HSL', type: 'hsl' },
  {
    color: green,
    input: green.hslString,
    textColor: '#000000',
    title: 'HSL String',
    type: 'hsl',
  },
  { color: orange, input: orange.oklab, textColor: '#000000', title: 'OKLAB', type: 'oklab' },
  {
    color: orange,
    input: orange.oklabString,
    textColor: '#000000',
    title: 'OKLAB String',
    type: 'oklab',
  },
  { color: violet, input: violet.oklch, textColor: '#ffffff', title: 'OKLCH', type: 'oklch' },
  {
    color: violet,
    input: violet.oklchString,
    textColor: '#ffffff',
    title: 'OKLCH String',
    type: 'oklch',
  },
  { color: yellow, input: yellow.rgb, textColor: '#000000', title: 'RGB', type: 'rgb' },
  {
    color: yellow,
    input: yellow.rgbString,
    textColor: '#000000',
    title: 'RGB String',
    type: 'rgb',
  },
] as Array<Item>)(`Colorizr with $title`, ({ color, input, alpha, textColor, type, format }) => {
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

  const hex = addOpacityToCssString(color.hex, alpha ?? 1);
  const hsl = addAlpha<HSL>(color.hsl, alpha);
  const oklab = addAlpha<LAB>(color.oklab, alpha);
  const oklch = addAlpha<LCH>(color.oklch, alpha);
  const rgb = addAlpha<RGB>(color.rgb, alpha);

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

    it('.textColor should return a contrasting color', () => {
      expect(colorizr.textColor).toBe(textColor);
    });
  });

  describe('modifiers', () => {
    describe('lighten', () => {
      it.each([[10], [20], [40], [80]])('should have lighten the color with %s', amount => {
        expect(colorizr.lighten(amount)).toMatchSnapshot();
      });
    });

    describe('darken', () => {
      it.each([[10], [20], [40], [80]])('should have darken the color with %s', amount => {
        expect(colorizr.darken(amount)).toMatchSnapshot();
      });
    });

    describe('saturate', () => {
      it.each([[10], [-20], [-40], [-80]])('should have saturated the color with %s', amount => {
        expect(colorizr.saturate(amount)).toMatchSnapshot();
      });
    });

    describe('desaturate', () => {
      it.each([[10], [20], [40], [80]])('should have desaturated the color with %s', amount => {
        expect(colorizr.desaturate(amount)).toMatchSnapshot();
      });
    });

    describe('invert', () => {
      it('should have invert the color', () => {
        expect(colorizr.invert()).toMatchSnapshot();
      });
    });

    describe('rotate', () => {
      it.each([[15], [30], [60], [120], [180]])('should have rotated the color with %s', amount => {
        expect(colorizr.rotate(amount)).toMatchSnapshot();
      });
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

  describe('format', () => {
    it('should return a css formatted string', () => {
      expect(colorizr.format('oklch', 5)).toBe(
        addOpacityToCssString(color.oklchString, alpha ?? 1, true),
      );
      expect(colorizr.format('hex')).toBe(hex);
    });
  });
});

describe('Colorizr with invalid input', () => {
  it.each([[undefined], [[]], [''], [{}], [() => ({})]])('%s should throw', input => {
    expect(() => {
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const colorizr = new Colorizr(input);
    }).toThrow();
  });
});
