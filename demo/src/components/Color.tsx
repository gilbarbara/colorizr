import styled from '@emotion/styled';
import { Box, FlexCenter, FlexProps, Paragraph, type Types } from '@gilbarbara/components';

export interface ColorProps extends FlexProps {
  fontSize?: Types.TextSizes;
  footer?: string;
  showPattern?: boolean;
  title: string;
}

const Pattern = styled.div`
  background-image: linear-gradient(45deg, #999 25%, transparent 25%),
    linear-gradient(135deg, #999 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #999 75%),
    linear-gradient(135deg, transparent 75%, #999 75%);
  background-size: 24px 24px;
  background-position:
    0 0,
    12px 0,
    12px -12px,
    0 12px;
  border-radius: 12px;
`;

export default function Color(props: ColorProps) {
  const { children, color, fontSize = 'md', footer, showPattern, title, ...rest } = props;

  let colorBox = (
    <FlexCenter height={64} overflow="hidden" radius="xs" width={96} {...rest}>
      {children}
    </FlexCenter>
  );

  if (showPattern) {
    colorBox = <Pattern>{colorBox}</Pattern>;
  }

  return (
    <Box>
      {colorBox}
      <Paragraph bold mt="xs" size={fontSize}>
        {title}
      </Paragraph>
      {footer && (
        <Paragraph color="gray.700" mt="xxxs" size={fontSize}>
          {footer}
        </Paragraph>
      )}
    </Box>
  );
}
