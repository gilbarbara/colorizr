import { messages } from 'modules/utils';
import palette from 'palette';

describe('palette', () => {
  it.each([
    ['#ff0044', undefined],
    ['#ff0044', { type: 'monochromatic' }],
    ['#ff0044', { lightness: 90, size: 10 }],
    ['#ff0044', { saturation: 70, size: 5 }],
    ['blue', undefined],
  ])('%p with %p should return the palette', (input, options) => {
    expect(palette(input, options)).toMatchSnapshot();
  });

  it('should fail with invalid parameters', () => {
    // @ts-ignore
    expect(() => palette([])).toThrow(messages.inputString);
    // @ts-ignore
    expect(() => palette('#f04', [])).toThrow('invalid options');
  });
});
