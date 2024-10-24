import { isHex } from '~/modules/validators';

import isValidColor from '~/is-valid-color';
import random from '~/random';
import { ColorType } from '~/types';

describe('random', () => {
  it.each(['hex', 'hsl', 'oklab', 'oklch', 'rgb'] as Array<ColorType>)(
    'should return a valid %s color',
    type => {
      const color = random(type);

      expect(type === 'hex' ? isHex(color) : isValidColor(color)).toBe(true);
    },
  );
});
