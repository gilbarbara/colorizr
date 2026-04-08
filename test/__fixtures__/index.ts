import { convertAlphaToHex } from '~/modules/hex-utils';
import { round } from '~/modules/utils';
import { isHex } from '~/modules/validators';

export const alphaCases = {
  semi: 0.5,
  transparent: 0,
  nearOpaque: 0.99,
  opaque: 1,
};

export const brightPink = {
  hex: '#ff0044' as const,
  hexAlpha: '#ff004480' as const,
  hsl: { h: 344, s: 100, l: 50 },
  hslString: 'hsl(344 100% 50%)',
  oklab: { l: 0.63269, a: 0.23887, b: 0.08648 },
  oklabLong: { l: 0.6326860506565246, a: 0.23886698675457535, b: 0.08647920826782624 },
  oklabString: 'oklab(63.269% 0.23887 0.08648)',
  oklch: { l: 0.63269, c: 0.25404, h: 19.90224 },
  oklchLong: { l: 0.6326860506565246, c: 0.25403954578734494, h: 19.902240785746187 },
  oklchString: 'oklch(63.269% 0.25404 19.902)',
  rgb: { r: 255, g: 0, b: 68 },
  rgbString: 'rgb(255 0 68)',
};

export const green = {
  hex: '#00ff44' as const,
  hexAlpha: '#00ff4480' as const,
  hsl: { h: 136, s: 100, l: 50 },
  hslString: 'hsl(136 100% 50%)',
  oklab: { l: 0.86876, a: -0.22518, b: 0.1597 },
  oklabLong: { l: 0.8687605896103548, a: -0.22518225181645085, b: 0.1597012246235041 },
  oklabString: 'oklab(86.876% -0.22518 0.1597)',
  oklch: { l: 0.86876, c: 0.27606, h: 144.6554 },
  oklchLong: { l: 0.8687605896103548, c: 0.2760643542353384, h: 144.65540033481756 },
  oklchString: 'oklch(86.876% 0.27606 144.66)',
  rgb: { r: 0, g: 255, b: 68 },
  rgbString: 'rgb(0 255 68)',
};

export const orange = {
  hex: '#ff6e00' as const,
  hexAlpha: '#ff6e0080' as const,
  hsl: { h: 25.88, s: 100, l: 50 },
  hslString: 'hsl(25.88 100% 50%)',
  oklab: { l: 0.70622, a: 0.1374, b: 0.14283 },
  oklabLong: { l: 0.7062175288970731, a: 0.13740239848567976, b: 0.14282966262792662 },
  oklabString: 'oklab(70.622% 0.1374 0.14283)',
  oklch: { l: 0.70622, c: 0.19819, h: 46.10951 },
  oklchLong: { l: 0.7062175288970731, c: 0.1981911492373584, h: 46.10951066321462 },
  oklchString: 'oklch(70.622% 0.19819 46.11)',
  rgb: { r: 255, g: 110, b: 0 },
  rgbString: 'rgb(255 110 0)',
};

export const violet = {
  hex: '#4400ff' as const,
  hexAlpha: '#4400ff80' as const,
  hsl: { h: 256, s: 100, l: 50 },
  hslString: 'hsl(256 100% 50%)',
  oklab: { l: 0.47642, a: 0.02578, b: -0.29845 },
  oklabLong: { l: 0.47642081717305756, a: 0.025778057394838294, b: -0.29845257707982414 },
  oklabString: 'oklab(47.642% 0.02578 -0.29845)',
  oklch: { l: 0.47642, c: 0.29956, h: 274.93652 },
  oklchLong: { l: 0.47642081717305756, c: 0.299563764512065, h: 274.9365209922358 },
  oklchString: 'oklch(47.642% 0.29956 274.94)',
  rgb: { r: 68, g: 0, b: 255 },
  rgbString: 'rgb(68 0 255)',
};

export const yellow = {
  hex: '#ffe66d' as const,
  hexAlpha: '#ffe66d80' as const,
  hsl: { h: 49.73, s: 100, l: 71.37 },
  hslString: 'hsl(49.73 100% 71.37%)',
  oklab: { l: 0.92235, a: -0.01932, b: 0.14143 },
  oklabLong: { l: 0.922350998807585, a: -0.01931764987879525, b: 0.14143140414845023 },
  oklabString: 'oklab(92.235% -0.01932 0.14143)',
  oklch: { l: 0.92235, c: 0.14274, h: 97.77771 },
  oklchLong: { l: 0.922350998807585, c: 0.14274457494504644, h: 97.77771337249595 },
  oklchString: 'oklch(92.235% 0.14274 97.778)',
  rgb: { r: 255, g: 230, b: 109 },
  rgbString: 'rgb(255 230 109)',
};

/**
 * Test helper to add opacity to a CSS color string.
 *
 * @param cssString - The CSS color string (hex, hsl, rgb, oklab, oklch)
 * @param alpha - A value between 0 and 1
 * @param withPercentage - If true, output percentage format for non-hex strings
 */
export function addOpacityToCssString(
  cssString: string,
  alpha: number,
  withPercentage = false,
): string {
  if (isHex(cssString)) {
    if (alpha === 1) {
      return cssString;
    }

    return `${cssString}${convertAlphaToHex(alpha)}`;
  }

  const alphaValue = withPercentage ? round(alpha * 100) : alpha;

  if (alpha === 1) {
    return cssString;
  }

  return cssString.replace(')', ` / ${alphaValue}${withPercentage ? '%' : ''})`);
}
