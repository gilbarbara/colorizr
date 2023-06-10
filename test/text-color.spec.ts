import { MESSAGES } from 'modules/utils';
import textColor from 'text-color';

describe('textColor', () => {
  it('should return the contrasted color', () => {
    // @ts-ignore
    expect(textColor('#ff0044')).toBe('#ffffff');
    expect(textColor('#07ff00')).toBe('#000000');
    expect(textColor('#fff800')).toBe('#000000');
    expect(textColor('#005cff')).toBe('#ffffff');
    expect(textColor('#a300ff')).toBe('#ffffff');
  });

  it('should fail with invalid parameters', () => {
    // @ts-ignore
    expect(() => textColor([])).toThrow(MESSAGES.inputString);
  });
});
