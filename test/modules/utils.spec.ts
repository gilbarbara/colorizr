import { clamp, constrainDegrees, parseInput, restrictValues, round } from '~/modules/utils';

import { brightPink, green, orange, violet, yellow } from '../__fixtures__';

describe('clamp', () => {
  it.each([
    { input: 50, expected: 50 },
    { input: 50, max: 40, expected: 40 },
    { input: 50, min: 60, expected: 60 },
  ])('should clamp $input to $expected', ({ input, min, max, expected }) => {
    expect(clamp(input, min, max)).toBe(expected);
  });
});

describe('constrainDegrees', () => {
  it('should constrain degrees', () => {
    expect(constrainDegrees(350, 29)).toBe(19);
    expect(constrainDegrees(20, -80)).toBe(300);
    expect(constrainDegrees(20, 429)).toBe(89);
  });
});

describe('parseInput', () => {
  it.each<{
    expected: ReturnType<typeof parseInput>;
    input: Parameters<typeof parseInput>[0];
    model: Parameters<typeof parseInput>[1];
  }>([
    {
      input: { h: 344, s: 100, l: 50 },
      model: 'hsl',
      expected: { h: 344, s: 100, l: 50 },
    },
    {
      input: [344, 100, 50],
      model: 'hsl',
      expected: { h: 344, s: 100, l: 50 },
    },
    {
      input: { r: 255, g: 0, b: 68 },
      model: 'rgb',
      expected: { r: 255, g: 0, b: 68 },
    },
    {
      input: [255, 0, 68],
      model: 'rgb',
      expected: { r: 255, g: 0, b: 68 },
    },
  ])(`should parse input`, ({ input, model, expected }) => {
    expect(parseInput(input, model)).toEqual(expected);
  });
});

describe('restrictValues', () => {
  it('should return input unchanged when precision is undefined', () => {
    expect(restrictValues(brightPink.oklabLong)).toEqual(brightPink.oklabLong);
  });

  it.each([
    { input: brightPink.oklabLong, expected: brightPink.oklab },
    { input: brightPink.oklchLong, expected: brightPink.oklch },
    { input: green.oklabLong, expected: green.oklab },
    { input: green.oklchLong, expected: green.oklch },
    { input: orange.oklabLong, expected: orange.oklab },
    { input: orange.oklchLong, expected: orange.oklch },
    { input: violet.oklabLong, expected: violet.oklab },
    { input: violet.oklchLong, expected: violet.oklch },
    { input: yellow.oklabLong, expected: yellow.oklab },
    { input: yellow.oklchLong, expected: yellow.oklch },
  ])(`should restrict $input with precision 5`, ({ input, expected }) => {
    expect(restrictValues(input, 5)).toEqual(expected);
  });
});

describe('round', () => {
  it.each([
    { input: 100.291, precision: 2, force: false, expected: 100 },
    { input: 46.11008, precision: 5, force: true, expected: 46.11008 },
    { input: 46.11008, precision: 5, force: false, expected: 46.11 },
    { input: -0.22518224932102743, precision: 5, expected: -0.22518 },
    { input: -0.22518224932102743, precision: 5, force: false, expected: -0.22518 },
    { input: 1.21792011, precision: 2, expected: 1.22 },
    { input: 1.22, precision: 0, force: false, expected: 0 },
    { input: 1.22, precision: 1, force: false, expected: 1 },
    { input: 1.22, precision: 2, force: false, expected: 1.2 },
    { input: 1.22, precision: 3, force: false, expected: 1.22 },
    { input: 1.22, precision: 4, force: false, expected: 1.22 },
    { input: 1.22, precision: 5, force: false, expected: 1.22 },
    { input: 1.21298011, precision: 5, force: false, expected: 1.213 },
    { input: 1.21298011, precision: 5, force: true, expected: 1.21298 },
  ])(
    `should round $input with $precision to $expected`,
    ({ input, precision, force, expected }) => {
      expect(round(input, precision, force)).toBe(expected);
    },
  );
});
