// @flow
import { expr, hasProperty, isPlainObject, isRequired, pick, round, validateHex } from './utils';

const RGB = ['r', 'g', 'b'];
const HSL = ['h', 's', 'l'];

/**
 * Colorizr
 * @class
 */
class Colorizr {
  hex: string = '';
  hsl: Object = {
    h: 0,
    s: 0,
    l: 0,
  };
  rgb: Object = {
    r: 0,
    g: 0,
    b: 0,
  };

  /**
   * @constructs Colorizr
   * @param {string|Array|Object} color
   */
  constructor(color: string | Object | Array<number>) {
    this.setColor(color);
  }

  /**
   * Set the main color.
   *
   * @param {string|Array|Object} color
   */
  setColor(color: string | Array<number> | Object) {
    if (!color) return;

    if (typeof color === 'string') {
      this.hex = this.parseHex(color);
      this.rgb = this.hex2rgb();
      this.hsl = this.hex2hsl();
    }
    else if (Array.isArray(color)) {
      this.setColorFromArray(color);
    }
    else if (isPlainObject(color)) {
      this.setColorFromObject(color);
    }
    else {
      throw new Error('Invalid input type');
    }
  }

  /**
   * Set color from an array.
   *
   * @private
   * @param {Array} input
   */
  setColorFromArray(input: Array<number> = isRequired('input')) {
    if (!Array.isArray(input)) throw new Error('input is not an array');

    this.rgb = {
      r: this.limit(input[0], 'r'),
      g: this.limit(input[1], 'g'),
      b: this.limit(input[2], 'b'),
    };

    this.hex = this.rgb2hex();
    this.hsl = this.rgb2hsl();
  }

  /**
   * Set color from an object.
   *
   * @private
   * @param {Object} input
   */
  setColorFromObject(input: Object = isRequired('input')) {
    if (!isPlainObject(input)) throw new Error('input is not an object');

    if (hasProperty(input, 'h') && hasProperty(input, 's') && hasProperty(input, 'l')) {
      this.hsl = {
        h: this.limit(input.h, 'h'),
        s: this.limit(input.s, 's'),
        l: this.limit(input.l, 'l'),
      };
      this.rgb = this.hsl2rgb();
    }
    else if (hasProperty(input, 'r') && hasProperty(input, 'g') && hasProperty(input, 'b')) {
      this.rgb = input;
      this.hsl = this.rgb2hsl();
    }
    else {
      throw new Error('Invalid object');
    }

    this.hex = this.hsl2hex();
  }

  /**
   * Make the color lighter.
   *
   * @param {number} percentage
   * @returns {string}
   */
  lighten(percentage: number = 10): string {
    const hsl = this.shift({
      l: this.constrain(this.lightness, percentage, [0, 100], '+'),
    });

    return this.hsl2hex(hsl);
  }

  /**
   * Make the color darker.
   *
   * @param {number} percentage
   * @returns {string}
   */
  darken(percentage: number = 10): string {
    const hsl = this.shift({
      l: this.constrain(this.lightness, percentage, [0, 100], '-'),
    });

    return this.hsl2hex(hsl);
  }

  /**
   * Increase saturation.
   *
   * @param {number} percentage
   * @returns {string}
   */
  saturate(percentage: number = 10): string {
    const hsl = this.shift({
      s: this.constrain(this.saturation, percentage, [0, 100], '+'),
    });

    return this.hsl2hex(hsl);
  }

  /**
   * Decrease saturation.
   *
   * @param {number} percentage
   * @returns {string}
   */
  desaturate(percentage: number = 10): string {
    const hsl = this.shift({
      s: this.constrain(this.saturation, percentage, [0, 100], '-'),
    });

    return this.hsl2hex(hsl);
  }

  /**
   * Adjust the color hue.
   *
   * @param {number} degrees
   * @returns {string}
   */
  adjustHue(degrees: number = 15): string {
    const hsl = this.shift({
      h: this.constrainDegrees(this.hue, +degrees),
    });

    return this.hsl2hex(hsl);
  }

  /**
   * Alter color values.
   *
   * @param {Object} input
   * @param {boolean} [returnHex]
   *
   * @returns {string}
   */
  remix(input: Object = isRequired('input'), returnHex: boolean = false): Object | string {
    const shift = this.shift(input);

    if (returnHex) {
      return shift.r ? this.rgb2hex(shift) : this.hsl2hex(shift);
    }

    return shift;
  }

