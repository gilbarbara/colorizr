import updater from './modules/updater';

/**
 * Decrease color saturation
 */
export default function desaturate(input: string, amount = 10): string {
  return updater('s', '-')(input, amount);
}
