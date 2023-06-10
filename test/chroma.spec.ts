import chroma from 'chroma';
import { MESSAGES } from 'modules/utils';

describe('chroma', () => {
  it.each([
    ['#ff0044', 1],
    ['rgb(255, 0, 68)', 1],
    ['hsl(344, 100, 50)', 1],
    ['#ffc0cb', 0.2471],
    ['hsl(0, 0, 100)', 0],
    ['rgba(0, 0, 0, 0.5)', 0],
    ['aliceblue', 0.0588],
    ['LightCoral', 0.4392],
  ])('%p should return %p', (input, expected) => {
    expect(chroma(input)).toBe(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-ignore
    expect(() => chroma([])).toThrow(MESSAGES.inputString);
  });
});
