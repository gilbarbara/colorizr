// @flow
import { expr, hasProperty, isPlainObject, pick, round } from './utils';

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
   * Change the main color.
   *
   * @param {string|Array|Object} color
   */
  setColor(color: string | Array<number> | Object) {
    if (!color) {
      throw new Error('Not a valid color');
    }

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
      throw new Error('Input not valid');
    }
  }

  setColorFromArray(color: Array<number>) {
    this.rgb = {
      r: this.limit(color[0], 'r'),
      g: this.limit(color[1], 'g'),
      b: this.limit(color[2], 'b'),
    };

    this.hex = this.rgb2hex();
    this.hsl = this.rgb2hsl();
  }

  setColorFromObject(color: Object) {
    if (hasProperty(color, 'h') && hasProperty(color, 's') && hasProperty(color, 'l')) {
      this.hsl = {
        h: this.limit(color.h, 'h'),
        s: this.limit(color.s, 's'),
        l: this.limit(color.l, 'l'),
      };
      this.rgb = this.hsl2rgb();
    }
    else if (hasProperty(color, 'r') && hasProperty(color, 'g') && hasProperty(color, 'b')) {
      this.rgb = color;
      this.hsl = this.rgb2hsl();
    }
    else {
      throw new Error('Not a valid object');
    }

    this.hex = this.hsl2hex();
  }

  /**
   * Make the color lighter.
   *
   * @param {number} percentage
   * @returns {string}
   */
  lighten(percentage: number): string {
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
  darken(percentage: number): string {
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
  saturate(percentage: number): string {
    const hsl = this.shift({
      s: this.constrain(this.saturation, percentage, [0, 100], '+'),
    });

    return this.hsl2hex(hsl);
  }

  /**
   * Descrease saturation.
   *
   * @param {number} percentage
   * @returns {string}
   */
  desaturate(percentage: number): string {
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
  adjustHue(degrees: number): string {
    const hsl = this.shift({
      h: this.constrainDegrees(this.hue, +degrees),
    });

    return this.hsl2hex(hsl);
  }

  /**
   * Alter color values.
   *
   * @param {Object} input
   * @param {boolean} returnHex
   *
   * @returns {string}
   */
  remix(input: Object, returnHex: boolean = false): Object | string {
    const shift = this.shift(input);

    if (returnHex) {
      return shift.r ? this.rgb2hex(shift) : this.hsl2hex(shift);
    }

    return shift;
  }

  /**
   * Validate HEX color.
   *
   * @param {string} hex
   *
   * @returns {boolean}
   */
  validHex(hex: string): boolean {
    return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(hex);
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
   * Convert a hex string to RGB object.
   *
   * @param {string} input
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
   * @param {string} input
   * @returns {{h: number, s: number, l: number}}
   */
  hex2hsl(input: string = this.hex): Object {
    return this.rgb2hsl(this.hex2rgb(input));
  }

  /**
   * Convert a RGB object to HSL.
   *
   * @param {Object|string} input
   * @returns {{h: number, s: number, l: number}}
   */
  rgb2hsl(input: Object | string = this.rgb): Object {
    const rgb = typeof input === 'string' ? this.parseCSS(input) : input;

    if (!hasProperty(rgb, 'r') || !hasProperty(rgb, 'g') || !hasProperty(rgb, 'b')) {
      throw new Error('hex2hsl::invalid object');
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
   * @param {Object|string} input
   *
   * @returns {string}
   */
  rgb2hex(input: Object = this.rgb): string {
    const rgb = typeof input === 'string' ? this.parseCSS(input) : input;

    if (!hasProperty(rgb, 'r') || !hasProperty(rgb, 'g') || !hasProperty(rgb, 'b')) {
      throw new Error('rgb2hex::invalid object');
    }

    const hex = (1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b;

    return `#${hex.toString(16).slice(1)}`;
  }

  /**
   * Convert a HSL object to RGB.
   *
   * @param {Object|string} input
   * @returns {{r: number, g: number, b: number}}
   */
  hsl2rgb(input: Object | string = this.hsl): Object {
    let hsl = input;

    if (typeof hsl === 'string') {
      hsl = this.parseCSS(hsl);
    }

    if (!hasProperty(hsl, 'h') || !hasProperty(hsl, 's') || !hasProperty(hsl, 'l')) {
      throw new Error('hsl2rgb::invalid object');
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
   * @param {Object} hsl
   * @returns {string}
   */
  hsl2hex(hsl: Object = this.hsl): string {
    return this.rgb2hex(this.hsl2rgb(hsl));
  }

  /**
   * @param {number} point
   * @param {number} chroma
   * @param {number} h
   *
   * @returns {*}
   */
  hue2rgb(point: number, chroma: number, h: number): number {
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
   * Parse HEX color.
   *
   * @param {string} hex
   *
   * @returns {string}
   */
  parseHex(hex: string): string {
    const color = hex.replace('#', '');
    let newHex = '';

    if (color.length === 3) {
      color.split('').forEach(d => {
        newHex += d + d;
      });
    }
    else {
      newHex = color;
    }

    newHex = `#${newHex}`;

    if (!this.validHex(newHex)) {
      throw new Error('Not a valid color');
    }

    return newHex;
  }

  /**
   * Parse CSS attribute.
   *
   * @param {string} input
   * @returns {Object}
   */
  parseCSS(input: string): Object {
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

    throw new Error('Not a valid color');
  }

  /**
   * Get a shifted color object with the same model of the input.
   *
   * @private
   * @param {Object} color - {r,g,b} or {h,s,l}
   * @returns {Object}
   */
  shift(color: Object): Object {
    const isHSL = Object.keys(color).some(d => HSL.includes(d));
    const isRGB = Object.keys(color).some(d => RGB.includes(d));

    if (isRGB && isHSL) {
      throw new Error('Only use a single color model');
    }

    if (!isHSL && !isRGB) {
      throw new Error('Could not match a color model');
    }

    if (isHSL) {
      const hsl = pick(color, HSL);

      if (!Object.keys(hsl).length) {
        return this.hsl;
      }

      return { ...this.hsl, ...hsl };
    }

    // Not HSL so it must be RGB
    const rgb = pick(color, RGB);

    if (!Object.keys(rgb).length) {
      return this.rgb;
    }

    return { ...this.rgb, ...rgb };
  }

  /**
   * Limit values per type.
   *
   * @private
   * @param {number} value
   * @param {string} type
   * @returns {number}
   */
  limit(value: number, type: string): number {
    if (typeof value !== 'number') {
      throw new Error('not a number');
    }

    if (RGB.includes(type)) {
      return Math.max(Math.min(value, 255), 0);
    }
    else if (['s', 'l'].includes(type)) {
      return Math.max(Math.min(value, 100), 0);
    }
    else if (type === 'h') {
      return Math.max(Math.min(value, 360), 0);
    }

    throw new Error('invalid type');
  }

  /**
   * Constrain value into the range
   *
   * @private
   * @param {number} input
   * @param {number} amount
   * @param {Array} range
   * @param {string} direction
   * @returns {number}
   */
  constrain(input: number, amount: number, range: Array<number>, direction: string): number {
    const [min, max] = range;
    let value = expr(input + direction + amount);

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
  constrainDegrees(input: number, amount: number): number {
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

export default Colorizr;
