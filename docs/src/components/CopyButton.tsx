import { useCallback, useState } from 'react';

import CopyIcon from './CopyIcon';
import Tooltip from './Tooltip';

interface CopyButtonProps {
  showText?: boolean;
  text: string;
}

export default function CopyButton(props: CopyButtonProps) {
  const { showText, text } = props;
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);

    setCopied(true);
    setTimeout(() => setCopied(false), 4500);
  }, [text]);

  return (
    <div className="copy-button">
      <Tooltip content={copied ? 'Copied!' : 'Copy to clipboard'}>
        <button onClick={handleCopy} type="button">
          <CopyIcon />
          {showText && 'Copy'}
        </button>
      </Tooltip>
    </div>
  );
}
