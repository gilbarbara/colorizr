import { MESSAGES } from '~/modules/constants';
import readableColorAPCA from '~/readable-color-apca';

describe('readableColorAPCA', () => {
  describe('basic functionality', () => {
    it.each([
      { bg: '#ffffff', expected: '#000000' }, // white -> dark text
      { bg: '#000000', expected: '#ffffff' }, // black -> light text
      { bg: '#888888', expected: '#ffffff' }, // gray -> light text (APCA favors light text on mid-grays)
      { bg: '#ffff00', expected: '#000000' }, // yellow -> dark text
      { bg: '#0000ff', expected: '#ffffff' }, // blue -> light text
    ])('should return $expected for background $bg', ({ bg, expected }) => {
      expect(readableColorAPCA(bg)).toBe(expected);
    });
  });

  describe('custom colors', () => {
    it('should use custom dark color', () => {
      expect(readableColorAPCA('#fff', { darkColor: '#111' })).toBe('#111');
    });

    it('should use custom light color', () => {
      expect(readableColorAPCA('#000', { lightColor: '#eee' })).toBe('#eee');
    });

    it('should use both custom colors', () => {
      const result = readableColorAPCA('#808080', { darkColor: '#222', lightColor: '#ddd' });

      expect(['#222', '#ddd']).toContain(result);
    });
  });

  describe('CSS color format support', () => {
    it('should handle various CSS color formats', () => {
      expect(readableColorAPCA('rgb(255, 255, 255)')).toBe('#000000');
      expect(readableColorAPCA('hsl(0, 0%, 0%)')).toBe('#ffffff');
      expect(readableColorAPCA('white')).toBe('#000000');
      expect(readableColorAPCA('black')).toBe('#ffffff');
    });
  });

  describe('error handling', () => {
    it('should throw with invalid input', () => {
      // @ts-expect-error - invalid parameters
      expect(() => readableColorAPCA(123)).toThrow(MESSAGES.inputString);
    });

    it('should throw with invalid color string', () => {
      expect(() => readableColorAPCA('notacolor')).toThrow('invalid CSS string');
    });
  });

  describe('consistency with readableColor method: apca', () => {
    it('should produce same results as readableColor with method: apca', async () => {
      const { default: readableColor } = await import('~/readable-color');

      const testColors = ['#fff', '#000', '#888', '#f00', '#0f0', '#00f'];

      for (const color of testColors) {
        expect(readableColorAPCA(color)).toBe(readableColor(color, { method: 'apca' }));
      }
    });
  });
});
