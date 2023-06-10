import compare from 'compare';
import { MESSAGES } from 'modules/utils';

describe('compare', () => {
  it.each([
    ['#ff0044', '#dd00ff'],
    ['#ff0044', '#00ffbb'],
    ['#ff0044', '#fff'],
    ['#ff0044', '#000'],
    ['#fff', '#777'],
    ['#000', '#fff'],
  ])('%p with %p should return an analysis', (left, right) => {
    expect(compare(left, right)).toMatchSnapshot();
  });

  it('should fail with invalid parameters', () => {
    // @ts-ignore
    expect(() => compare()).toThrow(MESSAGES.left);
    // @ts-ignore
    expect(() => compare([])).toThrow(MESSAGES.left);
    // @ts-ignore
    expect(() => compare('', [])).toThrow(MESSAGES.right);
  });
});