  /**
   * Generate a random color.
   *
   * @returns {{hex: string, rgb: Object, hsl: Object}}
   */
  random(): Object {
    const hsl = {
      h: Math.floor(Math.random() * 360) + 1,
      s: Math.floor(Math.random() * 90) + 10,
      l: Math.floor(Math.random() * 80) + 10,
    };

    return {
      hex: this.hsl2hex(hsl),
      rgb: this.hsl2rgb(hsl),
      hsl,
    };
  }

  /**
   * Get the contrasted color for a given hex.
   *
   * @param {string} input
   * @returns {string}
   */
  textColor(input: string = this.hex): string {
    const { r, g, b } = this.hex2rgb(input);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

    return (yiq >= 128) ? '#000' : '#fff';
  }

  /**
   * Test 2 colors for compliance.
   *
   * @param {Object} left
   * @param {Object} [right]
   * @returns {Object}
   */
  checkContrast(left: string = isRequired('left'), right: string = this.hex): Object {
    const LuminanceLeft = this.getLuminance(left);
    const LuminanceRight = this.getLuminance(right);
    const colorDifference = this.getColorDifference(left, right);
    const colorThreshold = 500;
    const brightnessDifference = this.getBrightnessDifference(left, right);
    const brightnessThreshold = 125;
    let ratio = 1;

    if (LuminanceLeft >= LuminanceRight) {
      ratio = (LuminanceLeft + 0.05) / (LuminanceRight + 0.05);
    }
    else {
      ratio = (LuminanceRight + 0.05) / (LuminanceLeft + 0.05);
    }

    ratio = round(ratio, 4);

    const isBright = (brightnessDifference >= brightnessThreshold);
    const hasEnoughDifference = (colorDifference >= colorThreshold);

    let compliant = 0;

    if (isBright && hasEnoughDifference) {
      compliant = 2;
    }
    else if (isBright || hasEnoughDifference) {
      compliant = 1;
    }

    return {
      brightnessDifference,
      colorDifference,
      compliant,
      contrastRatio: ratio,
      w2a: ratio >= 3,
      w2aaab: ratio >= 7,
      w2aaaa: ratio >= 4.5,
      w2b: ratio >= 4.5,
    };
  }

  /**
   * Get the brightness difference between 2 colors.
   *
   * @param {Object} left
   * @param {Object} [right]
   * @returns {number}
   */
  getBrightnessDifference(left: string = isRequired('left'), right: string = this.hex): number {
    const RGBLeft = this.hex2rgb(left);
    const RGBRight = this.hex2rgb(right);

    const rightY = ((RGBRight.r * 299) + (RGBRight.g * 587) + (RGBRight.b * 114)) / 1000;
    const leftY = ((RGBLeft.r * 299) + (RGBLeft.g * 587) + (RGBLeft.b * 114)) / 1000;
    return round(Math.abs(rightY - leftY), 4);
  }

  /**
   * Get the color difference between 2 colors.
   *
   * @param {Object} left
   * @param {Object} [right]
   * @returns {number}
   */
  getColorDifference(left: string = isRequired('left'), right: string = this.hex): number {
    const RGBLeft = this.hex2rgb(left);
    const RGBRight = this.hex2rgb(right);

    return (Math.max(RGBLeft.r, RGBRight.r) - Math.min(RGBLeft.r, RGBRight.r)) +
      (Math.max(RGBLeft.g, RGBRight.g) - Math.min(RGBLeft.g, RGBRight.g)) +
      (Math.max(RGBLeft.b, RGBRight.b) - Math.min(RGBLeft.b, RGBRight.b));
  }

  /**
   * Get the luminance of a color.
   *
   * @param hex
   * @returns {number}
   */
  getLuminance(hex: string = this.hex): number {
    let rgb = this.hex2rgb(hex);

    rgb = [rgb.r / 255, rgb.g / 255, rgb.b / 255];

    for (let i = 0; i < rgb.length; i++) {
      if (rgb[i] <= 0.03928) {
        rgb[i] /= 12.92;
      }
      else {
        rgb[i] = ((rgb[i] + 0.055) / 1.055) ** 2.4;
      }
    }

    return round((0.2126 * rgb[0]) + (0.7152 * rgb[1]) + (0.0722 * rgb[2]), 4);
  }

  /**
   * Parse HEX color.
   *
   * @param {string} input
   *
   * @returns {string}
   */
  parseHex(input: string = isRequired('input')): string {
    const color = input.replace('#', '');
    let hex = color;

    if (color.length === 3) {
      hex = '';

      color.split('').forEach(d => {
        hex += d + d;
      });
    }

    hex = `#${hex}`;

    if (!validateHex(hex)) {
      throw new Error('Invalid color');
    }

    return hex;
  }

