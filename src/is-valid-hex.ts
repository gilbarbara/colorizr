import { isString } from './modules/utils';

export default function isValidHex(input: any, alpha = true): boolean {
  if (!isString(input)) {
    return false;
  }

  if (alpha) {
    return /^#([\da-f]{3,4}|[\da-f]{6,8})$/i.test(input);
  }

  return /^#([\da-f]{3}|[\da-f]{6})$/i.test(input);
}
