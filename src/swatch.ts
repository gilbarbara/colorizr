import hex2hsl from './converters/hex2hsl';
import hsl2hex from './converters/hsl2hex';
import desaturate from './desaturate';
import { constrainDegrees, invariant, isString, messages } from './modules/utils';
import parseCSS from './parse-css';
import saturate from './saturate';

const HUE_MAP = [0, 4, 8, 12, 16, 20, 24, 28, 32, 36];
const LIGHTNESS_MAP = [90, 80, 70, 60, 50, 40, 30, 20, 10, 5];
const SATURATION_MAP = [32, 16, 8, 4, 0, 0, 4, 8, 16, 32];

export default function swatch(input: string, variant?: 'up' | 'down'): string[] {
  invariant(isString(input), messages.inputString);
  const hsl = parseCSS(input, 'hsl');

  const lightnessGoal = hsl.l;
  const closestLightness = LIGHTNESS_MAP.reduce((previous, current) =>
    Math.abs(current - lightnessGoal) < Math.abs(previous - lightnessGoal) ? current : previous,
  );
  const baseColorIndex = LIGHTNESS_MAP.findIndex(l => l === closestLightness);

  const colors = LIGHTNESS_MAP.map(l => hsl2hex({ ...hsl, l })).map((color, index) => {
    const saturationDelta = SATURATION_MAP[index] - SATURATION_MAP[baseColorIndex];

    return saturationDelta >= 0
      ? saturate(color, saturationDelta)
      : desaturate(color, saturationDelta * -1);
  });

  if (variant === 'up') {
    return colors.map((color, index) => {
      const hueDelta = HUE_MAP[index] - HUE_MAP[baseColorIndex];
      const nextColor = hex2hsl(color);

      return hueDelta >= 0
        ? hsl2hex({ ...nextColor, h: constrainDegrees(nextColor.h, hueDelta) })
        : hsl2hex({
            ...nextColor,
            h: constrainDegrees(nextColor.h, (hueDelta * -1) / 2),
          });
    });
  }

  if (variant === 'down') {
    return colors.map((color, index) => {
      const hueDelta = HUE_MAP[index] - HUE_MAP[baseColorIndex];
      const nextColor = hex2hsl(color);

      return hueDelta >= 0
        ? hsl2hex({ ...nextColor, h: constrainDegrees(nextColor.h, -hueDelta) })
        : hsl2hex({
            ...nextColor,
            h: constrainDegrees(nextColor.h, -((hueDelta * -1) / 2)),
          });
    });
  }

  return colors;
}
