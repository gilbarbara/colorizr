import rotate from '../src/rotate';
import { messages } from '../src/utils';

describe('rotate', () => {
  it('should have changed the color', () => {
    expect(rotate('#ff0044')).toBe('#ff0004');
    expect(rotate('#ff0044', 30)).toBe('#ff3b00');
    expect(rotate('#ff0044', 90)).toEqual('#c4ff00');
    expect(rotate('#ff0044', 180)).toEqual('#00ffbb');
    expect(rotate('#ff0044', 360)).toEqual('#ff0044');
  });

  it('should fail with invalid parameters', () => {
    // @ts-ignore
    expect(() => rotate({})).toThrow(messages.inputString);
    // @ts-ignore
    expect(() => rotate('#f04', [])).toThrow('degrees must be a number');
  });
});
