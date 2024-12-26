import { invariant } from '~/modules/invariant';
import parseColor from '~/modules/parse-color';

import brightnessDifference from '~/brightness-difference';
import chroma from '~/chroma';
import colorDifference from '~/color-difference';
import compare from '~/compare';
import contrast from '~/contrast';
import darken from '~/darken';
import desaturate from '~/desaturate';
import formatCSS from '~/format-css';
import invert from '~/invert';
import lighten from '~/lighten';
import luminance from '~/luminance';
import opacify from '~/opacify';
import opacity from '~/opacity';
import rotate from '~/rotate';
import saturate from '~/saturate';
import textColor from '~/text-color';
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
   * Get css string
   */
  get css(): string {
    return this.selectedColor;
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
    return luminance(this.selectedColor);
  }

  /**
   * Get the chroma value
   */
  get chroma(): number {
    return chroma(this.selectedColor);
  }

  get opacity(): number {
    return opacity(this.selectedColor);
  }

  /**
   * Get the contrasted color
   */
  get textColor(): string {
    return textColor(this.selectedColor);
  }

  private get selectedColor(): string {
    return formatCSS(this[this.type], { format: this.type, alpha: this.alpha });
  }

  public brightnessDifference(input: string): number {
    return brightnessDifference(this.selectedColor, input);
  }

  public colorDifference(input: string): number {
    return colorDifference(this.selectedColor, input);
  }

  /**
   * Test 2 colors for compliance
   */
  public compare(input: string): Analysis {
    return compare(this.selectedColor, input);
  }

  public contrast(input: string): number {
    return contrast(this.selectedColor, input);
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
    return lighten(this.selectedColor, amount);
  }

  /**
   * Decrease lightness
   */
  public darken(amount: Amount): string {
    return darken(this.selectedColor, amount);
  }

  /**
   * Increase saturation
   */
  public saturate(amount: Amount): string {
    return saturate(this.selectedColor, amount);
  }

  /**
   * Decrease saturation
   */
  public desaturate(amount: Amount): string {
    return desaturate(this.selectedColor, amount);
  }

  /**
   * Invert color
   */
  public invert(): string {
    return invert(this.selectedColor);
  }

  /**
   * Add opacity to the color.
   */
  public opacify(alpha: Alpha = 0.9): string {
    return opacify(this.selectedColor, alpha, this.type);
  }

  /**
   * Rotate color
   */
  public rotate(degrees: Degrees): string {
    return rotate(this.selectedColor, degrees);
  }

  /**
   * Make the color more transparent
   */
  public transparentize(alpha: Alpha = 0.1): string {
    return transparentize(this.selectedColor, alpha, this.type);
  }
}
