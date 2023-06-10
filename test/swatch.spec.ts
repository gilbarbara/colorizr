import { MESSAGES } from 'modules/utils';
import swatch from 'swatch';

describe('swatch', () => {
  it.each([
    ['#ff0044', undefined],
    ['hsl(344, 100%, 50%) ', 'up' as const],
    ['rgb(255, 0, 68)', 'down' as const],
  ])('%p with %p should return the palette', (input, variant) => {
    expect(swatch(input, variant)).toMatchSnapshot();
  });

  it('should fail with invalid parameters', () => {
    // @ts-ignore
    expect(() => swatch(undefined)).toThrow(MESSAGES.inputString);
  });
});
