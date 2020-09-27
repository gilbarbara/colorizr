import updater from './updater';

/**
 * Increase color saturation
 */
export default function saturate(input: string, amount = 10): string {
  return updater('s', '+')(input, amount);
}
