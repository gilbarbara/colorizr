import Colorizr from '../src';

describe('Colorizr', () => {
  const colorizr = new Colorizr('#ff0044');

  describe('initialization', () => {
    it('should create a new instance of Color', () => {
      expect(colorizr).toBeInstanceOf(Colorizr);
    });

    it('should have an hex property', () => {
      expect(colorizr.hex).toBe('#ff0044');
    });

    it('should have an hsl property', () => {
      expect(colorizr.hsl).toBeInstanceOf(Object);
      expect(colorizr.hsl.h).toBe(344);
      expect(colorizr.hsl.s).toBe(100);
      expect(colorizr.hsl.l).toBe(50);
    });

    it('should have a rgb property', () => {
      expect(colorizr.rgb).toBeInstanceOf(Object);
      expect(colorizr.rgb.r).toBe(255);
      expect(colorizr.rgb.g).toBe(0);
      expect(colorizr.rgb.b).toBe(68);
    });
  });

  describe('setColor', () => {
    it('should update the color', () => {
      colorizr.setColor('#818181');
      expect(colorizr.hsl).toEqual({ h: 0, s: 0, l: 50.59 });
      expect(colorizr.rgb).toEqual({ r: 129, g: 129, b: 129 });

      colorizr.setColor('#0f4');
      expect(colorizr.hex).toBe('#00ff44');

      colorizr.setColor({ h: 240, s: 50, l: 50 });
      expect(colorizr.hex).toBe('#4040bf');

      colorizr.setColor({ r: 255, g: 65, b: 172 });
      expect(colorizr.hex).toBe('#ff41ac');

      colorizr.setColor([255, 0, 68]);
      expect(colorizr.hex).toBe('#ff0044');
    });

    it('should throw with invalid input', () => {
      expect(() => colorizr.setColor('abs')).toThrow();
      expect(() => colorizr.setColor({ h: 240, s: 50, g: 50 })).toThrow();
      expect(() => colorizr.setColor(838383)).toThrow();
      expect(() => colorizr.setColor()).toThrow();
    });
  });

  describe('getters', () => {
    it('.hue should get the correct value', () => {
      expect(colorizr.hue).toBe(344);
    });

    it('.saturation should get the correct value', () => {
      expect(colorizr.saturation).toBe(100);
    });

    it('.lightness should get the correct value', () => {
      expect(colorizr.lightness).toBe(50);
    });

    it('.red should get the correct value', () => {
      expect(colorizr.red).toBe(255);
    });

    it('.blue should get the correct value', () => {
      expect(colorizr.blue).toBe(68);
    });

    it('.green should get the correct value', () => {
      expect(colorizr.green).toBe(0);
    });
  });

  describe('modifiers', () => {
    describe('lighten', () => {
      it('should have lighten the color', () => {
        expect(colorizr.hex).toBe('#ff0044');
        expect(colorizr.lighten(20)).toBe('#ff668f');
        expect(colorizr.lighten(40)).toBe('#ffccda');
        expect(colorizr.lighten(80)).toBe('#ffffff');
      });
    });

    describe('darken', () => {
      it('should have darken the color', () => {
        expect(colorizr.hex).toBe('#ff0044');
        expect(colorizr.darken(20)).toBe('#990029');
        expect(colorizr.darken(40)).toBe('#33000e');
        expect(colorizr.darken(80)).toBe('#000000');
      });
    });

    describe('saturate', () => {
      const { hex } = colorizr;

      beforeAll(() => {
        colorizr.setColor('#bf4062');
      });

      afterAll(() => {
        colorizr.setColor(hex);
      });

      it('should have saturated the color', () => {
        expect(colorizr.hex).toBe('#bf4062');
        expect(colorizr.saturate(20)).toBe('#d82756');
        expect(colorizr.saturate(50)).toBe('#ff0044');
      });
    });

    describe('desaturate', () => {
      it('should have desaturated the color', () => {
        expect(colorizr.hex).toBe('#ff0044');
        expect(colorizr.desaturate(20)).toBe('#e61a50');
        expect(colorizr.desaturate(50)).toBe('#bf4062');
        expect(colorizr.desaturate(90)).toBe('#8c737a');
      });
    });

    describe('adjustHue', () => {
      it('should have changed the color', () => {
        expect(colorizr.hex).toBe('#ff0044');
        expect(colorizr.adjustHue(30)).toBe('#ff3b00');
        expect(colorizr.adjustHue(90)).toBe('#c4ff00');
        expect(colorizr.adjustHue(180)).toBe('#00ffbb');
      });
    });

    describe('remix', () => {
      it('should have changed the color with HSL input', () => {
        expect(colorizr.hsl).toEqual({ h: 344, s: 100, l: 50 });
        expect(colorizr.remix({ h: 30 })).toEqual({ h: 30, s: 100, l: 50 });
        expect(colorizr.remix({ s: 80, l: 60 })).toEqual({ h: 344, s: 80, l: 60 });
        expect(colorizr.remix({ l: 30 }, true)).toBe('#990029');
      });

      it('should have changed the color with RGB input', () => {
        expect(colorizr.rgb).toEqual({ r: 255, g: 0, b: 68 });
        expect(colorizr.remix({ r: 0, g: 20 })).toEqual({ r: 0, g: 20, b: 68 });
        expect(colorizr.remix({ r: 120, b: 0 })).toEqual({ r: 120, g: 0, b: 0 });
        expect(colorizr.remix({ g: 30, b: 244 }, true)).toBe('#ff1ef4');
      });

      it('should throw with incorrect parameters', () => {
        expect(() => colorizr.remix(30)).toThrow();
        expect(() => colorizr.remix({ a: 10 })).toThrow();
        expect(() => colorizr.remix([])).toThrow();
      });
    });
  });

  describe('parsers', () => {
    describe('parseHex', () => {
      it('should work with proper input', () => {
        expect(colorizr.parseHex('#aabbcc')).toBe('#aabbcc');
        expect(colorizr.parseHex('#ff0044')).toBe('#ff0044');
        expect(colorizr.parseHex('00ff00')).toBe('#00ff00');
        expect(colorizr.parseHex('#774422')).toBe('#774422');
      });

      it('should work with 3 digit hex', () => {
        expect(colorizr.parseHex('#f05')).toBe('#ff0055');
        expect(colorizr.parseHex('f0a')).toBe('#ff00aa');
        expect(colorizr.parseHex('#abc')).toBe('#aabbcc');
        expect(colorizr.parseHex('#07e')).toBe('#0077ee');
      });

      it('should throw with invalid input', () => {
        expect(() => colorizr.parseHex('#xyz')).toThrow();
        expect(() => colorizr.parseHex('#xml')).toThrow();
        expect(() => colorizr.parseHex('taa')).toThrow();
        expect(() => colorizr.parseHex('@jsl')).toThrow();
      });
    });

    describe('parseCSS', () => {
      it('should work with proper input', () => {
        expect(colorizr.parseCSS('rgb(255, 255, 0)')).toEqual({ r: 255, g: 255, b: 0 });
        expect(colorizr.parseCSS('rgba(255, 127, 12, 0.5)')).toEqual({ r: 255, g: 127, b: 12 });
        expect(colorizr.parseCSS('hsl(255, 80, 20)')).toEqual({ h: 255, s: 80, l: 20 });
        expect(colorizr.parseCSS('hsla(126, 57, 62, 0.5)')).toEqual({ h: 126, s: 57, l: 62 });
      });

      it('should throw with invalid input', () => {
        expect(() => colorizr.parseCSS('rgs(255, 255, 0)')).toThrow();
        expect(() => colorizr.parseCSS([25, 56, 84])).toThrow();
      });
    });
  });

  describe('converters', () => {
    describe('hex2rgb', () => {
      it('should work with proper input', () => {
        expect(colorizr.hex2rgb('#ff0044')).toEqual({ r: 255, g: 0, b: 68 });
        expect(colorizr.hex2rgb('#abc')).toEqual({ r: 170, g: 187, b: 204 });
      });

      it('should throw with invalid input', () => {
        expect(() => colorizr.hex2rgb('abs')).toThrow();
        expect(() => colorizr.hex2rgb({ h: 240, s: 45, l: 50 })).toThrow();
      });
    });

    describe('hex2hsl', () => {
      it('should work with proper input', () => {
        expect(colorizr.hex2hsl()).toEqual({ h: 344, s: 100, l: 50 });
        expect(colorizr.hex2hsl('#abc')).toEqual({ h: 210, s: 25, l: 73.33 });
      });

      it('should throw with invalid input', () => {
        expect(() => colorizr.hex2hsl('amanha')).toThrow();
        expect(() => colorizr.hex2hsl([255, 255, 0])).toThrow();
      });
    });

    describe('rgb2hsl', () => {
      it('should work with proper input', () => {
        expect(colorizr.rgb2hsl('rgb(255, 255, 0)')).toEqual({ h: 60, s: 100, l: 50 });
        expect(colorizr.rgb2hsl({ r: 255, g: 55, b: 75 })).toEqual({ h: 354, s: 100, l: 60.78 });
      });

      it('should throw with invalid input', () => {
        expect(() => colorizr.rgb2hsl('rgt(255, 255, 0)')).toThrow();
        expect(() => colorizr.rgb2hsl({ m: 255, t: 55, p: 75 })).toThrow();
      });
    });

    describe('rgb2hex', () => {
      it('should work with proper input', () => {
        expect(colorizr.rgb2hex('rgb(255, 255, 0)')).toBe('#ffff00');
        expect(colorizr.rgb2hex({ r: 255, g: 55, b: 75 })).toBe('#ff374b');
      });

      it('should throw with invalid input', () => {
        expect(() => colorizr.rgb2hex('hpv(255, 255, 0)')).toThrow();
        expect(() => colorizr.rgb2hex({ m: 255, p: 55, b: 75 })).toThrow();
      });
    });

    describe('hsl2rgb', () => {
      it('should work with proper input', () => {
        expect(colorizr.hsl2rgb('hsl(255, 50, 50)')).toEqual({ r: 96, g: 64, b: 191 });
        expect(colorizr.hsl2rgb({ h: 255, s: 55, l: 75 })).toEqual({ r: 174, g: 156, b: 226 });
        expect(colorizr.hsl2rgb({ h: 344, s: 0, l: 0 })).toEqual({ r: 0, g: 0, b: 0 });
      });

      it('should throw with invalid input', () => {
        expect(() => colorizr.hsl2rgb('hpv(255, 255, 0)')).toThrow();
        expect(() => colorizr.hsl2rgb({ m: 255, p: 55, b: 75 })).toThrow();
      });
    });

    describe('hsl2hex', () => {
      it('should work with proper input', () => {
        expect(colorizr.hsl2hex('hsl(255, 50, 50)')).toBe('#6040bf');
        expect(colorizr.hsl2hex({ h: 255, s: 55, l: 75 })).toBe('#ae9ce2');
      });

      it('should throw with invalid input', () => {
        expect(() => colorizr.hsl2hex('hpv(255, 255, 0)')).toThrow();
        expect(() => colorizr.hsl2hex({ m: 255, p: 55, b: 75 })).toThrow();
      });
    });

    describe('hue2rgb', () => {
      it('should return median', () => {
        expect(colorizr.hue2rgb(0.1, 0.4, 0.1)).toBe(0.28);
        expect(colorizr.hue2rgb(0.2, 0.4, 0.1)).toBe(0.32);
        expect(colorizr.hue2rgb(0.8, 1, 0.9)).toBe(0.8);
      });
    });
  });

  describe('validHex', () => {
    it('should validate correctly', () => {
      expect(colorizr.validHex('#aabbcc')).toBe(true);
      expect(colorizr.validHex('#ff0044')).toBe(true);
      expect(colorizr.validHex('#mmff00')).toBe(false);
      expect(colorizr.validHex('00ff00')).toBe(false);
      expect(colorizr.validHex('74422')).toBe(false);
    });
  });

  describe('methods', () => {
    describe('shift', () => {
      it('should work with HSL values', () => {
        expect(colorizr.hsl).toEqual({ h: 344, s: 100, l: 50 });

        expect(colorizr.shift({ h: 21, s: 50 })).toEqual({ h: 21, s: 50, l: 50 });
        expect(colorizr.shift({ s: 50, l: 60 })).toEqual({ h: 344, s: 50, l: 60 });
      });

      it('should work with HSL values', () => {
        expect(colorizr.rgb).toEqual({ r: 255, g: 0, b: 68 });

        expect(colorizr.shift({ r: 60, g: 20 })).toEqual({ r: 60, g: 20, b: 68 });
        expect(colorizr.shift({ r: 234, b: 0 })).toEqual({ r: 234, g: 0, b: 0 });
      });

      it('should throw with invalid input', () => {
        expect(() => colorizr.shift({ h: 21, r: 50 })).toThrow();
      });
    });

    describe('constrain', () => {
      it('should return the constrained value', () => {
        expect(colorizr.constrain(20, 100, [0, 100], '+')).toBe(100);
        expect(colorizr.constrain(90, 90, [0, 360], '+')).toBe(180);
      });
    });

    describe('constrainDegrees', () => {
      it('should return the constrained angle', () => {
        expect(colorizr.constrainDegrees(340, 80)).toBe(60);
        expect(colorizr.constrainDegrees(40, 340)).toBe(20);
      });
    });
  });
});
