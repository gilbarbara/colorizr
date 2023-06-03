# Colorizr

[![NPM version](https://badge.fury.io/js/colorizr.svg)](https://www.npmjs.com/package/colorizr) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/colorizr)](https://bundlephobia.com/result?p=colorizr) [![CI](https://github.com/gilbarbara/colorizr/actions/workflows/main.yml/badge.svg)](https://github.com/gilbarbara/colorizr/actions/workflows/main.yml) [![Maintainability](https://api.codeclimate.com/v1/badges/6d686ce2a9f2a1a47d98/maintainability)](https://codeclimate.com/github/gilbarbara/colorizr/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/6d686ce2a9f2a1a47d98/test_coverage)](https://codeclimate.com/github/gilbarbara/colorizr/test_coverage)

Color conversion, generation, manipulation, comparison, and analysis.

## Highlights

- 🏖 **Easy to use**: Works with HSL and RGB, including CSS strings
- ♿️ **Accessibility:** WCAG analysis and comparison.
- 🛠 **Small:** Less than 6k (gzipped) and zero dependencies.
- 🟦 **Modern:** Written in Typescript.

## Setup

**Install**

```bash
npm install --save colorizr
```

## Usage

```typescript
import { luminance } from 'colorizr';

const lux = luminance('#ff0044'); // 0.2168
```

Or you can create an instance to access the methods directly:

```typescript
import Colorizr from 'Colorizr';

const colorInstance = new Colorizr('#ff0044');
colorInstance.luminance(); // 0.2168
```

## API

> String inputs accept css values: hex, rgb(a), hsl(a) and named colors.

**brightnessDifference(left: string, right: string): number**  
Get the brightness difference between 2 colors.

```typescript
import { brightnessDifference } from 'colorizr';

brightnessDifference('#fff', 'rgb(255, 0, 68)'); // 171.003
```

**chroma(input: string): number**  
Get the chroma of a color.

```typescript
import { chroma } from 'colorizr';

chroma('#ff0044'); // 1
chroma('#ffc0cb'); // 0.2471
```

**colorDifference(left: string, right: string): number**  
Get the color difference between 2 colors.

```typescript
import { colorDifference } from 'colorizr';

colorDifference('hsl(0, 0%, 100%)', '#f04'); // 442
```

**compare(left: string, right: string): Analysis**  
Get the WCAG analysis between 2 colors.

```typescript
import { compare } from 'colorizr';

compare('#ff0044', '#fff');

{
  "brightnessDifference": 171.003,
  "colorDifference": 442,
  "compliant": 1,
  "contrast": 3.94,
  "largeAA": true,
  "largeAAA": false,
  "normalAA": false,
  "normalAAA": false,
}
```

**contrast(left: string, right: string): number**  
Get the WCAG contrast ratio between 2 colors.

```typescript
import { contrast } from 'colorizr';

contrast('hsl(0, 0%, 100%)', 'rgb(255, 0, 68)'); // 3.94
```

**darken(input: string, amount = 10): string**  
Get a color with decreased lightness.

```typescript
import { darken } from 'colorizr';

darken('#ff0044', 10); // #cc0036
```

**desaturate(input: string, amount: number): string**  
Get a color with decreased saturation.

```typescript
import { desaturate } from 'colorizr';

desaturate('#ff0044', 10); // #f20d4a
```

**fade(input: string, amount: number = 10, output?: ColorTypes = 'rgb'): string**  
Get a color with decreased opacity.

```typescript
import { fade } from 'colorizr';

fade('hsl(344, 100, 50)', 10); // rgba(255, 0, 68, 0.9)
fade('#ff0044', 50, 'hsl'); // hsla(344, 100%, 50%, 0.5)
```

**formatCSS(input: HSL | RGB, options?: FormatOptions): string**  
Get a css string for a color model object.

```typescript
import { formatCSS } from 'colorizr';

formatCSS({ h: 344, s: 100, l: 50 }, { model: 'rgb' }); // 'rgb(255, 0, 68)'
formatCSS({ r: 255, g: 0, b: 68 }, { alpha: 0.5, model: 'hsl' }); // 'hsla(344, 100%, 50%, 0.5)'
```

**formatHex(input: string): string**  
Format a short hex string of 3 (or 4) digits into 6 (or 8) digits.

```typescript
import { formatHex } from 'colorizr';

formatHex('#07e'); // '#0077ee'
formatHex('#f058'); // '#ff005588'
```

**hex2hsl(input: string): HSL**  
Convert a hex string into an HSL object.

```typescript
import { hex2hsl } from 'colorizr';

hex2hsl('#ff0044'); // { h: 344, s: 100, l: 50 }
```

**hex2rgb(input: string): RGB**  
Convert a hex string into an RGB object.

```typescript
import { hex2rgb } from 'colorizr';

hex2rgb('#ff0044'); // { r: 255, g: 0, b: 68 }
```

**hsl2hex(input: HSL): string**  
Convert an HSL object into a hex string.

```typescript
import { hsl2hex } from 'colorizr';

hsl2hex({ h: 344, s: 100, l: 50 }); // '#ff0044'
```

**hsl2rgb(input: HSL): RGB**  
Convert an HSL object into an RGB object.

```typescript
import { hsl2rgb } from 'colorizr';

hsl2rgb({ h: 344, s: 100, l: 50 }); // { r: 255, g: 0, b: 68 }
```

**isValidColor(input: any): boolean**  
Check if the input is a valid color.

```typescript
import { isValidColor } from 'colorizr';

isValidColor('#f04'); // true
isValidColor('#ff0044'); // true
isValidColor('#ff004400'); // true
isValidColor('rgb(100, 255, 0)'); // true
isValidColor('hsla(344, 100%, 50%)'); // true
isValidColor('blue'); // true
isValidColor('aliceblue'); // true
isValidColor('#mmff00'); // false
isValidColor('blue-ish'); // false
```

**isValidHex(input: any): boolean**  
Check if the input is a valid hex color.

```typescript
import { isValidHex } from 'colorizr';

isValidHex('#f04'); // true
```

**lighten(input: string, amount: number): string**  
Get a color with increased lightness.

```typescript
import { lighten } from 'colorizr';

lighten('#ff0044', 10); // #ff3369
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

name('#ffc0cb', 10); // pink
name('rgb(176, 224, 230)'); // 'powderblue'
name('hsl(344, 100, 50)'); // #ff0044
```

**palette(input: string, options?: PaletteOptions): string[]**  
Get a palette of colors.

```typescript
import { palette } from 'colorizr';

palette('#ff0044');
// ['#ff0044', '#ff7700', '#88ff00', '#00ff77', '#0088ff', '#7700ff'];

palette('#ff0044', { type: 'monochromatic' });
// ['#ff99b4', '#ff5582', '#ff1150', '#cc0036', '#880024', '#440012']
```

**parseCSS(input: string, output: ColorTypes = 'hex'): string | HSL | RGB**  
Parse a css string to hex, HSL, or RGB.

```typescript
import { parseCSS } from 'colorizr';

parseCSS('hsl(270 60% 70%)'); // '#b385e0'
parseCSS('#ff0044', 'hsl'); // { h: 344, l: 50, s: 100 }
```

**random(): string**  
Get a random color.

```typescript
import { random } from 'colorizr';

random(); // '#b385e0'
```

**rgb2hex(input: RGB | RGBArray): string**  
Convert an RGB object into a hex string.

```typescript
import { rgb2hex } from 'colorizr';

rgb2hex({ r: 255, g: 55, b: 75 }); // '#ff374b'
rgb2hex([255, 0, 68]); // '#ff0044'
```

**rgb2hsl(input: RGB | RGBArray): HSL**  
Convert an RGB object into an HSL object.

```typescript
import { rgb2hsl } from 'colorizr';

rgb2hsl({ r: 255, g: 55, b: 75 }); // { h: 354, s: 100, l: 60.78 }
rgb2hsl([255, 0, 68]); // { h: 344, s: 100, l: 50 }
```

**rotate(input: string, degrees = 15): string**  
Get a color with a hue rotated by the specified degrees.

```typescript
import { rotate } from 'colorizr';

rotate('#ff0044', 30); // #ff3b00
```

**saturate(input: string, amount: number): string**  
Get a color with increased saturation.

```typescript
import { saturate } from 'colorizr';

saturate('#ff0044', 10); // #ff0044 (already at the maximum)
saturate('pink', 10); // #ffc0cb
```

**scheme(input: string, type: Scheme): string[]**  
Get a color scheme.

```typescript
import { scheme } from 'colorizr';

const complementary = scheme('rgb(255, 0, 68)'); // ['#ff0044', '#00ffbb']
const triadic = scheme('#ff0044', 'triadic'); // ['#ff0044', '#44ff00', '#0044ff']
```

**swatch(input: string, variant?: 'up' | 'down'): string[]**  
Generate a color swatch with 10 shades.  
The `variant` can be used to generate a lighter or darker swatch.

```typescript
import { swatch } from 'colorizr';

const colors = swatch('#ff0044');
/* [
  "#ffccda",
  "#ff99b4",
  "#ff668f",
  "#ff3369",
  "#ff0044",
  "#cc0036",
  "#990029",
  "#66001b",
  "#33000e",
  "#1a0007",
] */
```

**textColor(input: string): string**  
Get a contrasting color (black or white) to use with the input color.

```typescript
import { textColor } from 'colorizr';

textColor('#ff0044'); // #ffffff
textColor('#fff800'); // #000000
```

## Instance API

```typescript
import Colorizr from 'Colorizr';

const colorizr = new Colorizr('#ff0044');

colorizr.hex; // #ff0044
colorizr.hsl; // { h: 344, s: 100, l: 50 };
colorizr.rgb; // { r: 255, g: 0, b: 68 };
```

### Getters

**colorizr.hex**  
Get the hex code.

**colorizr.hsl**  
Get the HSL object.

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

**colorizr.luminance**  
Get the luminance (0-1).

**colorizr.chroma**
Get the chroma (0-1).

**colorizr.textColor**
Get the contrasting color (black or white).

### Manipulation

**colorizr.lighten(percentage: number = 10)**
Get a lighter color.

**colorizr.darken(percentage: number = 10)**
Get a darker color.

**colorizr.desaturate(percentage: number = 10)**
Get a desaturated color.

**colorizr.saturate(percentage: number = 10)**
Get a saturated color.

**colorizr.rotate(degrees: number = 15)**
Get a color with a hue rotated.

**colorizr.invert()**
Get the inverted color.

**colorizr.fade(percentage: number = 10)**
Get a faded color.

### Comparison

**colorizr.compare(color: string)**  
Returns an object with the analysis (check the compare output above)

## References

[calculating-color-contrast](https://24ways.org/2010/calculating-color-contrast/)  
[Colour Contrast Check](https://snook.ca/technical/colour_contrast/colour.html)  
[Contrast Checker](https://webaim.org/resources/contrastchecker/)  
[Converting Color Spaces in typescript](https://css-tricks.com/converting-color-spaces-in-typescript/)
