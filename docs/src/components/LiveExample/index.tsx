import type { ReactNode } from 'react';

import ArrowLeftRightIcon from '../ArrowLeftRightIcon';
import ArrowRightIcon from '../ArrowRightIcon';
import ColorSwatch from '../ColorSwatch';
import ColorSwatchRow from '../ColorSwatchRow';
import ContrastBadge from '../ContrastBadge';
import CopyButton from '../CopyButton';
import PlusIcon from '../PlusIcon';
import TextPreview from '../TextPreview';

import useLiveExample from './useLiveExample';

const compareFns = new Set([
  'apcaContrast',
  'brightnessDifference',
  'colorDifference',
  'compare',
  'contrast',
  'deltaE',
]);

interface LiveExampleProps {
  code: string;
  hideInputs?: boolean;
}

function getIcon(name: string) {
  if (name === 'mix') return PlusIcon;
  if (compareFns.has(name)) return ArrowLeftRightIcon;

  return ArrowRightIcon;
}

export default function LiveExample(props: LiveExampleProps) {
  const { code: initialCode, hideInputs = false } = props;
  const { code, display, error, handleChange, handleCommit, handleKeyDown, hasError } =
    useLiveExample(initialCode);

  const { color, inputColors = [], name = '', resultType = 'value', value } = display ?? {};
  const Icon = inputColors.length > 0 ? getIcon(name) : null;
  const isColorResult = resultType === 'colorArray' || resultType === 'colorScale';

  const content: Record<string, ReactNode> = {};

  if (!hideInputs && inputColors.length > 0 && !isColorResult) {
    content.colors = inputColors.map((c, index) => (
      <div key={index}>
        {index > 0 && Icon && <Icon />}
        <ColorSwatch color={c} />
      </div>
    ));
  }

  if (hasError && error) {
    content.result = <span className="live-example__error">{error}</span>;
  } else if (isColorResult && display) {
    content.result = (
      <div className="live-example__swatches">
        <ColorSwatchRow
          colors={display.colors}
          variant={resultType === 'colorScale' ? 'scale' : 'default'}
        />
        <CopyButton showText text={display.text} />
      </div>
    );
  } else if (display) {
    content.result = (
      <span className="live-example__result">
        <pre>
          {typeof display.value !== 'string'
            ? JSON.stringify(display.value, null, 2)
            : display.text}
        </pre>
        <CopyButton text={display.text} />
      </span>
    );
  } else {
    content.result = JSON.stringify({ color: `${color}`, display, isColorResult }, null, 2);
  }

  if (name === 'contrast' && typeof value === 'number') {
    content.preview = (
      <div className="live-example__preview">
        <TextPreview backgroundColor={inputColors[0]} textColor={inputColors[1]} />
        <div className="live-example__badges">
          <ContrastBadge ratio={value} level="AA" />
          <ContrastBadge ratio={value} level="AA" size="large" />
          <ContrastBadge ratio={value} level="AAA" />
          <ContrastBadge ratio={value} level="AAA" size="large" />
        </div>
      </div>
    );
  } else if (name === 'apcaContrast' && typeof value === 'number') {
    content.preview = (
      <div className="live-example__preview">
        <TextPreview backgroundColor={inputColors[0]} textColor={inputColors[1]} />
        <div className="live-example__badges">
          <ContrastBadge ratio={value} level="body" />
          <ContrastBadge ratio={value} level="large" />
          <ContrastBadge ratio={value} level="non-text" />
        </div>
      </div>
    );
  } else if (name === 'readableColor' && color) {
    content.preview = (
      <div className="live-example__preview">
        <TextPreview backgroundColor={inputColors[0]} textColor={color} />
      </div>
    );
  }

  return (
    <div className="live-example not-content">
      <h4>Playground</h4>
      <input
        type="text"
        className="live-example__input"
        value={code}
        onChange={handleChange}
        onBlur={handleCommit}
        onKeyDown={handleKeyDown}
        spellCheck={false}
      />
      <div className="live-example__colors">
        {content.colors}
        {color && !isColorResult && (
          <>
            {!!content.colors && !hideInputs && <ArrowRightIcon />}
            <ColorSwatch color={color} value={typeof value !== 'string' ? value : undefined} />
          </>
        )}
      </div>
      {content.result}
      {content.preview}
    </div>
  );
}
