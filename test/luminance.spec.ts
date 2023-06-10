import luminance from 'luminance';
import { MESSAGES } from 'modules/utils';

describe('luminance', () => {
  it.each([
    ['#ff0044', 0.2168],
    ['#24d3d3', 0.5167],
    ['#005cff', 0.1487],
    ['#fff', 1],
    ['#000', 0],
  ])('%p should return %p', (input, expected) => {
    expect(luminance(input)).toBe(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-ignore
    expect(() => luminance()).toThrow(MESSAGES.inputString);
  });
});
