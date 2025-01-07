import styled from '@emotion/styled';
import { Grid, GridProps } from '@gilbarbara/components';

const Styled = styled(Grid)`
  grid-template-columns: repeat(2, auto);
  place-items: center;

  @media (min-width: 390px) {
    grid-template-columns: repeat(3, auto);
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(112px, 1fr));
  }
`;

export default function ColorGrid({ children, maxWidth = 800, ...rest }: GridProps) {
  return (
    <Styled display="inline-grid" gap="md" maxWidth={maxWidth} mx="auto" {...rest}>
      {children}
    </Styled>
  );
}