  /**
   * Parse CSS attribute.
   *
   * @param {string} input
   * @returns {Object}
   */
  parseCSS(input: string = isRequired('input')): Object {
    const model = /^rgb/.test(input) ? 'rgba' : 'hsla';
    const regex = new RegExp(`^${model}?[\\s+]?\\([\\s+]?(\\d+)[\\s+]?,[\\s+]?(\\d+)[\\s+]?,[\\s+]?(\\d+)[\\s+]?`, 'i');
    const matches = input.match(regex);

    if (matches && matches.length === 4) {
      return {
        [model.slice(0, 1)]: parseInt(matches[1], 10),
        [model.slice(1, 2)]: parseInt(matches[2], 10),
        [model.slice(2, 3)]: parseInt(matches[3], 10),
      };
    }

    throw new Error('Invalid CSS string');
  }

  /**
   * Convert a hex string to RGB object.
   *
   * @param {string} [input]
   * @returns {{r: number, g: number, b: number}}
   */
  hex2rgb(input: string = this.hex): Object {
    const hex = this.parseHex(input).substr(1);

    return {
      r: parseInt(String(hex.charAt(0)) + hex.charAt(1), 16),
      g: parseInt(String(hex.charAt(2)) + hex.charAt(3), 16),
      b: parseInt(String(hex.charAt(4)) + hex.charAt(5), 16),
    };
  }

  /**
   * Convert a hex string to HSL object.
   *
   * @param {string} [input]
   * @returns {{h: number, s: number, l: number}}
   */
  hex2hsl(input: string = this.hex): Object {
    return this.rgb2hsl(this.hex2rgb(input));
  }

  /**
   * Convert a RGB object to HSL.
   *
   * @param {Object|string} [input]
   * @returns {{h: number, s: number, l: number}}
   */
  rgb2hsl(input: Object | string = this.rgb): Object {
    const rgb = typeof input === 'string' ? this.parseCSS(input) : input;

    if (!hasProperty(rgb, 'r') || !hasProperty(rgb, 'g') || !hasProperty(rgb, 'b')) {
      throw new Error('Invalid object');
    }

    const r = this.limit(rgb.r, 'r') / 255;
    const g = this.limit(rgb.g, 'g') / 255;
    const b = this.limit(rgb.b, 'b') / 255;

    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    const delta = max - min;

    let h = 0;
    let s;
    let l;
    let rate;

    switch (max) {
      case r:
        rate = !delta ? 0 : (g - b) / delta;
        h = 60 * rate;
        break;
      case g:
        rate = (b - r) / delta;
        h = (60 * rate) + 120;
        break;
      case b:
        rate = (r - g) / delta;
        h = (60 * rate) + 240;
        break;
      /* istanbul ignore next */
      default:
        break;
    }

    if (h < 0) {
      h = 360 + h;
    }

    l = (max + min) / 2.0;

    if (min === max) {
      s = 0;
    }
    else {
      s = l < 0.5 ? delta / (2 * l) : delta / (2 - (2 * l));
    }

    return {
      h: Math.abs(+((h % 360).toFixed(2))),
      s: +((s * 100).toFixed(2)),
      l: +((l * 100).toFixed(2)),
    };
  }

