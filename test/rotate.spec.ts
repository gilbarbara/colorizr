import { messages } from 'modules/utils';
import rotate from 'rotate';

describe('rotate', () => {
  it('should have changed the color', () => {
    expect(rotate('#ff0044')).toBe('#ff0004');
    expect(rotate('#ff0044', 30)).toBe('#ff3b00');
    expect(rotate('#ff0044', 90)).toBe('#c4ff00');
    expect(rotate('#ff0044', 180)).toBe('#00ffbb');
    expect(rotate('#ff0044', 360)).toBe('#ff0044');
  });

  it('should fail with invalid parameters', () => {
    // @ts-ignore
    expect(() => rotate({})).toThrow(messages.inputString);
    // @ts-ignore
    expect(() => rotate('#f04', [])).toThrow('degrees must be a number');
  });
});
