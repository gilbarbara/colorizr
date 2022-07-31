import parseCSS from 'parse-css';

import { messages } from 'modules/utils';

import { ColorTypes } from 'types';

describe('parseCSS', () => {
  describe.each([['hex'], ['hsl'], ['rgb']] as ColorTypes[][])('with output %p', type => {
    it.each([
      ['#ff0044'],
      ['AliceBlue'],
      ['greenyellow'],
      ['rgb(255, 255, 0)'],
      ['rgba(255, 127, 12, 0.5)'],
      ['hsl(255,80%,20%)'],
      ['hsla(126,     57%,  62%,0.5)'],
      ['hsl(270 60% 70%)'],
      ['hsl(270 60%, 70% / .15)'],
    ])('%p should return properly', input => {
      expect(parseCSS(input, type)).toMatchSnapshot();
    });
  });

  it('should fail with invalid parameters', () => {
    // @ts-ignore
    expect(() => parseCSS([25, 56, 84])).toThrow(messages.inputString);
    // @ts-ignore
    expect(() => parseCSS({ h: 25, s: 56, l: 84 })).toThrow(messages.inputString);
    // @ts-ignore
    expect(() => parseCSS()).toThrow(messages.inputString);
    expect(() => parseCSS('rgb(255, 255)')).toThrow('invalid CSS string');
    expect(() => parseCSS('rgs(255, 255, 0)')).toThrow('invalid CSS string');
    expect(() => parseCSS('AliceGreen')).toThrow('invalid CSS string');
    expect(() => parseCSS('green-ish')).toThrow('invalid CSS string');
  });
});