  /**
   * Convert a RGA object to hex.
   *
   * @param {Object|string} [input]
   *
   * @returns {string}
   */
  rgb2hex(input: Object | string = this.rgb): string {
    const rgb = typeof input === 'string' ? this.parseCSS(input) : input;

    if (!hasProperty(rgb, 'r') || !hasProperty(rgb, 'g') || !hasProperty(rgb, 'b')) {
      throw new Error('Invalid object');
    }

    const hex = (1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b;

    return `#${hex.toString(16).slice(1)}`;
  }

  /**
   * Convert a HSL object to RGB.
   *
   * @param {Object|string} [input]
   * @returns {{r: number, g: number, b: number}}
   */
  hsl2rgb(input: Object | string = this.hsl): Object {
    const hsl = typeof input === 'string' ? this.parseCSS(input) : input;

    if (!hasProperty(hsl, 'h') || !hasProperty(hsl, 's') || !hasProperty(hsl, 'l')) {
      throw new Error('Invalid object');
    }

    const h = round(hsl.h) / 360;
    const s = round(hsl.s) / 100;
    const l = round(hsl.l) / 100;

    let r;
    let g;
    let b;

    let point;
    let chroma;

    if (s === 0) {
      r = l;
      g = l;
      b = l;
    }
    else {
      chroma = l < 0.5 ? l * (1 + s) : (l + s) - (l * s);
      point = (2 * l) - chroma;

      r = this.hue2rgb(point, chroma, h + (1 / 3));
      g = this.hue2rgb(point, chroma, h);
      b = this.hue2rgb(point, chroma, h - (1 / 3));
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  }

  /**
   * Convert a HSL object to HEX.
   *
   * @param {Object|string} [input]
   * @returns {string}
   */
  hsl2hex(input: Object | string = this.hsl): string {
    const hsl = typeof input === 'string' ? this.parseCSS(input) : input;

    return this.rgb2hex(this.hsl2rgb(hsl));
  }

  /**
   * Convert hue to RGB using chroma and median point
   *
   * @private
   * @param {number} point
   * @param {number} chroma
   * @param {number} h
   *
   * @returns {*}
   */
  hue2rgb(point: number = isRequired('point'), chroma: number = isRequired('chroma'), h: number = isRequired('hue')): number {
    let hue = h;

    if (hue < 0) {
      hue += 1;
    }

    if (hue > 1) {
      hue -= 1;
    }

    if (hue < 1 / 6) {
      return round(point + ((chroma - point) * 6 * hue), 4);
    }

    if (hue < 1 / 2) {
      return round(chroma, 4);
    }

    if (hue < 2 / 3) {
      return round(point + ((chroma - point) * ((2 / 3) - hue) * 6), 4);
    }

    return round(point, 4);
  }

  /**
   * Get a shifted color object with the same model of the input.
   *
   * @private
   * @param {Object} input - {r,g,b} or {h,s,l}
   * @returns {Object}
   */
  shift(input: Object = isRequired('input')): Object {
    if (!isPlainObject(input)) {
      throw new Error('Invalid input');
    }

    const isHSL = Object.keys(input).some(d => HSL.includes(d));
    const isRGB = Object.keys(input).some(d => RGB.includes(d));

    if (isRGB && isHSL) {
      throw new Error('Use a single color model');
    }

    if (!isHSL && !isRGB) {
      throw new Error('Could not match a color model');
    }

    if (isHSL) {
      const hsl = pick(input, HSL);

      return { ...this.hsl, ...hsl };
    }

    // Not HSL so it must be RGB
    const rgb = pick(input, RGB);

    return { ...this.rgb, ...rgb };
  }

  /**
   * Limit values per type.
   *
   * @private
   * @param {number} input
   * @param {string} type
   * @returns {number}
   */
  limit(input: number = isRequired('input'), type: string = isRequired('type')): number {
    if (typeof input !== 'number') {
      throw new Error('Input is not a number');
    }

    /* istanbul ignore else */
    if (RGB.includes(type)) {
      return Math.max(Math.min(input, 255), 0);
    }
    else if (['s', 'l'].includes(type)) {
      return Math.max(Math.min(input, 100), 0);
    }
    else if (type === 'h') {
      return Math.max(Math.min(input, 360), 0);
    }

    throw new Error('Invalid type');
  }

  /**
   * Constrain value into the range
   *
   * @private
   * @param {number} input
   * @param {number} amount
   * @param {Array} range
   * @param {string} sign
   * @returns {number}
   */
  constrain(input: number = isRequired('input'), amount: number = isRequired('amount'), range: Array<number> = isRequired('range'), sign: string = isRequired('sign')): number {
    const [min, max] = range;
    let value = expr(input + sign + amount);

    if (value < min) {
      value = min;
    }
    else if (value > max) {
      value = max;
    }

    return Math.abs(value);
  }

  /**
   * Constrain an angle
   *
   * @private
   * @param {number} input
   * @param {number} amount
   * @returns {number}
   */
  constrainDegrees(input: number = isRequired('input'), amount: number = isRequired('amount')): number {
    let value = input + amount;

    if (value > 360) {
      value -= 360;
    }

    if (value < 0) {
      value += 360;
    }

    return Math.abs(value);
  }

  /**
   * @type {number}
   */
  get red(): number {
    return Number(this.rgb.r);
  }

  /**
   * @type {number}
   */
  get green(): number {
    return Number(this.rgb.g);
  }

  /**
   * @type {number}
   */
  get blue(): number {
    return Number(this.rgb.b);
  }

  /**
   * @type {number}
   */
  get hue(): number {
    return Number(this.hsl.h);
  }

  /**
   * @type {number}
   */
  get saturation(): number {
    return Number(this.hsl.s);
  }

  /**
   * @type {number}
   */
  get lightness(): number {
    return Number(this.hsl.l);
  }
}

export { validateHex };

export default Colorizr;
