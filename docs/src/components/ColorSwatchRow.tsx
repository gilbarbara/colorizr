import ColorSwatch from './ColorSwatch';

interface ColorSwatchRowProps {
  colors: string[] | Record<string | number, string>;
  variant?: 'default' | 'scale';
}

export default function ColorSwatchRow({ colors, variant = 'default' }: ColorSwatchRowProps) {
  const entries = Array.isArray(colors)
    ? colors.map((c, index) => [String(index), c] as const)
    : Object.entries(colors);

  return (
    <div className={`swatch-row not-content${variant === 'scale' ? ' swatch-row--scale' : ''}`}>
      {entries.map(([key, color]) => (
        <ColorSwatch key={key} color={color} label={variant === 'scale' ? key : undefined} />
      ))}
    </div>
  );
}
