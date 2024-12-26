import { Flex, FlexProps } from '@gilbarbara/components';

export function Grid({ children, maxWidth = 800 }: FlexProps) {
  return (
    <Flex gap="md" justify="center" maxWidth={maxWidth} mb="lg" mx="auto" wrap="wrap">
      {children}
    </Flex>
  );
}
