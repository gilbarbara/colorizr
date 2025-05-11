import chroma from '~/chroma';
import { MESSAGES } from '~/modules/constants';

import { brightPink } from './__fixtures__';

describe('chroma', () => {
  it.each([
    [brightPink.hex, 1],
    [brightPink.rgbString, 1],
    ['hsl(344, 100, 50)', 1],
    ['#ffc0cb', 0.2471],
    ['hsl(0, 0, 100)', 0],
    ['rgba(0, 0, 0, 0.5)', 0],
    ['aliceblue', 0.0588],
    ['LightCoral', 0.4392],
  ])('%s should return %s', (input, expected) => {
    expect(chroma(input)).toBe(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - invalid parameters
    expect(() => chroma([])).toThrow(MESSAGES.inputString);
  });
});
