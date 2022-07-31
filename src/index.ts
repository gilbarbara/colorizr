import chroma from './chroma';
import compare from './compare';
import darken from './darken';
import desaturate from './desaturate';
import fade from './fade';
import formatCSS from './format-css';
import lighten from './lighten';
import luminance from './luminance';
import parseColor from './modules/parse-color';
import { invariant } from './modules/utils';
import rotate from './rotate';
import saturate from './saturate';
import textColor from './text-color';
import { Analysis, HSL, Options, RGB, RGBArray } from './types';

class Colorizr {
  public hex: string;
  private readonly model: Options['model'];
  public hsl: HSL;
  public rgb: RGB;

  constructor(color: string | HSL | RGB | RGBArray, options: Options = {}) {
    invariant(!!color, 'color is required');

    const { model = 'rgb' } = options;
    const { hex, hsl, rgb } = parseColor(color);

    this.model = model;
    this.hex = hex;
    this.hsl = hsl;
    this.rgb = rgb;
  }

  /**
   * Get css string
   */
  get css(): string {
    return formatCSS(this.hsl, { model: this.model });
  }

  /**
   * Get the red value
   */
  get red(): number {
    return Number(this.rgb.r);
  }

  /**
   * Get the green value
   */
  get green(): number {
    return Number(this.rgb.g);
  }

  /**
   * Get the blue value
   */
  get blue(): number {
    return Number(this.rgb.b);
  }

  /**
   * Get the hue value
   */
  get hue(): number {
    return Number(this.hsl.h);
  }

  /**
   * Get the saturation value
   */
  get saturation(): number {
    return Number(this.hsl.s);
  }

  /**
   * Get the lightness value
   */
  get lightness(): number {
    return Number(this.hsl.l);
  }

  /**
   * Get the luminance value
   */
  get luminance(): number {
    return luminance(this.hex);
  }

  /**
   * Get the chroma value
   */
  get chroma(): number {
    return chroma(this.hex);
  }

  /**
   * Get the contrasted color
   */
  get textColor(): string {
    return textColor(this.hex);
  }

  /**
   * Test 2 colors for compliance
   */
  public compare(input: string): Analysis {
    return compare(this.hex, input);
  }

  /**
   * Increase lightness
   */
  public lighten(percentage = 10): string {
    return lighten(this.hex, percentage);
  }

  /**
   * Decrease lightness
   */
  public darken(percentage = 10): string {
    return darken(this.hex, percentage);
  }

  /**
   * Increase saturation
   */
  public saturate(percentage = 10): string {
    return saturate(this.hex, percentage);
  }

  /**
   * Decrease saturation
   */
  public desaturate(percentage = 10): string {
    return desaturate(this.hex, percentage);
  }

  /**
   * Invert color
   */
  public invert(): string {
    return rotate(this.hex, 180);
  }

  /**
   * Rotate color
   */
  public rotate(degrees = 15): string {
    return rotate(this.hex, degrees);
  }

  /**
   * Fade color
   */
  public fade(percentage = 10): string {
    return fade(this.hex, percentage, this.model);
  }
}

export { default as brightnessDifference } from './brightness-difference';
export { default as chroma } from './chroma';
export { default as colorDifference } from './color-difference';
export { default as compare } from './compare';
export { default as contrast } from './contrast';
export { default as darken } from './darken';
export { default as desaturate } from './desaturate';
export { default as fade } from './fade';
export { default as formatCSS } from './format-css';
export { default as formatHex } from './format-hex';
export { default as hex2hsl } from './hex2hsl';
export { default as hex2rgb } from './hex2rgb';
export { default as hsl2hex } from './hsl2hex';
export { default as hsl2rgb } from './hsl2rgb';
export { default as isValidColor } from './is-valid-color';
export { default as isValidHex } from './is-valid-hex';
export { default as lighten } from './lighten';
export { default as luminance } from './luminance';
export { default as name } from './name';
export { default as palette } from './palette';
export { default as parseCSS } from './parse-css';
export { default as random } from './random';
export { default as rgb2hex } from './rgb2hex';
export { default as rgb2hsl } from './rgb2hsl';
export { default as rotate } from './rotate';
export { default as saturate } from './saturate';
export { default as scheme } from './scheme';
export { default as textColor } from './text-color';

export * from './types';

export default Colorizr;
