import 'rc-slider/assets/index.css';

import { useCallback, useMemo } from 'react';
import {
  Box,
  Button,
  Dropdown,
  Flex,
  FlexCenter,
  FlexInline,
  Grid,
  Icon,
  Paragraph,
  Toggle,
  Types,
} from '@gilbarbara/components';
import { debounce } from '@gilbarbara/helpers';
import { useMount, useSetState } from '@gilbarbara/hooks';
import { type ScaleOptions } from 'colorizr';
import Slider from 'rc-slider';

interface ScaleProps {
  color: string;
}

interface State extends Omit<ScaleOptions, 'format'> {
  showDefault: boolean;
  width: number;
}

const defaultState = {
  lightnessCurve: 1.5,
  maxLightness: 0.97,
  minLightness: 0.2,
  scale: 'dynamic',
  variant: undefined,
} satisfies Omit<State, 'showDefault' | 'width'>;

const sliderMarkStyle = {
  transform: 'translate(-50%, 0%)',
};

function ColorSwatch({ color, tone }: { color: string; tone: string }) {
  return (
    <Box maxWidth={70} textAlign="left" title={color} width="100%">
      <FlexCenter bg={color} height={40}>
        {}
      </FlexCenter>
      <Paragraph bold mt="xxs" size="sm">
        {tone}
      </Paragraph>
      <Paragraph mt="xxs" size="xs">
        {color}
      </Paragraph>
    </Box>
  );
}

export default function Scale({ color }: ScaleProps) {
  const [state, setState] = useSetState<State>({
    ...defaultState,
    showDefault: false,
    width: window.innerWidth,
  });

  const {
    lightnessCurve,
    maxLightness = 0.97,
    minLightness = 0.2,
    scale,
    showDefault,
    variant,
    width,
  } = state;

  useMount(() => {
    // Function to update the width
    const handleResize = () => {
      setState({ width: window.innerWidth });
    };

    const handleResizeDebounced = debounce(handleResize, 150);

    // Add the resize event listener
    window.addEventListener('resize', handleResizeDebounced);

    // Cleanup function to remove the event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResizeDebounced);
    };
  }); // Empty dependency array ensures this runs only once

  const handleLightnessFactorChange = (value: number | number[]) => {
    if (!Array.isArray(value)) {
      setState({ lightnessCurve: value });
    }
  };

  const handleMaxLightnessChange = useCallback(
    (value: number | number[]) => {
      if (!Array.isArray(value) && value > minLightness) {
        setState({ maxLightness: value });
      }
    },
    [minLightness, setState],
  );

  const handleMinLightnessChange = useCallback(
    (value: number | number[]) => {
      if (!Array.isArray(value) && value < maxLightness) {
        setState({ minLightness: value });
      }
    },
    [maxLightness, setState],
  );

  const handleVariantChange = (values: Types.DropdownOption[]) => {
    const [selected] = values;

    setState({ variant: (selected.value || undefined) as ScaleOptions['variant'] });
  };

  const handleToggleScale = (value: boolean) => {
    setState({ scale: value ? 'fixed' : 'dynamic' });
  };

  const handleToggleDefault = (value: boolean) => {
    setState({ showDefault: value });
  };

  const variants = useMemo(
    () => [
      { label: 'None', value: '' },
      { label: 'Deep', value: 'deep' },
      { label: 'Neutral', value: 'neutral' },
      { label: 'Subtle', value: 'subtle' },
      { label: 'Vibrant', value: 'vibrant' },
    ],
    [],
  );

  const isFixed = scale === 'fixed';
  const isSmall = width < 600;
  const flexDirection = isSmall ? 'row' : 'column';
  const flexWrap = isSmall ? 'wrap' : 'nowrap';
  const gridColumns = isSmall ? 'auto-fit' : '11';

  return (
    <Box data-component-name="Scale">
      <Flex
        bg="white"
        direction="column"
        gap="lg"
        maxWidth={800}
        mb="lg"
        mx="auto"
        padding="lg"
        radius="md"
        textAlign="left"
        wrap="wrap"
      >
        <Box>
          <Paragraph bold size="xl">
            Dynamic Scale Generator
          </Paragraph>
          <Paragraph mt="xxs">Adjust settings and compare with default.</Paragraph>
        </Box>
        <Flex gap="lg" wrap={flexWrap}>
          <Box width="100%">
            <Paragraph bold mb="xxs">
              Max Lightness ({maxLightness})
            </Paragraph>
            <Slider
              disabled={isFixed}
              marks={{
                0.97: { label: 'default', style: sliderMarkStyle },
              }}
              max={1}
              onChange={handleMaxLightnessChange}
              step={0.01}
              value={maxLightness}
            />
          </Box>
          <Box width="100%">
            <Paragraph bold mb="xxs">
              Min Lightness ({minLightness})
            </Paragraph>
            <Slider
              disabled={isFixed}
              marks={{
                0.2: { label: 'default', style: sliderMarkStyle },
              }}
              max={1}
              onChange={handleMinLightnessChange}
              step={0.01}
              value={minLightness}
            />
          </Box>
        </Flex>

        <Flex gap="lg" wrap={flexWrap}>
          <Box width="100%">
            <Paragraph bold mb="xxs">
              Lightness Curve ({lightnessCurve})
            </Paragraph>
            <Slider
              disabled={isFixed}
              marks={{
                1.5: { label: 'default', style: sliderMarkStyle },
              }}
              max={10}
              onChange={handleLightnessFactorChange}
              step={0.1}
              value={lightnessCurve}
            />
          </Box>
          <Box width="100%">
            <Paragraph bold mb="xxs">
              Variant
            </Paragraph>
            <Dropdown
              height="sm"
              items={variants}
              onChange={handleVariantChange}
              searchable={false}
              values={variants.filter(({ value }) => value === variant)}
              width="100%"
            />
          </Box>
        </Flex>
        <Flex gap="lg" wrap={flexWrap}>
          <Flex gap="md" width="100%" wrap={flexWrap}>
            <Box width="100%">
              <Toggle
                checked={scale === 'fixed'}
                label="Fixed scale"
                onToggle={handleToggleScale}
              />
            </Box>
            <Box width="100%">
              <Toggle checked={showDefault} label="Show default" onToggle={handleToggleDefault} />
            </Box>
          </Flex>
          <Flex align="start" justify={isSmall ? 'start' : 'end'} width="100%">
            <Button
              onClick={() => setState(defaultState)}
              size="sm"
              startContent={<Icon name="sync" />}
            >
              Reset
            </Button>
          </Flex>
        </Flex>
      </Flex>
      <FlexInline
        bg="white"
        direction={flexDirection}
        gap="xxs"
        maxWidth={1024}
        mx="auto"
        p="xs"
        radius="sm"
      >
        <Grid rowGap="xxs" templateColumns={`repeat(${gridColumns}, minmax(40px,70px))`}>
          {Object.entries(scale(color, state)).map(([tone, swatch]) => (
            <ColorSwatch key={tone} color={swatch} tone={tone} />
          ))}
        </Grid>
        {showDefault && (
          <Grid rowGap="xxs" templateColumns={`repeat(${gridColumns}, minmax(40px,70px))`}>
            {Object.entries(scale(color)).map(([tone, swatch]) => (
              <ColorSwatch key={tone} color={swatch} tone={tone} />
            ))}
          </Grid>
        )}
      </FlexInline>
    </Box>
  );
}
