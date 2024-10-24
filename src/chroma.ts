import { MESSAGES } from '~/modules/constants';
import { invariant } from '~/modules/invariant';
import { round } from '~/modules/utils';
import { isString } from '~/modules/validators';

import parseCSS from '~/parse-css';

/**
 * Get the chroma of a color.
 */
export default function chroma(input: string): number {
  invariant(isString(input), MESSAGES.inputString);

  const { r, g, b } = parseCSS(input, 'rgb');

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  return round((max - min) / 255, 4);
}
