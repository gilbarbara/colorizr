<p align="center">
  <br>
  <img alt="colorizr logo" src="docs/public/logo.svg" height="120">
  <br>
  <br>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/colorizr"><img src="https://badge.fury.io/js/colorizr.svg" alt="NPM version" /></a>
  <a href="https://github.com/gilbarbara/colorizr/actions/workflows/ci.yml"><img src="https://github.com/gilbarbara/colorizr/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://sonarcloud.io/summary/new_code?id=gilbarbara_colorizr"><img src="https://sonarcloud.io/api/project_badges/measure?project=gilbarbara_colorizr&metric=alert_status" alt="Quality Gate Status" /></a>
  <a href="https://sonarcloud.io/summary/new_code?id=gilbarbara_colorizr"><img src="https://sonarcloud.io/api/project_badges/measure?project=gilbarbara_colorizr&metric=coverage" alt="Coverage" /></a>
</p>

# Colorizr

A modern color library focused on perceptual correctness and accessibility.

- 🏖 **Easy to use**: Works with Hex, HSL, RGB, OKLAB, and OKLCH.
- ♿️ **Accessibility**: WCAG 2.x contrast and APCA (WCAG 3.0) support.
- 🎨 **Design Systems**: Generate perceptual color scales with variants.
- 🖥 **Modern Displays**: P3 gamut optimization and OkLCH operations.
- 🟦 **TypeScript**: Full type safety, zero dependencies.

📖 **[Official Website](https://gilbarbara.github.io/colorizr)**

## Setup

```bash
npm i colorizr
```

## Generating Scales & Palettes

Build design system color scales with customizable variants:

```typescript
import { scale, palette, scheme } from 'colorizr';

scale('#3366ff');
// { 50: '#f0f5ff', 100: '#e4edff', ..., 900: '#06009a', 950: '#020052' }

palette('#ff0044');
// ['#ff0044', '#ffbb00', '#44ff00', '#00ffbb', '#0044ff', '#bb00ff']

scheme('#ff0044', 'triadic');
// ['#ff0044', '#44ff00', '#0044ff']
```

## Accessibility & Contrast

Analyze contrast ratios and find readable text colors:

```typescript
import { contrast, readableColor, compare, apcaContrast } from 'colorizr';

contrast('#1a1a2e', '#ffffff'); // 17.05
readableColor('#ff0044'); // '#ffffff'
apcaContrast('#000000', '#ffffff'); // 106.04067

compare('#ff0044', '#ffffff');
// { contrast: 3.94, normalAA: false, largeAA: true, ... }
```

## Manipulating Colors

Adjust lightness, saturation, hue, and opacity:

```typescript
import { lighten, darken, saturate, mix, rotate } from 'colorizr';

lighten('#ff0044', 20); // '#ff668f'
darken('#ff0044', 10);  // '#cc0036'
rotate('#ff0044', 180); // '#00ffbb'

mix('#ff0044', '#0066ff');                         // '#bc34d7'
mix('#ff0044', '#0066ff', 0.5, { space: 'hsl' });  // '#aa00ff'
```

## Converting Colors

Convert between all supported color spaces:

```typescript
import { convertCSS, hex2oklch, parseCSS } from 'colorizr';

convertCSS('#ff0044', 'oklch'); // 'oklch(63.269% 0.25404 19.902)'
convertCSS('#ff0044', 'hsl');   // 'hsl(344 100% 50%)'

hex2oklch('#ff0044');
// { l: 0.63269, c: 0.25404, h: 19.90224 }

parseCSS('hsl(344 100% 50%)');
// { h: 344, s: 100, l: 50 }
```

## Class API

Create an instance to work with a single color:

```typescript
import Colorizr from 'colorizr';

const color = new Colorizr('#ff0044');
color.luminance;      // 0.2168
color.chroma;         // 1
color.readableColor;  // '#ffffff'
color.lighten(20);    // '#ff668f'
color.mix('#0066ff'); // '#bc34d7'
```

📖 **[Read the full documentation](https://gilbarbara.github.io/colorizr)**

## Credits / References

[color.js](https://github.com/color-js/color.js)  
[chroma-js](https://gka.github.io/chroma.js/)  
[calculating-color-contrast](https://24ways.org/2010/calculating-color-contrast/)  
[Colour Contrast Check](https://snook.ca/technical/colour_contrast/colour.html)  
[Converting Color Spaces in typescript](https://css-tricks.com/converting-color-spaces-in-typescript/)  
[A perceptual color space for image processing](https://bottosson.github.io/posts/oklab/)  
[SAPC-APCA](https://github.com/Myndex/SAPC-APCA)

## License

MIT
