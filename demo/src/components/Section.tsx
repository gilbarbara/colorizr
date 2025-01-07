import { Box, BoxProps, H2 } from '@gilbarbara/components';

interface SectionProps extends BoxProps {
  title: string;
}

export default function Section({ children, title, ...rest }: SectionProps) {
  return (
    <Box data-component-name={title} mb="xxl" textAlign="center" {...rest}>
      <H2 mb="xl">{title}</H2>
      {children}
    </Box>
  );
}
