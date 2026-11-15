import { MESSAGES } from '~/modules/constants';
import name from '~/name';

describe('name', () => {
  it.each([
    { input: '#ccc', expected: '#ccc' },
    { input: '#ff0044', expected: '#ff0044' },
    { input: 'rgb(255, 0, 68)', expected: '#ff0044' },
    { input: 'hsl(344, 100, 50)', expected: '#ff0044' },
    { input: '#ffc0cb', expected: 'pink' },
    { input: 'rgb(176, 224, 230)', expected: 'powderblue' },
    { input: '#ff000080', expected: '#ff000080' },
    { input: 'rgb(255 0 0 / 50%)', expected: '#ff000080' },
    { input: '#00000000', expected: 'transparent' },
  ])('$input should return $expected', ({ input, expected }) => {
    expect(name(input)).toBe(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - invalid parameters
    expect(() => name([])).toThrow(MESSAGES.inputString);
  });
});
