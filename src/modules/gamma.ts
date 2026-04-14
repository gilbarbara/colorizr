export function srgbGammaDecode(input: number): number {
  const abs = Math.abs(input);

  if (abs < 0.04045) {
    return input / 12.92;
  }

  return (Math.sign(input) || 1) * ((abs + 0.055) / 1.055) ** 2.4;
}

export function srgbGammaEncode(input: number): number {
  const abs = Math.abs(input);
  const sign = input < 0 ? -1 : 1;

  if (abs > 0.0031308) {
    return sign * (abs ** (1 / 2.4) * 1.055 - 0.055);
  }

  return input * 12.92;
}
