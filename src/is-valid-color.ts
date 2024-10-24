import parseCSS from '~/parse-css';

export default function isValidColor(input: string): boolean {
  try {
    parseCSS(input);

    return true;
  } catch {
    return false;
  }
}
