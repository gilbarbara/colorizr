import {
  addAlphaToHex,
  convertAlphaToHex,
  extractAlphaFromHex,
  hexadecimalToNumber,
  removeAlphaFromHex,
} from '~/modules/hex-utils';

import { HEX } from '~/types';

import { addOpacityToCssString, brightPink, green, violet, yellow } from '../__fixtures__';

describe('addAlphaToHex', () => {
  it.each([
    [{ input: addOpacityToCssString(brightPink.hex, 0.9), alpha: 1, expected: brightPink.hex }],
    [
      {
        input: addOpacityToCssString(brightPink.hex, 0.9),
        alpha: 0.8,
        expected: addOpacityToCssString(brightPink.hex, 0.8),
      },
    ],
    [{ input: green.hex, alpha: 2, expected: green.hex }],
    [
      {
        input: addOpacityToCssString(green.hex, 2),
        alpha: 0.9,
        expected: addOpacityToCssString(green.hex, 0.9),
      },
    ],
  ])('should return $expected with $input and $alpha', ({ input, alpha, expected }) => {
    expect(addAlphaToHex(input, alpha)).toBe(expected);
  });
});

describe('convertAlphaToHex', () => {
  it.each([
    [0, '00'],
    [0.01, '03'],
    [0.02, '05'],
    [0.03, '08'],
    [0.04, '0a'],
    [0.05, '0d'],
    [0.06, '0f'],
    [0.07, '12'],
    [0.08, '14'],
    [0.09, '17'],
    [0.1, '1a'],
    [0.11, '1c'],
    [0.12, '1f'],
    [0.13, '21'],
    [0.14, '24'],
    [0.15, '26'],
    [0.16, '29'],
    [0.17, '2b'],
    [0.18, '2e'],
    [0.19, '30'],
    [0.2, '33'],
    [0.21, '36'],
    [0.22, '38'],
    [0.23, '3b'],
    [0.24, '3d'],
    [0.25, '40'],
    [0.26, '42'],
    [0.27, '45'],
    [0.28, '47'],
    [0.29, '4a'],
    [0.3, '4d'],
    [0.31, '4f'],
    [0.32, '52'],
    [0.33, '54'],
    [0.34, '57'],
    [0.35, '59'],
    [0.36, '5c'],
    [0.37, '5e'],
    [0.38, '61'],
    [0.39, '63'],
    [0.4, '66'],
    [0.41, '69'],
    [0.42, '6b'],
    [0.43, '6e'],
    [0.44, '70'],
    [0.45, '73'],
    [0.46, '75'],
    [0.47, '78'],
    [0.48, '7a'],
    [0.49, '7d'],
    [0.5, '80'],
    [0.51, '82'],
    [0.52, '85'],
    [0.53, '87'],
    [0.54, '8a'],
    [0.55, '8c'],
    [0.56, '8f'],
    [0.57, '91'],
    [0.58, '94'],
    [0.59, '96'],
    [0.6, '99'],
    [0.61, '9c'],
    [0.62, '9e'],
    [0.63, 'a1'],
    [0.64, 'a3'],
    [0.65, 'a6'],
    [0.66, 'a8'],
    [0.67, 'ab'],
    [0.68, 'ad'],
    [0.69, 'b0'],
    [0.7, 'b3'],
    [0.71, 'b5'],
    [0.72, 'b8'],
    [0.73, 'ba'],
    [0.74, 'bd'],
    [0.75, 'bf'],
    [0.76, 'c2'],
    [0.77, 'c4'],
    [0.78, 'c7'],
    [0.79, 'c9'],
    [0.8, 'cc'],
    [0.81, 'cf'],
    [0.82, 'd1'],
    [0.83, 'd4'],
    [0.84, 'd6'],
    [0.85, 'd9'],
    [0.86, 'db'],
    [0.87, 'de'],
    [0.88, 'e0'],
    [0.89, 'e3'],
    [0.9, 'e6'],
    [0.91, 'e8'],
    [0.92, 'eb'],
    [0.93, 'ed'],
    [0.94, 'f0'],
    [0.95, 'f2'],
    [0.96, 'f5'],
    [0.97, 'f7'],
    [0.98, 'fa'],
    [0.99, 'fc'],
    [1, 'ff'],
    [90, 'e6'],
    [100, 'ff'],
  ])(`should convert %s to %s`, (input, expected) => {
    expect(convertAlphaToHex(input)).toBe(expected);
  });
});

describe('extractAlphaFromHex', () => {
  it.each([
    [addOpacityToCssString(brightPink.hex, 0), 0],
    [addOpacityToCssString(green.hex, 0.2), 0.2],
    [addOpacityToCssString(violet.hex, 0.45), 0.45],
    [addOpacityToCssString(yellow.hex, 1), 1],
  ] as Array<[HEX, number]>)(`should extract alpha from %s`, (input, expected) => {
    expect(extractAlphaFromHex(input)).toBe(expected);
  });
});

describe('hexadecimalToNumber', () => {
  it.each([
    ['00', 0],
    ['10', 16],
    ['20', 32],
    ['32', 50],
    ['64', 100],
    ['96', 150],
    ['aa', 170],
    ['cc', 204],
    ['ff', 255],
  ])(`should convert %s to %s`, (input, expected) => {
    expect(hexadecimalToNumber(input)).toBe(expected);
  });
});

describe('removeAlphaFromHex', () => {
  it.each([
    ['#f058', '#f05'],
    ['#f0a0', '#f0a'],
    ['#abcf', '#abc'],
    ['#aabbcc', '#aabbcc'],
    ['#ff0044', '#ff0044'],
    ['#aabbcc88', '#aabbcc'],
    ['#ff0044ff', '#ff0044'],
    ['#00ff0000', '#00ff00'],
  ] as Array<[string, HEX]>)('should match %s to %s', (input, expected) => {
    expect(removeAlphaFromHex(input)).toBe(expected);
  });
});
