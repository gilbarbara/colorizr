import parseCSS from './parse-css';

export default function isValidColor(input: any): boolean {
  try {
    parseCSS(input);

    return true;
  } catch {
    return false;
  }
}
