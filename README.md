# Colorizr

[![NPM version](https://badge.fury.io/js/colorizr.svg)](https://www.npmjs.com/package/colorizr) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/colorizr)](https://bundlephobia.com/result?p=colorizr) [![CI](https://github.com/gilbarbara/colorizr/actions/workflows/main.yml/badge.svg)](https://github.com/gilbarbara/colorizr/actions/workflows/main.yml) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=gilbarbara_colorizr&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=gilbarbara_colorizr) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=gilbarbara_colorizr&metric=coverage)](https://sonarcloud.io/summary/new_code?id=gilbarbara_colorizr)

Color conversion, generation, manipulation, comparison, and analysis.

## Highlights

- 🏖 **Easy to use**: Works with Hex, HSL, OkLab, OkLCH, and RGB.
- ♿️ **Accessibility:** WCAG analysis and comparison.
- 🛠 **Small:** 7kB (gzipped) and tree-shakable.
- 🟦 **Modern:** Written in Typescript.

## Setup

**Install**

```bash
npm i colorizr
```

## Usage

You can use all the functions standalone:

```typescript
import { luminance } from 'colorizr';

const lux = luminance('#ff0044'); // 0.2168
```

Or you can create an instance to use all the methods for the same color:

```typescript
import Colorizr from 'Colorizr';

const colorInstance = new Colorizr('#ff0044');
colorInstance.luminance; // 0.2168
colorInstance.chroma; // 1
colorInstance.opacity; // 1
```

## API

> String inputs accept css values: hex, hsl, oklab, oklch, rgb, and named colors.

- [Info](#Info)
- [Manipulators](#Manipulators)
- [Converters](#Converters)
- [Generators](#Generators)
- [Comparison](#Comparison)
- [Utilities](#Utilities)
- [Validators](#Validators)
- [Class](#Class)

### Info

**chroma(input: string): number**  
Get the chroma of a color.

```typescript
import { chroma } from 'colorizr';

chroma('#ff0044'); // 1
chroma('#ffc0cb'); // 0.2471
```

**luminance(input: string): number**  
Get the relative brightness according to the [WCAG definition](https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef).  
Normalized to `0` for black and `1` for white.

```typescript
import { luminance } from 'colorizr';

luminance('#ff0044'); // 0.2168
```

**name(input: string): string**  
Get the name of a color. Return the hex code if it can't be named.

```typescript
import { name } from 'colorizr';

name('#ffc0cb'); // pink
name('rgb(176 224 230)'); // 'powderblue'
name('hsl(344 100 50)'); // #ff0044
```

**opacity(input: string): string**  
Get the opacity of a color.

```typescript
import { opacity } from 'colorizr';

opacity('#ff0044'); // 1
opacity('rgb(255 0 68 / 90%)'); // 0.9
opacity('hsl(344 100 50 / 60%)'); // 0.6
```

### Manipulators

**lighten(input: string, amount: number): string**  
Get a color with increased lightness.

```typescript
import { lighten } from 'colorizr';

lighten('#ff0044', 10); // #ff3369
lighten('hsl(136 100% 50%)', 10); // hsl(136 100% 60%)
```

**darken(input: string, amount: number): string**  
Get a color with decreased lightness.

```typescript
import { darken } from 'colorizr';

darken('#ff0044', 10); // #cc0036
darken('oklch(47.642% 0.29956 274.93693)', 10); // oklch(40.377% 0.25281 275.46794)
```

**saturate(input: string, amount: number): string**  
Get a color with increased saturation.

```typescript
import { saturate } from 'colorizr';

saturate('#ff0044', 10); // #ff0044 (already at the maximum)
saturate('pink', 10); // #ffc0cb
```

**desaturate(input: string, alpha: number): string**  
Get a color with decreased saturation.

```typescript
import { desaturate } from 'colorizr';

desaturate('#ff0044', 10); // #f20d4a
desaturate('oklab(70.622% 0.1374 0.14283)', 10); // oklab(69.021% 0.12176 0.13721)
```

**invert(input: string): string**  
Invert the color.

```typescript
import { invert } from 'colorizr';

invert('#07e'); // '#0077ee'
invert('#f058'); // '#ff005588'
```

**rotate(input: string, degrees: number): string**  
Get a color with a hue rotated by the specified degrees.

```typescript
import { rotate } from 'colorizr';

rotate('#ff0044', 30); // #ff3b00
```

**opacify(input: string, alpha: number, format?: ColorType): string**  
Add opacity to a color

```typescript
import { opacify } from 'colorizr';

opacify('hsl(344, 100, 50)', 0.9); // hsl(344 100 50 / 90%)
opacify('#ff0044', 0.8); // #ff0044cc
```

**transparentize(input: string, alpha: number, format?: ColorType): string**  
Increase/decrease the color opacity.

```typescript
import { transparentize } from 'colorizr';

transparentize('hsl(344, 100, 50)', 10); // hsl(344 100 50 / 90%)
transparentize('#ff0044', 50, 'hsl'); // #ff004480
```

### Comparison

**brightnessDifference(left: string, right: string): number**  
Get the brightness difference between the two colors.

```typescript
import { brightnessDifference } from 'colorizr';

brightnessDifference('#fff', 'rgb(255, 0, 68)'); // 171.003
```

**colorDifference(left: string, right: string): number**  
Get the color difference between the two colors.

```typescript
import { colorDifference } from 'colorizr';

colorDifference('hsl(0 0% 100%)', '#f04'); // 442
```

**compare(left: string, right: string): Analysis**  
Get the WCAG analysis between two colors.

```typescript
import { compare } from 'colorizr';

compare('#ff0044', '#fff');

({
  "brightnessDifference": 171.003,
  "colorDifference": 442,
  "compliant": 1,
  "contrast": 3.94,
  "largeAA": true,
  "largeAAA": false,
  "normalAA": false,
  "normalAAA": false,
})
```

**contrast(left: string, right: string): number**  
Get the WCAG contrast ratio between two colors.

```typescript
import { contrast } from 'colorizr';

contrast('hsl(0 0% 100%)', 'rgb(255 0 68)'); // 3.94
```
### Generators

**palette(input: string, options?: PaletteOptions): string[]**  
Generate a palette of colors.

```typescript
import { palette } from 'colorizr';

palette('#ff0044');
// ['#ff0044', '#ff7700', '#88ff00', '#00ff77', '#0088ff', '#7700ff'];

palette('#ff0044', { type: 'monochromatic' });
// ['#ff99b4', '#ff5582', '#ff1150', '#cc0036', '#880024', '#440012']
```

**scheme(input: string, type: SchemeOptions): string[]**  
Get a color scheme.

```typescript
import { scheme } from 'colorizr';

const complementary = scheme('rgb(255 0 68)'); // ['#ff0044', '#00ffbb']
const triadic = scheme('#ff0044', 'triadic'); // ['#ff0044', '#44ff00', '#0044ff']
```

**swatch(input: string, options?: SwatchOptions): Swatch**  
Generate a color swatch with eleven shades, from lightest (50) to darkest (950).

```typescript
import { swatch } from 'colorizr';

swatch('#ff0044');
/*
{
  '50': '#ffeeed',
  '100': '#ffe0df',
  '200': '#ffc7c6',
  '300': '#ffa7a7',
  '400': '#ff8186',
  '500': '#ff5464',
  '600': '#f20f42',
  '700': '#d40021',
  '800': '#ad0000',
  '900': '#7d0000',
  '950': '#470000'
}
*/

swatch('#ff0044', { lightnessFactor: 1.2, maxLightness: 0.9, minLightness: 0.1 });
/*
{
  '50': '#ffc6c5',
  '100': '#ffaaaa',
  '200': '#ff868a',
  '300': '#ff5c6a',
  '400': '#f8284a',
  '500': '#df002d',
  '600': '#c0000f',
  '700': '#9b0000',
  '800': '#710000',
  '900': '#450000',
  '950': '#180000'
}
*/
```

### Converters

The default precision is 5.

**convert(input: string, format: ColorType): string**  
Convert a color string to another format.

```typescript
import { convert } from 'colorizr';

convert('#ff0044', 'hsl') // hsl(344 100% 50%)
convert('rgb(255 0 68)', 'oklch') // oklch(63.269% 0.25404 19.90218)
```

**hex2hsl(input: string): HSL**  
Convert HEX to HSL.

```typescript
import { hex2hsl } from 'colorizr';

hex2hsl('#ff0044'); // { h: 344, s: 100, l: 50 }
```

**hex2oklab(input: string, precision?: number): LAB**  
Convert HEX to OKLAB.

```typescript
import { hex2oklab } from 'colorizr';

hex2oklab('#ff0044'); // { l: 0.63269, a: 0.23887, b: 0.08648 }
```

**hex2oklch(input: string, precision?: number): LCH**  
Convert HEX to OKLCH.

```typescript
import { hex2oklch } from 'colorizr';

hex2oklch('#ff0044'); // { l: 0.63269, c: 0.25404, h: 19.90218 }
```

**hex2rgb(input: string): RGB**  
Convert HEX to RGB.

```typescript
import { hex2rgb } from 'colorizr';

hex2rgb('#ff0044'); // { r: 255, g: 0, b: 68 }
```

**hsl2hex(input: HSL | ColorTuple): string**  
Convert HSL to HEX.

```typescript
import { hsl2hex } from 'colorizr';

hsl2hex({ h: 344, s: 100, l: 50 }); // '#ff0044'
hsl2hex([344, 100, 50]); // '#ff0044'
```

**hsl2oklab(input: HSL | ColorTuple, precision?: number): LAB**  
Convert HSL to OKLAB.

```typescript
import { hsl2oklab } from 'colorizr';

hsl2oklab({ h: 344, s: 100, l: 50 }); // { l: 0.63269, a: 0.23887, b: 0.08648 }
hsl2oklab([344, 100, 50]); // { l: 0.63269, a: 0.23887, b: 0.08648 }
```

**hsl2oklch(input: HSL | ColorTuple, precision?: number): LCH**  
Convert HSL to OKLCH.

```typescript
import { hsl2oklch } from 'colorizr';

hsl2oklch({ h: 344, s: 100, l: 50 }); // { l: 0.63269, c: 0.25404, h: 19.90218 }
hsl2oklch([344, 100, 50]); // { l: 0.63269, c: 0.25404, h: 19.90218 }
```

**hsl2rgb(input: HSL | ColorTuple): RGB**  
Convert HSL to RGB.

```typescript
import { hsl2rgb } from 'colorizr';

hsl2rgb({ h: 344, s: 100, l: 50 }); // { r: 255, g: 0, b: 68 }
hsl2rgb([344, 100, 50]); // { r: 255, g: 0, b: 68 }
```

**oklab2hex(input: LAB | ColorTuple): string**  
Convert OKLAB to HEX.

```typescript
import { oklab2hex } from 'colorizr';

oklab2hex({ l: 0.63269, a: 0.23887, b: 0.08648 }); // '#ff0044'
oklab2hex([0.63269, 0.23887, 0.08648]); // '#ff0044'
```

**oklab2hsl(input: LAB | ColorTuple): HSL**  
Convert OKLAB to HSL.

```typescript
import { oklab2hsl } from 'colorizr';

oklab2hsl({ l: 0.63269, a: 0.23887, b: 0.08648 }); // { h: 344, s: 100, l: 50 }
oklab2hsl([0.63269, 0.23887, 0.08648]); // { h: 344, s: 100, l: 50 }
```

**oklab2oklch(input: LAB | ColorTuple, precision?: number): LCH**  
Convert OKLAB to OKLCH.

```typescript
import { oklab2oklch } from 'colorizr';

oklab2oklch({ l: 0.63269, a: 0.23887, b: 0.08648 }); // { l: 0.63269, c: 0.25404, h: 19.90218 }
oklab2oklch([0.63269, 0.23887, 0.08648]); // { l: 0.63269, c: 0.25404, h: 19.90218 }
```

**oklab2rgb(input: LAB | ColorTuple, precision: number = 0): RGB**  
Convert OKLAB to RGB.

```typescript
import { oklab2rgb } from 'colorizr';

oklab2rgb({ l: 0.63269, a: 0.23887, b: 0.08648 }); // { r: 255, g: 0, b: 68 }
oklab2rgb([0.63269, 0.23887, 0.08648]); // { r: 255, g: 0, b: 68 }
```

**oklch2hex(input: LCH | ColorTuple): string**  
Convert OKLCH to HEX.

```typescript
import { oklch2hex } from 'colorizr';

oklch2hex({ l: 0.63269, c: 0.25404, h: 19.90218 }); // '#ff0044'
oklch2hex([0.63269, 0.25404, 19.90218]); // '#ff0044'
```

**oklch2hsl(input: LCH | ColorTuple): HSL**  
Convert OKLCH to HSL.

```typescript
import { oklch2hsl } from 'colorizr';

oklch2hsl({ l: 0.63269, c: 0.25404, h: 19.90218 }); // { h: 344, s: 100, l: 50 }
oklch2hsl([0.63269, 0.25404, 19.90218]); // { h: 344, s: 100, l: 50 }
```

**oklch2oklab(input: LCH | ColorTuple, precision?: number): LAB**  
Convert OKLCH to OKLAB.

```typescript
import { oklch2oklab } from 'colorizr';

oklch2oklab({ l: 0.63269, c: 0.25404, h: 19.90218 }); // { l: 0.63269, a: 0.23887, b: 0.08648 }
oklch2oklab([0.63269, 0.25404, 19.90218]); // { l: 0.63269, a: 0.23887, b: 0.08648 }
```

**oklch2rgb(input: LCH | ColorTuple, precision: number = 0): RGB**  
Convert OKLCH to RGB.

```typescript
import { oklch2rgb } from 'colorizr';

oklch2rgb({ l: 0.63269, c: 0.25404, h: 19.90218 }); // { r: 255, g: 0, b: 68 }
oklch2rgb([0.63269, 0.25404, 19.90218]); // { r: 255, g: 0, b: 68 }
```

**rgb2hex(input: RGB | ColorTuple): string**  
Convert RGB to HEX.

```typescript
import { rgb2hex } from 'colorizr';

rgb2hex({ r: 255, g: 0, b: 68 }); // '#ff0044'
rgb2hex([255, 0, 68]); // '#ff0044'
```

**rgb2hsl(input: RGB | ColorTuple): HSL**  
Convert RGB to HSL.

```typescript
import { rgb2hsl } from 'colorizr';

rgb2hsl({ r: 255, g: 0, b: 68 }); // { h: 344, s: 100, l: 50 }
rgb2hsl([255, 0, 68]); // { h: 344, s: 100, l: 50 }
```

**rgb2oklab(input: RGB | ColorTuple, precision?: number): LAB**  
Convert RGB to OKLAB.

```typescript
import { rgb2oklab } from 'colorizr';

rgb2oklab({ r: 255, g: 0, b: 68 }); // { l: 0.63269, a: 0.23887, b: 0.08648 }
rgb2oklab([255, 0, 68]); // { l: 0.63269, a: 0.23887, b: 0.08648 }
```

**rgb2oklch(input: RGB | ColorTuple, precision?: number): LCH**  
Convert RGB to OKLCH.

```typescript
import { rgb2oklch } from 'colorizr';

rgb2oklch({ r: 255, g: 0, b: 68 }); // { l: 0.63269, c: 0.25404, h: 19.90218 }
rgb2oklch([255, 0, 68]); // { l: 0.63269, c: 0.25404, h: 19.90218 }
```

### Utilities

**addAlphaToHex(input: string, alpha: number): string**  
Add an alpha value to a hex string

```typescript
import { addAlphaToHex } from 'colorizr';

addAlphaToHex('#ff0044', 0.9); // '#ff0044e6'
addAlphaToHex('#ff0044cc', 0.9); // '#ff0044e6'
```

**convertAlphaToHex(input: number): string**  
Convert an alpha value to a hex value.

```typescript
import { convertAlphaToHex } from 'colorizr';

convertAlphaToHex(0.5); // '80'
```

**extractAlphaFromHex(input: string): number**  
Extract the alpha value from a hex string

```typescript
import { extractAlphaFromHex } from 'colorizr';

convertAlphaToHex('#ff004480'); // 0.5
```

**extractColorParts(input: string): ExtractColorPartsReturn**  
Extract the color parts from a CSS color string.
Hex colors are not supported.

```typescript
type ExtractColorPartsReturn = {
  alpha?: number;
  model: 'hsl' | 'oklab' | 'oklch' | 'rgb';
} & Record<string, number>;

extractColorParts('rgb(255 0 68)') // { model: 'rgb', r: 255, g: 0, b: 68 }
extractColorParts('hsl(344 100% 50% / 90%)') // { alpha: 0.9, model: 'hsl', h: 344, g: 100, l: 50 }
```

**formatCSS(input: HSL | RGB, options?: FormatCSSOptions): string**  
Get a css string from a color object.

```typescript
import { formatCSS } from 'colorizr';

formatCSS({ h: 344, s: 100, l: 50 }, { format: 'rgb' }); // 'rgb(255, 0, 68)'
formatCSS({ r: 255, g: 0, b: 68 }, { alpha: 0.5, format: 'hsl' }); // 'hsla(344, 100%, 50%, 0.5)'
```

**formatHex(input: string): string**  
Format a short hex string of 3 (or 4) digits into 6 (or 8) digits.

```typescript
import { formatHex } from 'colorizr';

formatHex('#07e'); // '#0077ee'
formatHex('#f058'); // '#ff005588'
```

**getOkLCHMaxChroma(input: string | LCH, precision?: number): number**  
Get the maximum chroma for a given lightness and hue in the OkLCH color space.

```typescript
import { getOkLCHMaxChroma } from 'colorizr';

getOkLCHMaxChroma({ l: 0.63269, c: 0.25404, h: 19.90218 }); // 0.28643
getOkLCHMaxChroma('#00ff44'); // 0.30921 
```

**getP3Color(input: string | LCH): string**  
Get a OkLCH color in the P3 color space.

```typescript
import { getP3Color } from 'colorizr';

getP3Color({ l: 0.63269, c: 0.25404, h: 19.90218 }); // oklch(0.63269 0.28643 19.90218)
getP3Color('#00ff44'); // oklch(0.86876 0.30921 144.65534) 
```

**parseCSS(input: string, format?: ColorType): string | HSL | RGB**  
Parse a css string to hex, HSL, OKLAB, OKLCH, or RGB.  
If the format isn't set, it will return the same format as the input.

```typescript
import { parseCSS } from 'colorizr';

parseCSS('hsl(344 100% 50%)'); // { h: 344, l: 50, s: 100 }
parseCSS('#ff0044', 'hsl'); // { h: 344, l: 50, s: 100 }
```

**random(type: ColorType = 'hex'): string**  
Get a random color.

```typescript
import { random } from 'colorizr';

random(); // '#b385e0'
random('oklch') // oklab(86.876% -0.22518 0.1597)
```

**removeAlphaFromHex(input: string): string**  
Remove the alpha value from a hex string

```typescript
import { removeAlphaFromHex } from 'colorizr';

removeAlphaFromHex('#ff0044cc'); // '#ff0044'
```

**textColor(input: string, options?: TextColorOptions): string**  
Get a contrasting color (black or white) for the input color.

```typescript
import { textColor } from 'colorizr';

textColor('#ff0044'); // #ffffff
textColor('#fff800'); // #000000
```

### Validators

**isValidColor(input: any): boolean**  
Check if the input is a valid color.

```typescript
import { isValidColor } from 'colorizr';

isValidColor('#ff0044'); // true
isValidColor('#ff004400'); // true
isValidColor('hsl(136 100% 50%)'); // true
isValidColor('hsla(344, 100%, 50%, 0.4)'); // true
isValidColor('oklab(70.622% 0.1374 0.14283)'); // true
isValidColor('oklch(47.642% 0.29956 274.93693)'); // true
isValidColor('rgb(255 230 109)'); // true
isValidColor('blue'); // true
isValidColor('aliceblue'); // true
isValidColor('#mmff00'); // false
isValidColor('blue-ish'); // false
```

**isHex(input: unknown): boolean**  
Check if the input is a valid hex color.

```typescript
import { isHex } from 'colorizr';

isHex('#f04'); // true
isHex('#ff0044'); // true
isHex('#ff0044cc'); // true
```

**isHSL(input: unknown): boolean**  
Check if the input is a valid HSL object.

```typescript
import { isHSL } from 'colorizr';

isHSL({ h: 344, s: 100, l: 50 }); // true
```

**isLAB(input: unknown): boolean**  
Check if the input is a valid LAB color.

```typescript
import { isLAB } from 'colorizr';

isLAB({ l: 0.63269, a: 0.23887, b: 0.08648 }); // true
```

**isLHC(input: unknown): boolean**  
Check if the input is a valid LCH color.

```typescript
import { isLHC } from 'colorizr';

isLHC({ l: 0.63269, c: 0.25404, h: 19.90218 }); // true
```

**isRGB(input: unknown): boolean**  
Check if the input is a valid RGB color.

```typescript
import { isRGB } from 'colorizr';

isRGB({ r: 255, g: 0, b: 68 }); // true
```

### Class

```typescript
import Colorizr from 'Colorizr';

const colorizr = new Colorizr('#ff0044');

colorizr.hex; // #ff0044
colorizr.hsl; // { h: 344, s: 100, l: 50 };
colorizr.rgb; // { r: 255, g: 0, b: 68 };
```

#### Getters

**colorizr.hex**  
Get the hex code.

**colorizr.hsl**  
Get the HSL object.

**colorizr.oklab**  
Get the OKLAB object.

**colorizr.oklch**  
Get the OKLCH object.

**colorizr.rgb**  
Get the RGB object.

**colorizr.hue**  
Get the hue (0-360).

**colorizr.saturation**  
Get the saturation (0-100).

**colorizr.lightness**  
Get the lightness (0-100).

**colorizr.red**  
Get the red level (0-255).

**colorizr.green**  
Get the green level (0-255).

**colorizr.blue**  
Get the blue level (0-255).

**colorizr.chroma**
Get the chroma (0-1).

**colorizr.luminance**  
Get the luminance (0-1).

**colorizr.opacity**  
Get the opacity (0-1).

**colorizr.css**  
Get the css string of the same type as the input.

**colorizr.textColor**
Get a contrasting color (black or white).

#### Methods

**colorizr.format(type: ColorType, precision?: number)**  
Returns the formatted color with the type

...

Also, all the [manipulators](#Manipulators) and [comparison](#Comparison) utilities.

## Credits / References

[color.js](https://github.com/color-js/color.js)  
[chroma-js](https://gka.github.io/chroma.js/)  
[calculating-color-contrast](https://24ways.org/2010/calculating-color-contrast/)  
[Colour Contrast Check](https://snook.ca/technical/colour_contrast/colour.html)  
[Contrast Checker](https://webaim.org/resources/contrastchecker/)  
[Converting Color Spaces in typescript](https://css-tricks.com/converting-color-spaces-in-typescript/)  
[A perceptual color space for image processing](https://bottosson.github.io/posts/oklab/)

