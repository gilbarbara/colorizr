import updater from './updater';

/**
 * Decrease color lightness
 */
export default function darken(input: string, amount = 10): string {
  return updater('l', '-')(input, amount);
}
