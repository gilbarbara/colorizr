/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { type ChangeEvent, type KeyboardEvent, useCallback, useMemo, useState } from 'react';
import {
  addAlphaToHex,
  apcaContrast,
  brightnessDifference,
  chroma,
  colorDifference,
  compare,
  contrast,
  convertAlphaToHex,
  convertCSS,
  darken,
  deltaE,
  desaturate,
  extractAlphaFromHex,
  extractColorParts,
  formatCSS,
  formatHex,
  getColorType,
  getP3MaxChroma,
  getP3MaxColor,
  getScaleStepKeys,
  grayscale,
  hex2hsl,
  hex2oklab,
  hex2oklch,
  hex2rgb,
  hsl2hex,
  hsl2oklab,
  hsl2oklch,
  hsl2rgb,
  invert,
  isHex,
  isHSL,
  isLAB,
  isLCH,
  isRGB,
  isValidColor,
  lighten,
  luminance,
  mix,
  name,
  oklab2hex,
  oklab2hsl,
  oklab2oklch,
  oklab2rgb,
  oklch2hex,
  oklch2hsl,
  oklch2oklab,
  oklch2rgb,
  opacify,
  opacity,
  palette,
  parseCSS,
  random,
  readableColor,
  removeAlphaFromHex,
  rgb2hex,
  rgb2hsl,
  rgb2oklab,
  rgb2oklch,
  rotate,
  saturate,
  scale,
  scheme,
  toGamut,
  transparentize,
} from 'colorizr';

const fnMap: Record<string, Function> = {
  addAlphaToHex,
  apcaContrast,
  brightnessDifference,
  chroma,
  colorDifference,
  compare,
  contrast,
  convertAlphaToHex,
  convertCSS,
  darken,
  deltaE,
  desaturate,
  extractAlphaFromHex,
  extractColorParts,
  formatCSS,
  formatHex,
  getColorType,
  getP3MaxChroma,
  getP3MaxColor,
  getScaleStepKeys,
  grayscale,
  hex2hsl,
  hex2oklab,
  hex2oklch,
  hex2rgb,
  hsl2hex,
  hsl2oklab,
  hsl2oklch,
  hsl2rgb,
  invert,
  isHSL,
  isHex,
  isLAB,
  isLCH,
  isRGB,
  isValidColor,
  lighten,
  luminance,
  mix,
  name,
  oklab2hex,
  oklab2hsl,
  oklab2oklch,
  oklab2rgb,
  oklch2hex,
  oklch2hsl,
  oklch2oklab,
  oklch2rgb,
  opacify,
  opacity,
  palette,
  parseCSS,
  random,
  readableColor,
  removeAlphaFromHex,
  rgb2hex,
  rgb2hsl,
  rgb2oklab,
  rgb2oklch,
  rotate,
  saturate,
  scale,
  scheme,
  toGamut,
  transparentize,
};

export type ResultType = 'color' | 'colorArray' | 'colorScale' | 'value';

export interface DisplayValue {
  color: string;
  colors: string[] | Record<string | number, string>;
  inputColors: string[];
  name: string;
  resultType: ResultType;
  text: string;
  value: unknown;
}

