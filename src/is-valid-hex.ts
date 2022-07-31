import { isString } from './modules/utils';

export default function isValidHex(input: any): boolean {
  if (!isString(input)) {
    return false;
  }

  return /^#([\da-f]{3,4}|[\da-f]{6,8})$/i.test(input);
}
