import { Box, Flex, Paragraph } from '@gilbarbara/components';
import { swatch, type SwatchOptions } from 'colorizr';

interface SwatchProps {
  color: string;
}

export default function Swatch({ color }: SwatchProps) {
  const options: Array<SwatchOptions & { title: string }> = [
    { title: 'scale: linear', scale: 'linear' },
    { title: 'scale: dynamic (default)' },
    { title: 'mode: light', mode: 'light' },
    { title: 'mode: dark', mode: 'dark' },
    { title: 'variant: deep', variant: 'deep' },
    { title: 'variant: vibrant', variant: 'vibrant' },
    { title: 'variant: neutral', variant: 'neutral' },
    { title: 'variant: pastel', variant: 'pastel' },
    { title: 'variant: subtle', variant: 'subtle' },
  ];

  return (
    <Box bg="white" padding="xxs" maxWidth={640} mx="auto">
      {options.map(({ title, ...options }) => (
        <Flex border={{ side: 'top', color: 'white' }} key={title} position="relative">
          {Object.entries(swatch(color, options)).map(([key, swatchColor]) => (
            <Box key={key} bg={swatchColor} height="75" width="10%" />
          ))}
          <Box position="absolute" right={8} bottom={8}>
            <Paragraph color="white">{title}</Paragraph>
          </Box>
        </Flex>
      ))}
    </Box>
  );
}
