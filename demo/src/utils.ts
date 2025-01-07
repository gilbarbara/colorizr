export interface ContrastProps {
  contrast: number;
  largeText: number;
  normalText: number;
}

export function getContrastBgColor({ contrast }: ContrastProps) {
  let backgroundColor = '#fbd0da';

  if (contrast >= 7) {
    backgroundColor = '#d2fbd0';
  } else if (contrast >= 4.5) {
    backgroundColor = '#f5f5d0';
  }

  return backgroundColor;
}

export function getKey(value: string, index: number) {
  return `${value}-${index}`;
}

export function getTextBgColor(type: 'normal' | 'large') {
  return ({ largeText, normalText }: ContrastProps) => {
    let backgroundColor = '#fbd0da';

    if (type === 'normal' ? normalText === 2 : largeText === 2) {
      backgroundColor = '#d2fbd0';
    } else if (type === 'normal' ? normalText === 1 : largeText === 1) {
      backgroundColor = '#f5f5d0';
    }

    return backgroundColor;
  };
}
