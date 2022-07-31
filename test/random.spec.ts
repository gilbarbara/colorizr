import isValidHex from 'is-valid-hex';
import random from 'random';

describe('random', () => {
  it('should return a valid hex', () => {
    const color = random();

    expect(isValidHex(color)).toBe(true);
  });
});