function getDisplayValue(result: { args: unknown[]; name: string; value: unknown }): DisplayValue {
  const { args, name: fnName, value } = result;
  const inputColors = getInputColors(fnName, args);
  const base = { inputColors, name: fnName };

  if (isColorString(value)) {
    return { ...base, color: value, colors: [], resultType: 'color', text: value, value };
  }

  if (Array.isArray(value) && value.length > 0 && value.every(isColorString)) {
    const inputColor = inputColors[0] ?? value[0];

    return {
      ...base,
      color: inputColor,
      colors: value,
      resultType: 'colorArray',
      text: JSON.stringify(value),
      value,
    };
  }

  if (isHSL(value) || isRGB(value) || isLAB(value) || isLCH(value)) {
    const color = formatCSS(value);

    return {
      ...base,
      color,
      colors: [],
      resultType: 'color',
      text: JSON.stringify(value),
      value,
    };
  }

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const record = value as Record<string, unknown>;
    const entries = Object.entries(record);
    const allColors = entries.length > 0 && entries.every(([, v]) => isColorString(v));

    if (allColors) {
      const inputColor = inputColors[0] ?? (entries[0][1] as string);

      return {
        ...base,
        color: inputColor,
        colors: record as Record<string, string>,
        resultType: 'colorScale',
        text: JSON.stringify(value),
        value,
      };
    }

    return {
      ...base,
      color: '',
      colors: [],
      resultType: 'value',
      text: JSON.stringify(value),
      value,
    };
  }

  return {
    ...base,
    color: '',
    colors: [],
    resultType: 'value',
    text: Array.isArray(value) ? JSON.stringify(value) : String(value),
    value,
  };
}

function getInputColors(fnName: string, arguments_: unknown[]): string[] {
  if (fnName.includes('2')) {
    const [value] = arguments_;

    if (isHSL(value) || isRGB(value) || isLAB(value) || isLCH(value)) {
      const color = formatCSS(value);

      return [color];
    }
  }

  return arguments_
    .filter(isColorString)
    .map(c => (!c.startsWith('#') && isHex(`#${c}`) ? `#${c}` : c));
}

function isColorString(value: unknown): value is string {
  if (typeof value !== 'string') {
    return false;
  }

  return (
    isHex(`#${value}`) ||
    value.startsWith('#') ||
    value.startsWith('rgb(') ||
    value.startsWith('hsl(') ||
    value.startsWith('oklab(') ||
    value.startsWith('oklch(')
  );
}

function normalizeToJSON(input: string): string {
  let result = input.replace(/'/g, '"');

  result = result.replace(/([,{])\s*(\w+)\s*:/g, '$1 "$2":');

  return result;
}

function parseArguments(argumentsString: string): unknown[] {
  const normalized = normalizeToJSON(argumentsString);

  return JSON.parse(`[${normalized}]`);
}

function parseExpression(code: string): { args: unknown[]; fn: Function; name: string } | null {
  const match = code.match(/^(\w+)\(([\S\s]*)\)$/);

  if (!match) {
    return null;
  }

  const [, fnName, argumentsString] = match;
  const fn = fnMap[fnName];

  if (!fn) {
    return null;
  }

  const arguments_ = parseArguments(argumentsString.trim());

  return { fn, args: arguments_, name: fnName };
}

export default function useLiveExample(initialCode: string) {
  const [code, setCode] = useState(initialCode);
  const [lastDisplay, setLastDisplay] = useState<DisplayValue | null>(null);
  const [showError, setShowError] = useState(false);

  const result = useMemo(() => {
    try {
      const parsed = parseExpression(code.trim());

      if (!parsed) {
        return { ok: false as const, error: 'Invalid expression' };
      }

      const value = parsed.fn(...parsed.args);

      return { ok: true as const, args: parsed.args, name: parsed.name, value };
    } catch (error) {
      return { ok: false as const, error: error instanceof Error ? error.message : 'Error' };
    }
  }, [code]);
  const display = result.ok ? getDisplayValue(result) : null;

  if (display && display.text !== lastDisplay?.text) {
    setLastDisplay(display);
    setShowError(false);
  }

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value);
    setShowError(false);
  }, []);

  const handleCommit = useCallback(() => {
    if (!result.ok) {
      setShowError(true);
    }
  }, [result]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        handleCommit();
      }
    },
    [handleCommit],
  );

  const shown = display ?? lastDisplay;
  const hasError = !result.ok && showError;

  return {
    code,
    display: shown,
    error: !result.ok ? result.error : undefined,
    handleChange,
    handleCommit,
    handleKeyDown,
    hasError,
  };
}
