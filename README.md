Colorizr
===

[![NPM version](https://badge.fury.io/js/colorizr.svg)](https://www.npmjs.com/package/colorizr)
[![build status](https://travis-ci.org/gilbarbara/colorizr.svg)](https://travis-ci.org/gilbarbara/colorizr) 
[![Maintainability](https://api.codeclimate.com/v1/badges/6d686ce2a9f2a1a47d98/maintainability)](https://codeclimate.com/github/gilbarbara/colorizr/maintainability) 
[![Test Coverage](https://api.codeclimate.com/v1/badges/6d686ce2a9f2a1a47d98/test_coverage)](https://codeclimate.com/github/gilbarbara/colorizr/test_coverage)

> JavaScript module to manipulate colors, get its properties and compare it with another color following the WCAG 2.0.

## Setup

**Install**

```bash
npm install --save colorizr
```

And import it:

```javascript
import Colorizr from 'Colorizr';
```

## Usage

```javascript
const colorizr = new Colorizr('#ff0044');

colorizr.hex // #ff0044
colorizr.hsl // { h: 344, s: 100, l: 50 };
colorizr.rgb // { r: 255, g: 0, b: 68 };

colorizr.saturate(20);
colorizr.lighten(10);
```

## API

*Set the instance color.*  
**colorizr.setColor(color: string | Array<number> | Object)**

#### Getters

```js
colorizr.hue // 0-360
colorizr.saturation // 0-100
colorizr.lightness // 0-100
colorizr.red // 0-255
colorizr.green // 0-255
colorizr.blue // 0-255
colorizr.luminance // 0-1
colorizr.chroma // 0-1
```


#### Manipulation

*Increase lightness.*  
**colorizr.lighten(percentage: number = 10)**

*Decrease lightness.*  
**colorizr.darken(percentage: number = 10)**

*Increase saturation.*  
**colorizr.saturate(percentage: number = 10)**

*Decrease saturation.*  
**colorizr.saturate(percentage: number = 10)**





### References
[calculating-color-contrast](https://24ways.org/2010/calculating-color-contrast/)  
[Colour Contrast Check](https://snook.ca/technical/colour_contrast/colour.html)    
[Contrast Checker](https://webaim.org/resources/contrastchecker/)  
