import random from '../src/random';
import isValidHex from '../src/is-valid-hex';

describe('random', () => {
  it('should return a valid hex', () => {
    const color = random();

    expect(isValidHex(color)).toBe(true);
  });
});
