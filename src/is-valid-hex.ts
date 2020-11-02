import { isString } from './utils';

export default function isValidHex(input: any): boolean {
  if (!isString(input)) {
    return false;
  }

  return /^#([0-9A-F]{3,4}|[0-9A-F]{6,8})$/i.test(input);
}
