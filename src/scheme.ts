import parseCSS from './parse-css';
import rotate from './rotate';
import { invariant, isString, messages } from './utils';

import { Scheme } from './types';

/**
 * Get the scheme scheme for a color.
 */
export default function scheme(input: string, type: Scheme = 'complementary'): string[] {
  invariant(!isString(input), messages.inputString);

  const hex = parseCSS(input);
  const output: string[] = [];

  switch (type) {
    case 'analogous': {
      output.push(rotate(hex, -30));
      output.push(hex);
      output.push(rotate(hex, 30));
      break;
    }
    case 'complementary': {
      output.push(hex);
      output.push(rotate(hex, 180));
      break;
    }
    case 'split':
    case 'split-complementary': {
      output.push(hex);
      output.push(rotate(hex, 150));
      output.push(rotate(hex, 210));
      break;
    }
    case 'triadic': {
      output.push(hex);
      output.push(rotate(hex, 120));
      output.push(rotate(hex, 240));
      break;
    }
    case 'tetradic':
    case 'rectangle': {
      output.push(hex);
      output.push(rotate(hex, 60));
      output.push(rotate(hex, 180));
      output.push(rotate(hex, 240));
      break;
    }
    case 'square': {
      output.push(hex);
      output.push(rotate(hex, 90));
      output.push(rotate(hex, 180));
      output.push(rotate(hex, 270));
      break;
    }
    default: {
      throw new TypeError('invalid type');
    }
  }

  return output;
}
