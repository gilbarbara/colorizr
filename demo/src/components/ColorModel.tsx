import { CopyToClipboard, Flex, Text } from '@gilbarbara/components';
import Colorizr, { ColorType } from 'colorizr';


interface ColorModelProps {
  colorizr: Colorizr;
  format: ColorType;
}

export function ColorModel({ colorizr, format }: ColorModelProps) {
  const color = format === 'hex' ? colorizr.hex : colorizr.format(format, 2);

  return (
    <Flex
      align="center"
      bg={colorizr.hex}
      data-component-name="ColorModel"
      justify="space-between"
      px="md"
      py="xs"
      radius="sm"
    >
      <Text bold>{format.toUpperCase()}</Text>
      <Flex gap="xs">
        <Text size="sm">{color}</Text>
        <CopyToClipboard value={color} />
      </Flex>
    </Flex>
  );
}
