import scheme from 'scheme';

import { Scheme } from 'types';

describe('scheme', () => {
  it.each([
    [undefined, '#ff0044', ['#ff0044', '#00ffbb']],
    ['complementary', 'rgb(255, 0, 68)', ['#ff0044', '#00ffbb']],
    ['analogous', 'hsl(344, 100, 50)', ['#ff00c4', '#ff0044', '#ff3b00']],
    ['split', '#ff0044', ['#ff0044', '#00ff3b', '#00c4ff']],
    ['split-complementary', '#ff0044', ['#ff0044', '#00ff3b', '#00c4ff']],
    ['triadic', '#ff0044', ['#ff0044', '#44ff00', '#0044ff']],
    ['tetradic', '#ff0044', ['#ff0044', '#ffbb00', '#00ffbb', '#0044ff']],
    ['rectangle', '#ff0044', ['#ff0044', '#ffbb00', '#00ffbb', '#0044ff']],
    ['square', '#ff0044', ['#ff0044', '#c4ff00', '#00ffbb', '#3b00ff']],
    ['complementary', 'AliceBlue', ['#f0f8ff', '#fff7f0']],
  ] as [Scheme, string, string[]][])(
    'should return the correct value with %p',
    (type, input, expected) => {
      expect(scheme(input, type)).toEqual(expected);
    },
  );

  it('should fail with invalid parameters', () => {
    // @ts-ignore
    expect(() => scheme('#f04', 'invalidType')).toThrow('invalid type');
  });
});
