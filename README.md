Colorizr
===

[![NPM version](https://badge.fury.io/js/colorizr.svg)](https://www.npmjs.com/package/colorizr)
[![build status](https://travis-ci.org/gilbarbara/colorizr.svg)](https://travis-ci.org/gilbarbara/colorizr)

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
