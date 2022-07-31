/* eslint-disable no-new */
import Colorizr, {
  brightnessDifference,
  chroma,
  colorDifference,
  compare,
  contrast,
  darken,
  desaturate,
  fade,
  formatCSS,
  formatHex,
  hex2hsl,
  hex2rgb,
  hsl2hex,
  hsl2rgb,
  isValidColor,
  isValidHex,
  lighten,
  luminance,
  name,
  palette,
  parseCSS,
  random,
  rgb2hex,
  rgb2hsl,
  rotate,
  saturate,
  scheme,
  textColor,
} from '../src';

describe('Colorizr with hex', () => {
  let colorizr: Colorizr;

  beforeEach(() => {
    colorizr = new Colorizr('#ff0044');
  });

  describe('initialization', () => {
    it('should create a proper instance', () => {
      expect(colorizr).toBeInstanceOf(Colorizr);
      expect(colorizr.hex).toBe('#ff0044');
      expect(colorizr.hsl).toEqual({ h: 344, s: 100, l: 50 });
      expect(colorizr.rgb).toEqual({ r: 255, g: 0, b: 68 });
    });
  });

  describe('getters', () => {
    it('.css should return the correct value', () => {
      expect(colorizr.css).toBe('rgb(255, 0, 68)');
    });

    it('.hue should return the correct value', () => {
      expect(colorizr.hue).toBe(344);
    });

    it('.saturation should return the correct value', () => {
      expect(colorizr.saturation).toBe(100);
    });

    it('.lightness should return the correct value', () => {
      expect(colorizr.lightness).toBe(50);
    });

    it('.red should return the correct value', () => {
      expect(colorizr.red).toBe(255);
    });

    it('.blue should return the correct value', () => {
      expect(colorizr.blue).toBe(68);
    });

    it('.green should return the correct value', () => {
      expect(colorizr.green).toBe(0);
    });

    it('.luminance should return the correct value', () => {
      expect(colorizr.luminance).toBe(0.2168);
    });

    it('.chroma should return the correct value', () => {
      expect(colorizr.chroma).toBe(1);
    });
  });

  describe('modifiers', () => {
    describe('lighten', () => {
      it('should have lighten the color', () => {
        expect(colorizr.lighten()).toBe('#ff3369');
        expect(colorizr.lighten(20)).toBe('#ff668f');
        expect(colorizr.lighten(40)).toBe('#ffccda');
        expect(colorizr.lighten(80)).toBe('#ffffff');
      });
    });

    describe('darken', () => {
      it('should have darken the color', () => {
        expect(colorizr.darken()).toBe('#cc0036');
        expect(colorizr.darken(20)).toBe('#990029');
        expect(colorizr.darken(40)).toBe('#33000e');
        expect(colorizr.darken(80)).toBe('#000000');
      });
    });

    describe('saturate', () => {
      it('should have saturated the color', () => {
        expect(colorizr.saturate()).toBe('#ff0044');
        expect(colorizr.saturate(-50)).toBe('#bf4062');
        expect(colorizr.saturate(-70)).toBe('#a6596e');
        expect(colorizr.saturate(-100)).toBe('#808080');
      });
    });

    describe('desaturate', () => {
      it('should have desaturated the color', () => {
        expect(colorizr.desaturate()).toBe('#f20d4a');
        expect(colorizr.desaturate(20)).toBe('#e61a50');
        expect(colorizr.desaturate(50)).toBe('#bf4062');
        expect(colorizr.desaturate(90)).toBe('#8c737a');
      });
    });

    describe('invert', () => {
      it('should have invert the color', () => {
        expect(colorizr.invert()).toBe('#00ffbb');
      });
    });

    describe('fade', () => {
      it('should have fade the color', () => {
        expect(colorizr.fade()).toBe('rgba(255, 0, 68, 0.9)');
      });
    });
  });

  describe('compare', () => {
    it('should return a WCAG analysis', () => {
      expect(colorizr.compare('#000')).toMatchSnapshot();
      expect(colorizr.compare('#fff')).toMatchSnapshot();
    });
  });

  describe('textColor', () => {
    it('should return a contrasting color', () => {
      expect(colorizr.textColor).toBe('#ffffff');
    });
  });
});

