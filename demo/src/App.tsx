import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { ButtonUnstyled, Flex, H1, Icon, Paragraph } from '@gilbarbara/components';
import { useSetState } from '@gilbarbara/hooks';
import colorDescription from '@samhaeng/naevner';
import Colorizr, {
  ColorType,
  convert,
  extractColorParts,
  HEX,
  isHex,
  isValidColor,
  palette,
  random,
  removeAlphaFromHex,
  rotate,
  scheme,
} from 'colorizr';

import Color from './components/Color';
import ColorGrid from './components/ColorGrid';
import ColorModel from './components/ColorModel';
import Example from './components/Example';
import Scale from './components/Scale';
import Section from './components/Section';
import {
  Block,
  Checker,
  ColorPicker,
  Contrast,
  InputBox,
  Item,
  Label,
  Main,
  Properties,
  Refresh,
} from './styled';
import { getKey } from './utils';

interface State {
  color: string;
  colorInput: string;
  colorType: ColorType;
  textColor: string;
  textColorInput: string;
  textColorType: ColorType;
}

const colorTypes: ColorType[] = ['hex', 'hsl', 'oklab', 'oklch', 'rgb'];

function Check() {
  return <Icon color="green.600" name="check-o" size={20} />;
}

function Times() {
  return <Icon color="red.600" name="close-o" size={20} />;
}

