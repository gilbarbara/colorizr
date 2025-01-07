import { Box, BoxProps, H4 } from '@gilbarbara/components';

interface ExampleProps extends BoxProps {
  title: string;
}

export default function Example(props: ExampleProps) {
  const { children, title, ...rest } = props;

  return (
    <Box {...rest}>
      <H4 mb="lg">{title}</H4>
      {children}
    </Box>
  );
}
