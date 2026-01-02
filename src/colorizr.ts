import brightnessDifference from '~/brightness-difference';
import chroma from '~/chroma';
import colorDifference from '~/color-difference';
import compare from '~/compare';
import contrast from '~/contrast';
import darken from '~/darken';
import desaturate from '~/desaturate';
import formatCSS from '~/format-css';
import grayscale from '~/grayscale';
import invert from '~/invert';
import lighten from '~/lighten';
import luminance from '~/luminance';
import mix from '~/mix';
import { invariant } from '~/modules/invariant';
import parseColor from '~/modules/parse-color';
import opacify from '~/opacify';
import opacity from '~/opacity';
import readableColor from '~/readable-color';
import rotate from '~/rotate';
import saturate from '~/saturate';
import transparentize from '~/transparentize';

import { Alpha, Amount, Analysis, ColorType, Degrees, HEX, HSL, LAB, LCH, RGB } from '~/types';

export interface ColorizrOptions {
  /**
   * Output color format.
   *
   * If not specified, the output will use the same format as the input color.
   */
  format?: ColorType;
}

export default class Colorizr {
  public alpha: Alpha;
  public hex: HEX;
  public hsl: HSL;
  public oklab: LAB;
  public oklch: LCH;
  public rgb: RGB;
  public type: ColorType;

  constructor(color: string | HSL | LAB | LCH | RGB, options: ColorizrOptions = {}) {
    invariant(!!color, 'color is required');

    const { alpha, hex, hsl, oklab, oklch, rgb, type } = parseColor(color);

    this.hex = hex;
    this.hsl = hsl;
    this.oklab = oklab;
    this.oklch = oklch;
    this.rgb = rgb;

    this.alpha = alpha;
    this.type = options.format ?? type;
  }

  /**
   * Get CSS string
   */
  get css(): string {
    return this.currentColor;
  }

  /**
   * Get the red value
   */
  get red(): number {
    return this.rgb.r;
  }

  /**
   * Get the green value
   */
  get green(): number {
    return this.rgb.g;
  }

  /**
   * Get the blue value
   */
  get blue(): number {
    return this.rgb.b;
  }

  /**
   * Get the hue value
   */
  get hue(): number {
    return this.hsl.h;
  }

  /**
   * Get the saturation value
   */
  get saturation(): number {
    return this.hsl.s;
  }

  /**
   * Get the lightness value
   */
  get lightness(): number {
    return this.hsl.l;
  }

  /**
   * Get the luminance value
   */
  get luminance(): number {
    return luminance(this.currentColor);
  }

  /**
   * Get the chroma value
   */
  get chroma(): number {
    return chroma(this.currentColor);
  }

  get opacity(): number {
    return opacity(this.currentColor);
  }

  /**
   * Get the most readable color (light or dark) for this color as a background.
   */
  get readableColor(): string {
    return readableColor(this.currentColor);
  }

  private get currentColor(): string {
    return formatCSS(this[this.type], { format: this.type, alpha: this.alpha });
  }

  public brightnessDifference(input: string): number {
    return brightnessDifference(this.currentColor, input);
  }

  public colorDifference(input: string): number {
    return colorDifference(this.currentColor, input);
  }

  /**
   * Test 2 colors for compliance
   */
  public compare(input: string): Analysis {
    return compare(this.currentColor, input);
  }

  public contrast(input: string): number {
    return contrast(this.currentColor, input);
  }

  public format(type: ColorType, precision?: number): string {
    return formatCSS(this.rgb, {
      alpha: this.alpha,
      format: type,
      precision,
    });
  }

  /**
   * Increase lightness
   */
  public lighten(amount: Amount): string {
    return lighten(this.currentColor, amount);
  }

  /**
   * Decrease lightness
   */
  public darken(amount: Amount): string {
    return darken(this.currentColor, amount);
  }

  /**
   * Increase saturation
   */
  public saturate(amount: Amount): string {
    return saturate(this.currentColor, amount);
  }

  /**
   * Decrease saturation
   */
  public desaturate(amount: Amount): string {
    return desaturate(this.currentColor, amount);
  }

  /**
   * Convert to grayscale
   */
  public grayscale(): string {
    return grayscale(this.currentColor);
  }

  /**
   * Invert color
   */
  public invert(): string {
    return invert(this.currentColor);
  }

  /**
   * Mix with another color
   */
  public mix(color: string, ratio?: number): string {
    return mix(this.currentColor, color, ratio);
  }

  /**
   * Add opacity to the color.
   */
  public opacify(alpha: Alpha = 0.9): string {
    return opacify(this.currentColor, alpha, this.type);
  }

  /**
   * Rotate color
   */
  public rotate(degrees: Degrees): string {
    return rotate(this.currentColor, degrees);
  }

  /**
   * Make the color more transparent
   */
  public transparentize(alpha: Alpha = 0.1): string {
    return transparentize(this.currentColor, alpha, this.type);
  }
}
