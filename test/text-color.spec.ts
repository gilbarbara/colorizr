import { MESSAGES } from '~/modules/constants';
import textColor from '~/text-color';

describe('textColor', () => {
  it.each([
    {
      input: '#ff0044',
      expected: '#ffffff',
      options: {},
    },
    {
      input: '#9900ff',
      expected: '#ffffff',
      options: { threshold: 168 },
    },
    {
      input: '#f94fff',
      expected: '#ffffff',
      options: { threshold: 164 },
    },
    {
      input: '#07ff00',
      expected: '#000000',
      options: {},
    },
    {
      input: '#afff26',
      expected: '#333',
      options: { darkColor: '#333' },
    },
    {
      input: '#fff800',
      expected: '#000000',
      options: {},
    },
    {
      input: '#005cff',
      expected: '#ffffff',
      options: {},
    },
    {
      input: '#2a00ff',
      expected: '#91b6ff',
      options: { lightColor: '#91b6ff' },
    },
    {
      input: '#a300ff',
      expected: '#ffffff',
    },
  ])('should return $expected for $input', ({ input, expected, options }) => {
    expect(textColor(input, options)).toBe(expected);
  });

  it('should throw with invalid string', () => {
    expect(() => textColor('abcdef')).toThrow('invalid CSS string');
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - invalid parameters
    expect(() => textColor([])).toThrow(MESSAGES.inputString);
  });
});