describe('Colorizr with HSL', () => {
  const colorizr = new Colorizr({ h: 344, s: 100, l: 50 });

  it('should create a proper instance', () => {
    expect(colorizr.hex).toBe('#ff0044');
    expect(colorizr.hsl).toEqual({ h: 344, s: 100, l: 50 });
    expect(colorizr.rgb).toEqual({ r: 255, g: 0, b: 68 });
  });
});

describe('Colorizr with RGB input and model', () => {
  const colorizr = new Colorizr({ r: 255, g: 0, b: 68 }, { model: 'rgb' });

  it('should create a proper instance', () => {
    expect(colorizr.hex).toBe('#ff0044');
    expect(colorizr.hsl).toEqual({ h: 344, s: 100, l: 50 });
    expect(colorizr.rgb).toEqual({ r: 255, g: 0, b: 68 });
    expect(colorizr.css).toBe('rgb(255, 0, 68)');
    expect(colorizr.fade(20)).toBe('rgba(255, 0, 68, 0.8)');
  });
});

describe('Colorizr with RGB array', () => {
  const colorizr = new Colorizr([255, 0, 68]);

  it('should create a proper instance', () => {
    expect(colorizr.hex).toBe('#ff0044');
    expect(colorizr.hsl).toEqual({ h: 344, s: 100, l: 50 });
    expect(colorizr.rgb).toEqual({ r: 255, g: 0, b: 68 });
  });
});

describe('Colorizr with CSS string', () => {
  it.each([
    ['rgb(255, 0, 68)'],
    ['rgba(255, 0, 68, 0.5)'],
    ['hsl(344, 100, 50)'],
    ['hsla(344, 100, 50, 0.5)'],
  ])('%p should create a proper instance', string => {
    const colorizr = new Colorizr(string);

    expect(colorizr.hex).toBe('#ff0044');
    expect(colorizr.hsl).toEqual({ h: 344, s: 100, l: 50 });
    expect(colorizr.rgb).toEqual({ r: 255, g: 0, b: 68 });
  });
});

describe('Colorizr without bad input', () => {
  it.each([[undefined], [[]], [''], [{}], [() => ({})]])('%p should throw', input => {
    expect(() => {
      // @ts-ignore
      new Colorizr(input);
    }).toThrow();
  });
});

describe('helpers', () => {
  it('should have all the helpers', () => {
    expect(brightnessDifference).toEqual(expect.any(Function));
    expect(chroma).toEqual(expect.any(Function));
    expect(colorDifference).toEqual(expect.any(Function));
    expect(compare).toEqual(expect.any(Function));
    expect(contrast).toEqual(expect.any(Function));
    expect(darken).toEqual(expect.any(Function));
    expect(desaturate).toEqual(expect.any(Function));
    expect(fade).toEqual(expect.any(Function));
    expect(formatCSS).toEqual(expect.any(Function));
    expect(formatHex).toEqual(expect.any(Function));
    expect(hex2hsl).toEqual(expect.any(Function));
    expect(hex2rgb).toEqual(expect.any(Function));
    expect(hsl2rgb).toEqual(expect.any(Function));
    expect(hsl2hex).toEqual(expect.any(Function));
    expect(isValidColor).toEqual(expect.any(Function));
    expect(isValidHex).toEqual(expect.any(Function));
    expect(lighten).toEqual(expect.any(Function));
    expect(luminance).toEqual(expect.any(Function));
    expect(name).toEqual(expect.any(Function));
    expect(palette).toEqual(expect.any(Function));
    expect(parseCSS).toEqual(expect.any(Function));
    expect(random).toEqual(expect.any(Function));
    expect(rgb2hex).toEqual(expect.any(Function));
    expect(rgb2hsl).toEqual(expect.any(Function));
    expect(rotate).toEqual(expect.any(Function));
    expect(saturate).toEqual(expect.any(Function));
    expect(scheme).toEqual(expect.any(Function));
    expect(textColor).toEqual(expect.any(Function));
  });
});
