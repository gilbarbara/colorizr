Colorizr
===

[![NPM version](https://badge.fury.io/js/colorizr.svg)](https://www.npmjs.com/package/colorizr)
[![build status](https://travis-ci.org/gilbarbara/colorizr.svg)](https://travis-ci.org/gilbarbara/colorizr) 
[![Maintainability](https://api.codeclimate.com/v1/badges/6d686ce2a9f2a1a47d98/maintainability)](https://codeclimate.com/github/gilbarbara/colorizr/maintainability) 
[![Test Coverage](https://api.codeclimate.com/v1/badges/6d686ce2a9f2a1a47d98/test_coverage)](https://codeclimate.com/github/gilbarbara/colorizr/test_coverage)

## Setup

**Install**

```bash
npm install --save colorizr
```

And import:

```javascript
import Colorizr from 'Colorizr';
```

## Usage

```javascript
this.colorizr = new Colorizr('#ff0044');

this.colorizr.hex // #ff0044
this.colorizr.hsl // { h: 344, s: 100, l: 50 };
this.colorizr.rgb // { r: 255, g: 0, b: 68 };

this.colorizr.saturate(20);
this.colorizr.lighten(10);
```

## API

Coming soon...

**References**  
https://24ways.org/2010/calculating-color-contrast/  
https://snook.ca/technical/colour_contrast/colour.html  
https://webaim.org/resources/contrastchecker/  
