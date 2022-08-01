# Colorizr

[![NPM version](https://badge.fury.io/js/colorizr.svg)](https://www.npmjs.com/package/colorizr) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/colorizr)](https://bundlephobia.com/result?p=colorizr) [![CI](https://github.com/gilbarbara/colorizr/actions/workflows/main.yml/badge.svg)](https://github.com/gilbarbara/colorizr/actions/workflows/main.yml) [![Maintainability](https://api.codeclimate.com/v1/badges/6d686ce2a9f2a1a47d98/maintainability)](https://codeclimate.com/github/gilbarbara/colorizr/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/6d686ce2a9f2a1a47d98/test_coverage)](https://codeclimate.com/github/gilbarbara/colorizr/test_coverage)

Color conversion, manipulation, comparison, and analysis.

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

Or you can create an instance to access all methods:

```typescript
import Colorizr from 'Colorizr';

const colorizr = new Colorizr('#ff0044');
```

## Methods

> String inputs accept css values: hex, rgb(a), hsl(a) and named colors.

**brightnessDifference(left: string, right: string): number**  
_get the brightness difference between 2 colors_

```typescript
import { brightnessDifference } from 'colorizr';

brightnessDifference('#fff', 'rgb(255, 0, 68)'); // 171.003
```

**chroma(input: string): number**  
_get the chroma of a color_

```typescript
import { chroma } from 'colorizr';

chroma('#ff0044'); // 1
chroma('#ffc0cb'); // 0.2471
```

**colorDifference(left: string, right: string): number**  
_get the color difference between 2 colors_

```typescript
import { colorDifference } from 'colorizr';

colorDifference('hsl(0, 0%, 100%)', '#f04'); // 442
```

**compare(left: string, right: string): Analysis**  
_get the WCAG analysis for two colors_

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
_get the WCAG contrast ratio between 2 colors_

```typescript
import { contrast } from 'colorizr';

contrast('hsl(0, 0%, 100%)', 'rgb(255, 0, 68)'); // 3.94
```

**darken(input: string, amount = 10): string**  
_get a color with decreased lightness_

```typescript
import { darken } from 'colorizr';

darken('#ff0044', 10); // #cc0036
```

**desaturate(input: string, amount: number): string**  
_get a color with decreased saturation_

```typescript
import { desaturate } from 'colorizr';

desaturate('#ff0044', 10); // #f20d4a
```

**fade(input: string, amount: number = 10, output?: ColorTypes = 'rgb'): string**  
_get a transparent color_

```typescript
import { fade } from 'colorizr';

fade('hsl(344, 100, 50)', 10); // rgba(255, 0, 68, 0.9)
fade('#ff0044', 50, 'hsl'); // hsla(344, 100%, 50%, 0.5)
```

**formatCSS(input: HSL | RGB, options?: FormatOptions): string**  
_get the css string for a color model object_

```typescript
import { formatCSS } from 'colorizr';

formatCSS({ h: 344, s: 100, l: 50 }, { model: 'rgb' }); // 'rgb(255, 0, 68)'
formatCSS({ r: 255, g: 0, b: 68 }, { alpha: 0.5, model: 'hsl' }); // 'hsla(344, 100%, 50%, 0.5)'
```

**formatHex(input: string): string**  
_format a short hex string of 3 (or 4) digits into 6 (or 8) digits._

```typescript
import { formatHex } from 'colorizr';

formatHex('#07e'); // '#0077ee'
formatHex('#f058'); // '#ff005588'
```

**hex2hsl(input: string): HSL**  
_convert a hex string into an HSL object_

```typescript
import { hex2hsl } from 'colorizr';

hex2hsl('#ff0044'); // { h: 344, s: 100, l: 50 }
```

**hex2rgb(input: string): RGB**  
_convert a hex string into an RGB object_

```typescript
import { hex2rgb } from 'colorizr';

hex2rgb('#ff0044'); // { r: 255, g: 0, b: 68 }
```

**hsl2hex(input: HSL): string**  
_convert an HSL object into a hex string_

```typescript
import { hsl2hex } from 'colorizr';

hsl2hex({ h: 344, s: 100, l: 50 }); // '#ff0044'
```

**hsl2rgb(input: HSL): RGB**  
_convert an HSL object into an RGB object_

```typescript
import { hsl2rgb } from 'colorizr';

hsl2rgb({ h: 344, s: 100, l: 50 }); // { r: 255, g: 0, b: 68 }
```

**isValidColor(input: any): boolean**  
_check if the input can be parsed correctly_

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
_check if the input is a valid hex_

```typescript
import { isValidHex } from 'colorizr';

isValidHex('#f04'); // true
```

**lighten(input: string, amount: number): string**  
_get a color with increased lightness_

```typescript
import { lighten } from 'colorizr';

lighten('#ff0044', 10); // #ff3369
```

**luminance(input: string): number**  
_get the relative brightness according to the [WCAG definition](https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef). Normalized to `0` for black and `1` for white._

```typescript
import { luminance } from 'colorizr';

luminance('#ff0044'); // 0.2168
```

**name(input: string): string**  
_get the named color. return the hex code if it can't be named_

```typescript
import { name } from 'colorizr';

name('#ffc0cb', 10); // pink
name('rgb(176, 224, 230)'); // 'powderblue'
name('hsl(344, 100, 50)'); // #ff0044
```

**palette(input: string, options?: PaletteOptions): string[]**  
_get a palette for a color_

```typescript
import { palette } from 'colorizr';

palette('#ff0044');
// ['#ff0044', '#ff7700', '#88ff00', '#00ff77', '#0088ff', '#7700ff'];

palette('#ff0044', { type: 'monochromatic' });
// ['#ff99b4', '#ff5582', '#ff1150', '#cc0036', '#880024', '#440012']
```

**parseCSS(input: string, output: ColorTypes = 'hex'): string | HSL | RGB**  
_parse a css string to hex, hsl, or RGB_

```typescript
import { parseCSS } from 'colorizr';

parseCSS('hsl(270 60% 70%)'); // '#b385e0'
parseCSS('#ff0044', 'hsl'); // { h: 344, l: 50, s: 100 }
```

**random(): string**  
_get a random color_

```typescript
import { random } from 'colorizr';

random(); // '#b385e0'
```

**rgb2hex(input: RGB | RGBArray): string**  
_convert an RGB object into a hex string_

```typescript
import { rgb2hex } from 'colorizr';

rgb2hex({ r: 255, g: 55, b: 75 }); // '#ff374b'
rgb2hex([255, 0, 68]); // '#ff0044'
```

**rgb2hsl(input: RGB | RGBArray): HSL**  
_convert an RGB object into an HSL object_

```typescript
import { rgb2hsl } from 'colorizr';

rgb2hsl({ r: 255, g: 55, b: 75 }); // { h: 354, s: 100, l: 60.78 }
rgb2hsl([255, 0, 68]); // { h: 344, s: 100, l: 50 }
```

**rotate(input: string, degrees = 15): string** _get a color with changed hue_

```typescript
import { rotate } from 'colorizr';

rotate('#ff0044', 30); // #ff3b00
```

**saturate(input: string, amount: number): string**  
_get a color with increased saturation_

```typescript
import { saturate } from 'colorizr';

saturate('#ff0044', 10); // #ff0044 (already at the maximum)
saturate('pink', 10); // #ffc0cb
```

**scheme(input: string, type: Scheme): string[]**  
_get the scheme for a color_

```typescript
import { scheme } from 'colorizr';

const complementary = scheme('rgb(255, 0, 68)'); // ['#ff0044', '#00ffbb']
const triadic = scheme('#ff0044', 'triadic'); // ['#ff0044', '#44ff00', '#0044ff']
```

**textColor(input: string): string**  
_get a contrasting color to use with the text_

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
_returns the hex_

**colorizr.hsl**  
_returns the HSL object_

**colorizr.rgb**  
_returns the RGB object_

**colorizr.hue**  
_returns the color hue, between 0 and 360_

**colorizr.saturation**  
_returns the color saturation, between 0 and 100_

**colorizr.lightness**  
_returns the color lightness, between 0 and 100_

**colorizr.red**  
_returns the color red level, between 0 and 255_

**colorizr.green**  
_returns the color green level, between 0 and 255_

**colorizr.blue**  
_returns the color blue level, between 0 and 255_

**colorizr.luminance**

**colorizr.chroma**

**colorizr.textColor**

### Manipulation

**colorizr.lighten(percentage = 10)**

**colorizr.darken(percentage = 10)**

**colorizr.saturate(percentage = 10)**

**colorizr.saturate(percentage = 10)**

**colorizr.rotate(degrees = 15)**

**colorizr.invert()**

**colorizr.fade(percentage = 10)**

### Comparison

**colorizr.compare(color: string)**  
_returns an object with the analysis (check the compare output above)_

## References

[calculating-color-contrast](https://24ways.org/2010/calculating-color-contrast/)  
[Colour Contrast Check](https://snook.ca/technical/colour_contrast/colour.html)  
[Contrast Checker](https://webaim.org/resources/contrastchecker/)  
[Converting Color Spaces in typescript](https://css-tricks.com/converting-color-spaces-in-typescript/)
