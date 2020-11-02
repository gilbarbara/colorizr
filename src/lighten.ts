import updater from './updater';

/**
 * Increase color lightness
 */
export default function lighten(input: string, amount = 10): string {
  return updater('l', '+')(input, amount);
}
