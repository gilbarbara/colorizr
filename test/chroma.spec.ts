import chroma from '~/chroma';
import { MESSAGES } from '~/modules/constants';

import { brightPink } from './__fixtures__';

describe('chroma', () => {
  it.each([
    { input: brightPink.hex, expected: 1 },
    { input: brightPink.rgbString, expected: 1 },
    { input: 'hsl(344, 100, 50)', expected: 1 },
    { input: '#ffc0cb', expected: 0.2471 },
    { input: 'hsl(0, 0, 100)', expected: 0 },
    { input: 'rgba(0, 0, 0, 0.5)', expected: 0 },
    { input: 'aliceblue', expected: 0.0588 },
    { input: 'LightCoral', expected: 0.4392 },
  ])('$input should return $expected', ({ input, expected }) => {
    expect(chroma(input)).toBe(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - invalid parameters
    expect(() => chroma([])).toThrow(MESSAGES.inputString);
  });
});
