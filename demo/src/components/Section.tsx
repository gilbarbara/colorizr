import { Box, BoxProps } from '@gilbarbara/components';

export function Section({ children, ...rest }: BoxProps) {
  return (
    <Box data-component-name="Section" mb="xxl" {...rest}>
      {children}
    </Box>
  );
}
