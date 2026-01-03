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
import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import parseColor from '~/modules/parse-color';
import opacify from '~/opacify';
import opacity from '~/opacity';
import readableColor from '~/readable-color';
import rotate from '~/rotate';
import saturate from '~/saturate';
import transparentize from '~/transparentize';

import { Analysis, ColorType, HEX, HSL, LAB, LCH, RGB } from '~/types';

export interface ColorizrOptions {
  /**
   * Output color format.
   *
   * If not specified, the output will use the same format as the input color.
   */
  format?: ColorType;
}

export default class Colorizr {
  /** The alpha/opacity value (0-1). */
  public alpha: number;
  public hex: HEX;
  public hsl: HSL;
  public oklab: LAB;
  public oklch: LCH;
  public rgb: RGB;
  public type: ColorType;

  constructor(color: string | HSL | LAB | LCH | RGB, options: ColorizrOptions = {}) {
    invariant(!!color, MESSAGES.colorRequired);

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

  /**
   * Get the brightness difference between this color and another.
   *
   * @param input - The color to compare against.
   * @returns The brightness difference value.
   */
  public brightnessDifference(input: string): number {
    return brightnessDifference(this.currentColor, input);
  }

  /**
   * Get the color difference between this color and another.
   *
   * @param input - The color to compare against.
   * @returns The color difference value.
   */
  public colorDifference(input: string): number {
    return colorDifference(this.currentColor, input);
  }

  /**
   * Test 2 colors for WCAG compliance.
   *
   * @param input - The color to compare against.
   * @returns Analysis object with compliance information.
   */
  public compare(input: string): Analysis {
    return compare(this.currentColor, input);
  }

  /**
   * Get the contrast ratio between this color and another.
   *
   * @param input - The color to compare against.
   * @returns The contrast ratio.
   */
  public contrast(input: string): number {
    return contrast(this.currentColor, input);
  }

  /**
   * Format the color to a specific type.
   *
   * @param type - The color format to convert to.
   * @param precision - The decimal precision for the output.
   * @returns The formatted color string.
   */
  public format(type: ColorType, precision?: number): string {
    return formatCSS(this.rgb, {
      alpha: this.alpha,
      format: type,
      precision,
    });
  }

  /**
   * Increase lightness.
   *
   * @param amount - A number between 0 and 100.
   * @returns The lightened color string.
   */
  public lighten(amount: number): string {
    return lighten(this.currentColor, amount);
  }

  /**
   * Decrease lightness.
   *
   * @param amount - A number between 0 and 100.
   * @returns The darkened color string.
   */
  public darken(amount: number): string {
    return darken(this.currentColor, amount);
  }

  /**
   * Increase saturation.
   *
   * @param amount - A number between 0 and 100.
   * @returns The saturated color string.
   */
  public saturate(amount: number): string {
    return saturate(this.currentColor, amount);
  }

  /**
   * Decrease saturation.
   *
   * @param amount - A number between 0 and 100.
   * @returns The desaturated color string.
   */
  public desaturate(amount: number): string {
    return desaturate(this.currentColor, amount);
  }

  /**
   * Convert to grayscale.
   *
   * @returns The grayscale color string.
   */
  public grayscale(): string {
    return grayscale(this.currentColor);
  }

  /**
   * Invert color.
   *
   * @returns The inverted color string.
   */
  public invert(): string {
    return invert(this.currentColor);
  }

  /**
   * Mix with another color.
   *
   * @param color - The color to mix with.
   * @param ratio - A number between 0 and 1 (0 = this color, 1 = input color).
   * @returns The mixed color string.
   */
  public mix(color: string, ratio?: number): string {
    return mix(this.currentColor, color, ratio);
  }

  /**
   * Add opacity to the color.
   *
   * @param alpha - A number between 0 and 1.
   * @returns The opacified color string.
   */
  public opacify(alpha: number = 0.9): string {
    return opacify(this.currentColor, alpha, this.type);
  }

  /**
   * Rotate color hue.
   *
   * @param degrees - A number between -360 and 360.
   * @returns The rotated color string.
   */
  public rotate(degrees: number): string {
    return rotate(this.currentColor, degrees);
  }

  /**
   * Make the color more transparent.
   *
   * @param alpha - A number between -1 and 1.
   * @returns The transparentized color string.
   */
  public transparentize(alpha: number = 0.1): string {
    return transparentize(this.currentColor, alpha, this.type);
  }
}
