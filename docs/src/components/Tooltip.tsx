import { type ReactNode, useRef, useState } from 'react';
import {
  arrow,
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  useFloating,
  useHover,
  useInteractions,
  useTransitionStyles,
} from '@floating-ui/react';

interface TooltipProps {
  children: ReactNode;
  content: string;
}

export default function Tooltip({ children, content }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef<HTMLDivElement>(null);

  const { context, floatingStyles, middlewareData, refs } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'top',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      flip(),
      shift({ padding: 8 }),
      arrow({ element: arrowRef, padding: 8 }),
    ],
  });

  const hover = useHover(context);
  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, { duration: 200 });
  const { getFloatingProps, getReferenceProps } = useInteractions([hover]);

  const arrowX = middlewareData.arrow?.x;
  const arrowY = middlewareData.arrow?.y;

  return (
    <>
      <div ref={refs.setReference} className="tooltip__wrapper" {...getReferenceProps()}>
        {children}
      </div>
      {isMounted && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            className="tooltip"
            style={{ ...floatingStyles, ...transitionStyles }}
            {...getFloatingProps()}
          >
            {content}
            <div
              ref={arrowRef}
              className="tooltip__arrow"
              style={{
                left: arrowX != null ? `${arrowX}px` : '',
                top: arrowY != null ? `${arrowY}px` : '',
              }}
            />
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
