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
      expect(colorizr.hsl.h).toBe(344);
      expect(colorizr.hsl.s).toBe(100);
      expect(colorizr.hsl.l).toBe(50);
    });

    it('should have a rgb property', () => {
      expect(colorizr.rgb.r).toBe(255);
      expect(colorizr.rgb.g).toBe(0);
      expect(colorizr.rgb.b).toBe(68);
    });
  });

  describe('setters', () => {
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

        colorizr.setColor();
        expect(colorizr.hex).toBe('#ff0044');
      });

      it('should throw with invalid input', () => {
        expect(() => colorizr.setColor('#abs')).toThrow('Invalid color');
        expect(() => colorizr.setColor({ h: 240, s: 50, g: 50 })).toThrow('Invalid object');
        expect(() => colorizr.setColor(838383)).toThrow('Invalid input type');
      });
    });

    describe('setColorFromArray', () => {
      it('should update the color', () => {
        colorizr.setColorFromArray([129, 100, 68]);
        expect(colorizr.hex).toBe('#816444');

        colorizr.setColorFromArray([255, 0, 68]);
        expect(colorizr.hex).toBe('#ff0044');
      });

      it('should throw with invalid input', () => {
        expect(() => colorizr.setColorFromArray('#abs')).toThrow('input is not an array');
        expect(() => colorizr.setColorFromArray({ h: 100 })).toThrow('input is not an array');
        expect(() => colorizr.setColorFromArray()).toThrow('input is required');
      });
    });

    describe('setColorFromObject', () => {
      it('should update the color', () => {
        colorizr.setColorFromObject({ h: 240, s: 50, l: 50 });
        expect(colorizr.hex).toBe('#4040bf');

        colorizr.setColorFromObject({ r: 255, g: 0, b: 68 });
        expect(colorizr.hex).toBe('#ff0044');
      });

      it('should throw with invalid input', () => {
        expect(() => colorizr.setColorFromObject('#abs')).toThrow('input is not an object');
        expect(() => colorizr.setColorFromObject([])).toThrow('input is not an object');
        expect(() => colorizr.setColorFromObject()).toThrow('input is required');
      });
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
        expect(colorizr.lighten()).toBe('#ff3369');
        expect(colorizr.lighten(20)).toBe('#ff668f');
        expect(colorizr.lighten(40)).toBe('#ffccda');
        expect(colorizr.lighten(80)).toBe('#ffffff');
      });
    });

    describe('darken', () => {
      it('should have darken the color', () => {
        expect(colorizr.hex).toBe('#ff0044');
        expect(colorizr.darken()).toBe('#cc0036');
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
        expect(colorizr.saturate()).toBe('#cc335c');
        expect(colorizr.saturate(20)).toBe('#d82756');
        expect(colorizr.saturate(50)).toBe('#ff0044');
      });
    });

    describe('desaturate', () => {
      it('should have desaturated the color', () => {
        expect(colorizr.hex).toBe('#ff0044');
        expect(colorizr.desaturate()).toBe('#f20d4a');
        expect(colorizr.desaturate(20)).toBe('#e61a50');
        expect(colorizr.desaturate(50)).toBe('#bf4062');
        expect(colorizr.desaturate(90)).toBe('#8c737a');
      });
    });

    describe('adjustHue', () => {
      it('should have changed the color', () => {
        expect(colorizr.hex).toBe('#ff0044');
        expect(colorizr.adjustHue()).toBe('#ff0004');
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
        expect(() => colorizr.remix()).toThrow('input is required');
        expect(() => colorizr.remix([])).toThrow('Invalid input');
        expect(() => colorizr.remix({ h: 10, r: 20 })).toThrow('Use a single color model');
        expect(() => colorizr.remix({ a: 10 })).toThrow('Could not match a color model');
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
        expect(() => colorizr.parseHex()).toThrow('input is required');
        expect(() => colorizr.parseHex('#xyz')).toThrow('Invalid color');
        expect(() => colorizr.parseHex('#xml')).toThrow('Invalid color');
        expect(() => colorizr.parseHex('taa')).toThrow('Invalid color');
        expect(() => colorizr.parseHex('@jsl')).toThrow('Invalid color');
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
        expect(() => colorizr.parseCSS('rgs(255, 255, 0)')).toThrow('Invalid CSS string');
        expect(() => colorizr.parseCSS([25, 56, 84])).toThrow();
        expect(() => colorizr.parseCSS({ h: 25, s: 56, l: 84 })).toThrow();
        expect(() => colorizr.parseCSS()).toThrow('input is required');
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
        expect(() => colorizr.hex2rgb('abs')).toThrow('Invalid color');
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

      it('should throw with invalid input', () => {
        expect(() => colorizr.hue2rgb()).toThrow('point is required');
        expect(() => colorizr.hue2rgb(0.8)).toThrow('chroma is required');
        expect(() => colorizr.hue2rgb(0.8, 1)).toThrow('hue is required');
      });
    });
  });

  describe('analysis', () => {
    describe('getColorDifference', () => {
      it('should return the correct number using the instance color', () => {
        expect(colorizr.getColorDifference('#dd00ff')).toBe(221);
        expect(colorizr.getColorDifference('#fff')).toBe(442);
        expect(colorizr.getColorDifference('#000')).toBe(323);
      });

      it('should return the correct number using the second parameter', () => {
        expect(colorizr.getColorDifference('#fff', '#000')).toBe(765);
        expect(colorizr.getColorDifference('#FF9D64', '#000')).toBe(512);
      });

      it('should fail for invalid parameters', () => {
        expect(() => colorizr.getColorDifference()).toThrow('left is required');
        expect(() => colorizr.getColorDifference([])).toThrow();
      });
    });

    describe('getBrightnessDifference', () => {
      it('should return the correct number using the instance color', () => {
        expect(colorizr.getBrightnessDifference('#fff')).toBe(171.003);
        expect(colorizr.getBrightnessDifference('#000')).toBe(83.997);
      });

      it('should fail for invalid parameters', () => {
        expect(() => colorizr.getBrightnessDifference()).toThrow('left is required');
        expect(() => colorizr.getBrightnessDifference([])).toThrow();
      });
    });

    describe('getLuminance', () => {
      it('should return the correct value', () => {
        expect(colorizr.getLuminance()).toBe(0.2168);
        expect(colorizr.getLuminance('#24d3d3')).toBe(0.5167);
        expect(colorizr.getLuminance('#005cff')).toBe(0.1487);
        expect(colorizr.getLuminance('#fff')).toBe(1);
        expect(colorizr.getLuminance('#000')).toBe(0);
      });
    });

    describe('checkContrast', () => {
      it('should return the correct number using the instance color', () => {
        expect(colorizr.checkContrast('#dd00ff')).toEqual({
          brightnessDifference: 11.152,
          colorDifference: 221,
          compliant: 0,
          contrastRatio: 1.0341,
          w2a: false,
          w2aaaa: false,
          w2aaab: false,
          w2b: false,
        });

        expect(colorizr.checkContrast('#00ffbb')).toEqual({
          brightnessDifference: 87.006,
          colorDifference: 629,
          compliant: 1,
          contrastRatio: 3.0026,
          w2a: true,
          w2aaaa: false,
          w2aaab: false,
          w2b: false,
        });

        expect(colorizr.checkContrast('#fff')).toEqual({
          brightnessDifference: 171.003,
          colorDifference: 442,
          compliant: 1,
          contrastRatio: 3.9355,
          w2a: true,
          w2aaaa: false,
          w2aaab: false,
          w2b: false,
        });

        expect(colorizr.checkContrast('#000')).toEqual({
          brightnessDifference: 83.997,
          colorDifference: 323,
          compliant: 0,
          contrastRatio: 5.336,
          w2a: true,
          w2aaaa: true,
          w2aaab: false,
          w2b: true,
        });
      });

      it('should return the correct number using the second parameter', () => {
        expect(colorizr.checkContrast('#dd00ff', '#FF0000')).toEqual({
          brightnessDifference: 18.904,
          colorDifference: 289,
          compliant: 0,
          contrastRatio: 1.0506,
          w2a: false,
          w2aaaa: false,
          w2aaab: false,
          w2b: false,
        });
        expect(colorizr.checkContrast('#fff', '#777')).toEqual({
          brightnessDifference: 136,
          colorDifference: 408,
          compliant: 1,
          contrastRatio: 4.4776,
          w2a: true,
          w2aaaa: false,
          w2aaab: false,
          w2b: false,
        });
        expect(colorizr.checkContrast('#000', '#fff')).toEqual({
          brightnessDifference: 255,
          colorDifference: 765,
          compliant: 2,
          contrastRatio: 21,
          w2a: true,
          w2aaaa: true,
          w2aaab: true,
          w2b: true,
        });
      });

      it('should fail for invalid parameters', () => {
        expect(() => colorizr.checkContrast()).toThrow('left is required');
        expect(() => colorizr.checkContrast([])).toThrow();
      });
    });
  });

  describe('other', () => {
    describe('textColor', () => {
      it('should return the contrasted color', () => {
        expect(colorizr.textColor()).toBe('#fff');
        expect(colorizr.textColor('#ff4e00')).toBe('#fff');
        expect(colorizr.textColor('#fff800')).toBe('#000');
        expect(colorizr.textColor('#07ff00')).toBe('#000');
        expect(colorizr.textColor('#005cff')).toBe('#fff');
        expect(colorizr.textColor('#a300ff')).toBe('#fff');
      });

      it('should fail with incorrect parameters', () => {
        expect(() => colorizr.textColor('sss')).toThrow('Invalid color');
      });
    });

    describe('random', () => {
      it('should return an object with correct parameters', () => {
        const random = colorizr.random();
        expect(random.hex.slice(0, 1)).toBe('#');

        expect(Object.keys(random.hsl)).toEqual(['h', 's', 'l']);
        expect(typeof random.hsl.h).toBe('number');
        expect(typeof random.hsl.s).toBe('number');
        expect(typeof random.hsl.l).toBe('number');

        expect(Object.keys(random.rgb)).toEqual(['r', 'g', 'b']);
        expect(typeof random.rgb.r).toBe('number');
        expect(typeof random.rgb.g).toBe('number');
        expect(typeof random.rgb.b).toBe('number');
      });
    });

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
        expect(() => colorizr.shift()).toThrow('input is required');
        expect(() => colorizr.shift({ h: 21, r: 50 })).toThrow('Use a single color model');
      });
    });

    describe('limit', () => {
      it('should limit the values', () => {
        expect(colorizr.limit(-20, 'r')).toBe(0);
        expect(colorizr.limit(200, 'g')).toBe(200);
        expect(colorizr.limit(300, 'b')).toBe(255);

        expect(colorizr.limit(-40, 'h')).toBe(0);
        expect(colorizr.limit(90, 's')).toBe(90);
        expect(colorizr.limit(150, 's')).toBe(100);
      });

      it('should fail with incorrect parameters', () => {
        expect(() => colorizr.limit(100, 'm')).toThrow('Invalid type');
        expect(() => colorizr.limit()).toThrow('input is required');
        expect(() => colorizr.limit(100)).toThrow('type is required');
        expect(() => colorizr.limit('100', 'h')).toThrow('Input is not a number');
      });
    });

    describe('constrain', () => {
      it('should return the constrained value', () => {
        expect(colorizr.constrain(20, 100, [0, 100], '+')).toBe(100);
        expect(colorizr.constrain(90, 90, [0, 360], '+')).toBe(180);
      });

      it('should fail with incorrect parameters', () => {
        expect(() => colorizr.constrain()).toThrow('input is required');
        expect(() => colorizr.constrain(90)).toThrow('amount is required');
        expect(() => colorizr.constrain(90, 90)).toThrow('range is required');
        expect(() => colorizr.constrain(20, 100, [0, 100])).toThrow('sign is required');
      });
    });

    describe('constrainDegrees', () => {
      it('should return the constrained angle', () => {
        expect(colorizr.constrainDegrees(340, 80)).toBe(60);
        expect(colorizr.constrainDegrees(40, 340)).toBe(20);
        expect(colorizr.constrainDegrees(40, -80)).toBe(320);
      });

      it('should fail with incorrect parameters', () => {
        expect(() => colorizr.constrainDegrees()).toThrow('input is required');
        expect(() => colorizr.constrainDegrees(90)).toThrow('amount is required');
      });
    });
  });
});
