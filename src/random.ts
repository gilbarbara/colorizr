import hsl2hex from './hsl2hex';

/**
 * Generate a random color.
 */
export default function random(): string {
  const hsl = {
    h: Math.floor(Math.random() * 360) + 1,
    s: Math.floor(Math.random() * 90) + 10,
    l: Math.floor(Math.random() * 80) + 10,
  };

  return hsl2hex(hsl);
}
