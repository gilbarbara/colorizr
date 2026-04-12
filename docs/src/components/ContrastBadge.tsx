type APCALevel = 'body' | 'large' | 'non-text';
type WCAGLevel = 'AA' | 'AAA';

interface ContrastBadgeProps {
  level: WCAGLevel | APCALevel;
  ratio: number;
  size?: 'normal' | 'large';
}

const wcagThresholds: Record<string, number> = {
  'AA-normal': 4.5,
  'AA-large': 3,
  'AAA-normal': 7,
  'AAA-large': 4.5,
};

const apcaThresholds: Record<APCALevel, number> = {
  body: 60,
  large: 45,
  'non-text': 30,
};

const apcaLabels: Record<APCALevel, string> = {
  body: 'Body',
  large: 'Large',
  'non-text': 'Non-text',
};

function isAPCA(level: string): level is APCALevel {
  return level in apcaThresholds;
}

export default function ContrastBadge({ level, ratio, size = 'normal' }: ContrastBadgeProps) {
  if (isAPCA(level)) {
    const absRatio = Math.abs(ratio);
    const pass = absRatio >= apcaThresholds[level];

    return (
      <span className={`contrast-badge not-content contrast-badge--${pass ? 'pass' : 'fail'}`}>
        {pass ? '\u2713' : '\u2717'} {apcaLabels[level]}: {absRatio.toFixed(1)} Lc
      </span>
    );
  }

  const threshold = wcagThresholds[`${level}-${size}`];
  const pass = ratio >= threshold;

  return (
    <span className={`contrast-badge not-content contrast-badge--${pass ? 'pass' : 'fail'}`}>
      {pass ? '\u2713' : '\u2717'} {level}
      {size === 'large' ? ' Large' : ''}: {ratio.toFixed(2)}:1
    </span>
  );
}