export default function App() {
  const [randomColor] = useState(random());
  const [{ color, colorInput, colorType, textColor, textColorInput, textColorType }, setState] =
    useSetState<State>({
      color: randomColor,
      colorInput: randomColor,
      colorType: 'hex',
      textColor: '',
      textColorInput: '',
      textColorType: 'hex',
    });

  const [colorizr, setColorizr] = useState(new Colorizr(color));
  const timeout = useRef<number>();

  const text = textColor || colorizr.readableColor;
  const analysis = colorizr.compare(text as HEX);

  const grade = () => {
    const { contrast } = analysis;

    let output = 'Very Poor';

    if (contrast > 12) {
      output = 'Super';
    } else if (contrast > 7) {
      output = 'Very good';
    } else if (contrast > 4.5) {
      output = 'Good';
    } else if (contrast > 3) {
      output = 'Poor';
    }

    return output;
  };

  useEffect(() => {
    setColorizr(new Colorizr(color));
    setState({ colorInput: color });
  }, [color, setState]);

  const handleChangeBgColor = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setState({ colorInput: value });

    if (isValidColor(value)) {
      setState({
        color: value,
        colorType: isHex(value) ? 'hex' : extractColorParts(value).model,
      });
    }
  };

  const handleChangeBgColorPicker = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    clearTimeout(timeout.current);

    timeout.current = window.setTimeout(() => {
      setState({
        color: convert(value, colorType),
        colorInput: convert(value, colorType),
      });
    }, 0);
  };

  const handleChangeTextColor = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setState({
      textColorInput: value,
    });

    if (isValidColor(value)) {
      setState({
        textColor: value,
        textColorType: isHex(value) ? 'hex' : extractColorParts(value).model,
      });
    }
  };

  const handleChangeTextColorPicker = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    const nextValue = convert(value, textColorType);

    setState({
      textColorInput: nextValue,
      textColor: nextValue,
    });
  };

  const handleClickRandom = () => {
    const nextRandomColor = random();

    setState({
      color: nextRandomColor,
      colorInput: nextRandomColor,
    });
  };

  return (
    <Main bg={colorizr.format('oklch')} color={text}>
      <H1 align="center">Colorizr</H1>
      <Paragraph align="center" bold mb="xxl" size="xl">
        Color conversion, manipulation, comparison, and analysis.
      </Paragraph>
      <Flex gap="xl" justify="center" mb="xxl" mx="auto" wrap="wrap">
        <Block data-component-name="BackgroundColor">
          <Label>
            Background color
            <InputBox>
              <input onChange={handleChangeBgColor} type="text" value={colorInput} />
              <Refresh>
                <ButtonUnstyled onClick={handleClickRandom}>
                  <Icon name="sync" size={20} />
                </ButtonUnstyled>
              </Refresh>
              <ColorPicker>
                <input
                  onInput={handleChangeBgColorPicker}
                  type="color"
                  value={convert(color, 'hex')}
                />
              </ColorPicker>
            </InputBox>
            <Paragraph align="center" color="gray.600" mt="xxs" size="sm">
              Works with hex, hsl, oklab, oklch and rgb
            </Paragraph>
          </Label>
          <Paragraph align="center" bold mt="md" size="xl">
            {colorDescription(removeAlphaFromHex(colorizr.hex))}{' '}
            {colorizr.alpha !== 1 ? `(${colorizr.alpha * 100})%` : ''}
          </Paragraph>
          <Properties>
            <div>
              <span>Luminance</span>
              <span>{colorizr.luminance}</span>
            </div>
            <div>
              <span>Chroma</span>
              <span>{colorizr.chroma}</span>
            </div>
            <div>
              <span>Opacity</span>
              <span>{colorizr.opacity}</span>
            </div>
          </Properties>

          <Flex direction="column" gap="md" mt="md">
            {colorTypes
              .filter(d => d !== colorType)
              .map(type => (
                <ColorModel key={type} colorizr={colorizr} format={type} />
              ))}
          </Flex>
        </Block>
        <Block data-component-name="TextColor">
          <Checker>
            <Label>
              Text color
              <InputBox>
                <input
                  onChange={handleChangeTextColor}
                  type="text"
                  value={textColorInput || text}
                />
                <ColorPicker>
                  <input
                    onInput={handleChangeTextColorPicker}
                    type="color"
                    value={convert(text, 'hex')}
                  />
                </ColorPicker>
              </InputBox>
              <Paragraph align="center" color="gray.600" mt="xxs" size="sm">
                Works with hex, hsl, oklab, oklch and rgb
              </Paragraph>
            </Label>
            <br />
            <strong>Contrast</strong>
            <Contrast
              contrast={analysis.contrast}
              largeText={[analysis.largeAA, analysis.largeAAA].filter(Boolean).length}
              normalText={[analysis.normalAA, analysis.normalAAA].filter(Boolean).length}
            >
              <div className="top">
                <div className="left">{analysis.contrast}</div>
                <div className="right">{grade()}</div>
              </div>
              <div className="bottom">
                <div className="small">
                  <p>Small text</p>
                  <Flex className="grades">
                    <Flex>
                      <span>AA</span>
                      {analysis.normalAA ? <Check /> : <Times />}
                    </Flex>
                    <Flex>
                      <span>AAA</span> {analysis.normalAAA ? <Check /> : <Times />}
                    </Flex>
                  </Flex>
                </div>
                <div className="large">
                  <p>Large text</p>
                  <Flex className="grades">
                    <Flex>
                      <span>AA</span>
                      {analysis.largeAA ? <Check /> : <Times />}
                    </Flex>
                    <Flex>
                      <span>AAA</span>
                      {analysis.largeAAA ? <Check /> : <Times />}
                    </Flex>
                  </Flex>
                </div>
              </div>
            </Contrast>
            <Properties>
              <div>
                <span>Brightness Difference</span>
                <span>{analysis.brightnessDifference}</span>
              </div>
              <div>
                <span>Color Difference</span>
                <span>{analysis.colorDifference}</span>
              </div>
              <div>
                <span>Compliant</span>
                <span>{analysis.compliant}</span>
              </div>
            </Properties>
          </Checker>
        </Block>
      </Flex>

      <Section title="Manipulation">
        <ColorGrid>
          <Item>
            <Color bg={colorizr.lighten(10)} title="lighten" />
          </Item>
          <Item>
            <Color bg={colorizr.darken(10)} title="darken" />
          </Item>
          <Item>
            <Color bg={colorizr.saturate(20)} title="saturate" />
          </Item>
          <Item>
            <Color bg={colorizr.desaturate(20)} title="desaturate" />
          </Item>
          <Item>
            <Color bg={colorizr.opacify(0.8)} showPattern title="opacify" />
          </Item>

          <Item>
            <Color bg={colorizr.invert()} title="invert" />
          </Item>
        </ColorGrid>
      </Section>

      <Section title="rotate">
        <ColorGrid>
          {Array.from({ length: 360 / 60 }, (_, index) => index).map(index => {
            const degrees = index * 60;
            const shade = rotate(colorizr.hex, degrees);

            return (
              <Item key={degrees}>
                <Color bg={shade} footer={shade} title={`${degrees} deg`} />
              </Item>
            );
          })}
        </ColorGrid>
      </Section>

      <Section title="scale">
        <Scale color={colorizr.hex} />
      </Section>

      <Section title="palette">
        <Example mb="xl" title="default">
          <ColorGrid>
            {palette(colorizr.hex).map((d, index) => (
              <Item key={getKey(d, index)}>
                <Color bg={d} title={d} />
              </Item>
            ))}
          </ColorGrid>
        </Example>

        <Example mb="xl" title="type: monochromatic, size: 12">
          <ColorGrid>
            {palette(colorizr.hex, { size: 12, type: 'monochromatic' }).map((d, index) => (
              <Item key={getKey(d, index)}>
                <Color bg={d} title={d} />
              </Item>
            ))}
          </ColorGrid>
        </Example>

        <Example mb="xl" title="lightness(60)">
          <ColorGrid>
            {palette(colorizr.hex, { lightness: 70 }).map((d, index) => (
              <Item key={getKey(d, index)}>
                <Color bg={d} title={d} />
              </Item>
            ))}
          </ColorGrid>
        </Example>

        <Example title="saturation(100); size(12)">
          <ColorGrid>
            {palette(colorizr.hex, { saturation: 100, size: 12 }).map((d, index) => (
              <Item key={getKey(d, index)}>
                <Color bg={d} title={d} />
              </Item>
            ))}
          </ColorGrid>
        </Example>
      </Section>

      <Section title="scheme">
        <Example mb="xl" title="analogous">
          <ColorGrid>
            {scheme(colorizr.hex, 'analogous').map((d, index) => (
              <Item key={getKey(d, index)}>
                <Color bg={d} title={d} />
              </Item>
            ))}
          </ColorGrid>
        </Example>

        <Example mb="xl" title="complementary">
          <ColorGrid>
            {scheme(colorizr.hex, 'complementary').map((d, index) => (
              <Item key={getKey(d, index)}>
                <Color bg={d} title={d} />
              </Item>
            ))}
          </ColorGrid>
        </Example>

        <Example mb="xl" title="split">
          <ColorGrid>
            {scheme(colorizr.hex, 'split').map((d, index) => (
              <Item key={getKey(d, index)}>
                <Color bg={d} title={d} />
              </Item>
            ))}
          </ColorGrid>
        </Example>

        <Example mb="xl" title="triadic">
          <ColorGrid>
            {scheme(colorizr.hex, 'triadic').map((d, index) => (
              <Item key={getKey(d, index)}>
                <Color bg={d} title={d} />
              </Item>
            ))}
          </ColorGrid>
        </Example>

        <Example mb="xl" title="tetradic">
          <ColorGrid>
            {scheme(colorizr.hex, 'tetradic').map((d, index) => (
              <Item key={getKey(d, index)}>
                <Color bg={d} title={d} />
              </Item>
            ))}
          </ColorGrid>
        </Example>

        <Example mb="xl" title="rectangle">
          <ColorGrid>
            {scheme(colorizr.hex, 'rectangle').map((d, index) => (
              <Item key={getKey(d, index)}>
                <Color bg={d} title={d} />
              </Item>
            ))}
          </ColorGrid>
        </Example>

        <Example title="square">
          <ColorGrid>
            {scheme(colorizr.hex, 'square').map((d, index) => (
              <Item key={getKey(d, index)}>
                <Color bg={d} title={d} />
              </Item>
            ))}
          </ColorGrid>
        </Example>
      </Section>
    </Main>
  );
}
