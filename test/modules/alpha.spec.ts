import {
  addAlphaToHex,
  convertAlphaToHex,
  extractAlphaFromHex,
  normalizeAlpha,
  removeAlphaFromHex,
} from '~/modules/alpha';

import { addOpacityToCssString, brightPink, green, violet, yellow } from '../__fixtures__';

describe('normalizeAlpha', () => {
  it.each([
    { input: 0, expected: 0 },
    { input: 0.5, expected: 0.5 },
    { input: 1, expected: 1 },
    { input: 50, expected: 0.5 },
    { input: 90, expected: 0.9 },
    { input: 100, expected: 1 },
    { input: undefined, expected: undefined },
  ])('should normalize $input to $expected', ({ input, expected }) => {
    expect(normalizeAlpha(input)).toBe(expected);
  });
});

describe('addAlphaToHex', () => {
  it.each([
    { input: addOpacityToCssString(brightPink.hex, 0.9), alpha: 1, expected: brightPink.hex },
    {
      input: addOpacityToCssString(brightPink.hex, 0.9),
      alpha: 0.8,
      expected: addOpacityToCssString(brightPink.hex, 0.8),
    },
    { input: green.hex, alpha: 1, expected: green.hex },
    {
      input: addOpacityToCssString(green.hex, 0.02),
      alpha: 0.9,
      expected: addOpacityToCssString(green.hex, 0.9),
    },
  ])('should return $expected with $input and $alpha', ({ input, alpha, expected }) => {
    expect(addAlphaToHex(input, alpha)).toBe(expected);
  });
});

describe('convertAlphaToHex', () => {
  it.each([
    { input: 0, expected: '00' },
    { input: 0.01, expected: '03' },
    { input: 0.02, expected: '05' },
    { input: 0.03, expected: '08' },
    { input: 0.04, expected: '0a' },
    { input: 0.05, expected: '0d' },
    { input: 0.06, expected: '0f' },
    { input: 0.07, expected: '12' },
    { input: 0.08, expected: '14' },
    { input: 0.09, expected: '17' },
    { input: 0.1, expected: '1a' },
    { input: 0.11, expected: '1c' },
    { input: 0.12, expected: '1f' },
    { input: 0.13, expected: '21' },
    { input: 0.14, expected: '24' },
    { input: 0.15, expected: '26' },
    { input: 0.16, expected: '29' },
    { input: 0.17, expected: '2b' },
    { input: 0.18, expected: '2e' },
    { input: 0.19, expected: '30' },
    { input: 0.2, expected: '33' },
    { input: 0.21, expected: '36' },
    { input: 0.22, expected: '38' },
    { input: 0.23, expected: '3b' },
    { input: 0.24, expected: '3d' },
    { input: 0.25, expected: '40' },
    { input: 0.26, expected: '42' },
    { input: 0.27, expected: '45' },
    { input: 0.28, expected: '47' },
    { input: 0.29, expected: '4a' },
    { input: 0.3, expected: '4d' },
    { input: 0.31, expected: '4f' },
    { input: 0.32, expected: '52' },
    { input: 0.33, expected: '54' },
    { input: 0.34, expected: '57' },
    { input: 0.35, expected: '59' },
    { input: 0.36, expected: '5c' },
    { input: 0.37, expected: '5e' },
    { input: 0.38, expected: '61' },
    { input: 0.39, expected: '63' },
    { input: 0.4, expected: '66' },
    { input: 0.41, expected: '69' },
    { input: 0.42, expected: '6b' },
    { input: 0.43, expected: '6e' },
    { input: 0.44, expected: '70' },
    { input: 0.45, expected: '73' },
    { input: 0.46, expected: '75' },
    { input: 0.47, expected: '78' },
    { input: 0.48, expected: '7a' },
    { input: 0.49, expected: '7d' },
    { input: 0.5, expected: '80' },
    { input: 0.51, expected: '82' },
    { input: 0.52, expected: '85' },
    { input: 0.53, expected: '87' },
    { input: 0.54, expected: '8a' },
    { input: 0.55, expected: '8c' },
    { input: 0.56, expected: '8f' },
    { input: 0.57, expected: '91' },
    { input: 0.58, expected: '94' },
    { input: 0.59, expected: '96' },
    { input: 0.6, expected: '99' },
    { input: 0.61, expected: '9c' },
    { input: 0.62, expected: '9e' },
    { input: 0.63, expected: 'a1' },
    { input: 0.64, expected: 'a3' },
    { input: 0.65, expected: 'a6' },
    { input: 0.66, expected: 'a8' },
    { input: 0.67, expected: 'ab' },
    { input: 0.68, expected: 'ad' },
    { input: 0.69, expected: 'b0' },
    { input: 0.7, expected: 'b3' },
    { input: 0.71, expected: 'b5' },
    { input: 0.72, expected: 'b8' },
    { input: 0.73, expected: 'ba' },
    { input: 0.74, expected: 'bd' },
    { input: 0.75, expected: 'bf' },
    { input: 0.76, expected: 'c2' },
    { input: 0.77, expected: 'c4' },
    { input: 0.78, expected: 'c7' },
    { input: 0.79, expected: 'c9' },
    { input: 0.8, expected: 'cc' },
    { input: 0.81, expected: 'cf' },
    { input: 0.82, expected: 'd1' },
    { input: 0.83, expected: 'd4' },
    { input: 0.84, expected: 'd6' },
    { input: 0.85, expected: 'd9' },
    { input: 0.86, expected: 'db' },
    { input: 0.87, expected: 'de' },
    { input: 0.88, expected: 'e0' },
    { input: 0.89, expected: 'e3' },
    { input: 0.9, expected: 'e6' },
    { input: 0.91, expected: 'e8' },
    { input: 0.92, expected: 'eb' },
    { input: 0.93, expected: 'ed' },
    { input: 0.94, expected: 'f0' },
    { input: 0.95, expected: 'f2' },
    { input: 0.96, expected: 'f5' },
    { input: 0.97, expected: 'f7' },
    { input: 0.98, expected: 'fa' },
    { input: 0.99, expected: 'fc' },
    { input: 1, expected: 'ff' },
    { input: 90, expected: 'e6' },
    { input: 100, expected: 'ff' },
  ])(`should convert $input to $expected`, ({ input, expected }) => {
    expect(convertAlphaToHex(input)).toBe(expected);
  });
});

describe('extractAlphaFromHex', () => {
  it.each([
    { input: addOpacityToCssString(brightPink.hex, 0), expected: 0 },
    { input: addOpacityToCssString(green.hex, 0.2), expected: 0.2 },
    { input: addOpacityToCssString(violet.hex, 0.45), expected: 0.45 },
    { input: addOpacityToCssString(yellow.hex, 1), expected: 1 },
  ])(`should extract alpha from $input`, ({ input, expected }) => {
    expect(extractAlphaFromHex(input)).toBe(expected);
  });
});

describe('removeAlphaFromHex', () => {
  it.each([
    { input: '#f058', expected: '#f05' },
    { input: '#f0a0', expected: '#f0a' },
    { input: '#abcf', expected: '#abc' },
    { input: '#aabbcc', expected: '#aabbcc' },
    { input: '#ff0044', expected: '#ff0044' },
    { input: '#aabbcc88', expected: '#aabbcc' },
    { input: '#ff0044ff', expected: '#ff0044' },
    { input: '#00ff0000', expected: '#00ff00' },
  ])('should match $input to $expected', ({ input, expected }) => {
    expect(removeAlphaFromHex(input)).toBe(expected);
  });
});
