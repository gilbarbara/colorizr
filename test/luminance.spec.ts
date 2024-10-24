import { MESSAGES } from '~/modules/constants';

import luminance from '~/luminance';

describe('luminance', () => {
  it.each([
    ['#ff0044', 0.2168],
    ['#24d3d3', 0.5167],
    ['#005cff', 0.1487],
    ['#fff', 1],
    ['#000', 0],
  ])('%s should return %s', (input, expected) => {
    expect(luminance(input)).toBe(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-expect-error - input is required
    expect(() => luminance()).toThrow(MESSAGES.inputString);
  });
});
