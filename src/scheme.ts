import { invariant, isString, messages } from './modules/utils';
import parseCSS from './parse-css';
import rotate from './rotate';
import { Scheme } from './types';

/**
 * Get the scheme for a color.
 */
export default function scheme(input: string, type: Scheme = 'complementary'): string[] {
  invariant(isString(input), messages.inputString);

  const hex = parseCSS(input);
  const output: string[] = [];

  switch (type) {
    case 'analogous': {
      output.push(rotate(hex, -30), hex, rotate(hex, 30));
      break;
    }
    case 'complementary': {
      output.push(hex, rotate(hex, 180));
      break;
    }

    case 'split':
    case 'split-complementary': {
      output.push(hex, rotate(hex, 150), rotate(hex, 210));
      break;
    }
    case 'triadic': {
      output.push(hex, rotate(hex, 120), rotate(hex, 240));
      break;
    }

    case 'tetradic':
    case 'rectangle': {
      output.push(hex, rotate(hex, 60), rotate(hex, 180), rotate(hex, 240));
      break;
    }
    case 'square': {
      output.push(hex, rotate(hex, 90), rotate(hex, 180), rotate(hex, 270));
      break;
    }
    default: {
      throw new TypeError('invalid type');
    }
  }

  return output;
}
