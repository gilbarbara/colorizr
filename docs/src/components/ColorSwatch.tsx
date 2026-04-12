import { useCallback, useState } from 'react';

import Tooltip from './Tooltip';

interface ColorSwatchProps {
  color: string;
  label?: string;
  size?: number;
  value?: unknown;
}

export default function ColorSwatch(props: ColorSwatchProps) {
  const { color, label, size = 48, value } = props;
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(value ? JSON.stringify(value, null, 2) : color);

    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }, [color, value]);

  return (
    <Tooltip content={copied ? 'Copied!' : color}>
      <div className="color-swatch not-content">
        <button
          className="color-swatch__button"
          onClick={handleCopy}
          style={{ height: size, width: size }}
        >
          {color && <span style={{ backgroundColor: color }} />}
        </button>
        {!!label && <span className="color-swatch__label">{label}</span>}
      </div>
    </Tooltip>
  );
}
