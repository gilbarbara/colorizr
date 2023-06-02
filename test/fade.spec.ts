import fade from 'fade';
import { messages } from 'modules/utils';
import { ColorTypes } from 'types';

describe('fade', () => {
  it.each([
    ['black', 10, 'rgba(0, 0, 0, 0.9)', 'rgb'],
    ['hsl(344, 100, 50)', 10, 'rgba(255, 0, 68, 0.9)', 'rgb'],
    ['#ff0044', 10, 'hsla(344, 100%, 50%, 0.9)', 'hsl'],
    ['rgb(255, 0, 68)', 50, 'hsla(344, 100%, 50%, 0.5)', 'hsl'],
    ['#ff0044', 10, '#ff0044e6', 'hex'],
    ['hsl(344, 100, 50)', 50, '#ff004480', 'hex'],
  ])('%p with %p should return %p', (input, amount, expected, output) => {
    expect(fade(input, amount, output as ColorTypes)).toBe(expected);
  });

  it('should fail with invalid parameters', () => {
    // @ts-ignore
    expect(() => fade([])).toThrow(messages.inputString);
    // @ts-ignore
    expect(() => fade('', {})).toThrow(messages.amount);
  });
});
