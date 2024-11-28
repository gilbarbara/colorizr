import { ChangeEvent, useEffect, useRef, useState } from 'react';
import {
  Box,
  ButtonUnstyled,
  CopyToClipboard,
  Flex,
  FlexInline,
  H1,
  H2,
  H3,
  H4,
  Icon,
  Paragraph,
} from '@gilbarbara/components';
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
  swatch,
} from 'colorizr';

import {
  Block,
  Checker,
  Color,
  ColorModel,
  ColorPicker,
  Contrast,
  Footer,
  Grid,
  InputBox,
  Item,
  Label,
  Pattern,
  Properties,
  Refresh,
  Section,
  Title,
  Wrapper,
} from './components';
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

  const text = textColor || colorizr.textColor;
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
    <Wrapper bg={colorizr.format('oklch')} color={text}>
      <H1>Colorizr</H1>
      <H3 mb="xxl">Color conversion, manipulation, comparison, and analysis.</H3>
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

      <Section data-component-name="Manipulation">
        <H2 mb="xl">Manipulation</H2>

        <Grid>
          <Item>
            <Title>lighten</Title>
            <Color bgColor={colorizr.lighten(10)} />
          </Item>
          <Item>
            <Title>darken</Title>
            <Color bgColor={colorizr.darken(10)} />
          </Item>
          <Item>
            <Title>saturate</Title>
            <Color bgColor={colorizr.saturate(20)} />
          </Item>
          <Item>
            <Title>desaturate</Title>
            <Color bgColor={colorizr.desaturate(20)} />
          </Item>
          <Item>
            <Title>opacify</Title>
            <Pattern>
              <Color bgColor={colorizr.opacify(0.8)} />
            </Pattern>
          </Item>

          <Item>
            <Title>invert</Title>
            <Color bgColor={colorizr.invert()} />
          </Item>
        </Grid>
      </Section>

      <Section data-component-name="Rotate">
        <H2 mb="xl">rotate</H2>

        <Grid>
          {Array.from({ length: 360 / 60 - 1 }, (_, index) => index + 1).map(index => {
            const degrees = index * 60;

            const shade = rotate(colorizr.hex, degrees);

            return (
              <Item key={degrees}>
                <Title>{degrees} deg</Title>
                <Color bgColor={shade} />
                <Footer>{shade}</Footer>
              </Item>
            );
          })}
        </Grid>
      </Section>

      <Section data-component-name="Swatch">
        <H2 mb="xl">swatch</H2>

        <H4 mb="lg">scale: dynamic (default)</H4>
        <FlexInline bg="white" p="xs" wrap="wrap">
          {Object.entries(swatch(colorizr.hex)).map(([key, swatchColor]) => (
            <CopyToClipboard
              key={key}
              tooltipProps={{
                bg: swatchColor,
                size: 'md',
              }}
              tooltipText={swatchColor}
              value={swatchColor}
            >
              <Box key={key} bg={swatchColor} height={100} width={65} />
            </CopyToClipboard>
          ))}
        </FlexInline>

        <H4 mb="lg" mt="xl">
          scale: linear
        </H4>
        <FlexInline bg="white" p="xs" wrap="wrap">
          {Object.entries(swatch(colorizr.hex, { scale: 'linear' })).map(([key, swatchColor]) => (
            <CopyToClipboard
              key={key}
              tooltipProps={{
                bg: swatchColor,
                size: 'md',
              }}
              tooltipText={swatchColor}
              value={swatchColor}
            >
              <Box key={key} bg={swatchColor} height={100} width={65} />
            </CopyToClipboard>
          ))}
        </FlexInline>
      </Section>

      <Section data-component-name="Palette">
        <H2 mb="xl">palette</H2>

        <H4 mb="lg">basic</H4>
        <Grid>
          {palette(colorizr.hex).map((d, index) => (
            <Item key={getKey(d, index)}>
              <Color bgColor={d} />
              <Footer>{d}</Footer>
            </Item>
          ))}
        </Grid>

        <H4 mb="lg">type: monochromatic, size: 12</H4>
        <Grid>
          {palette(colorizr.hex, { size: 12, type: 'monochromatic' }).map((d, index) => (
            <Item key={getKey(d, index)}>
              <Color bgColor={d} />
              <Footer>{d}</Footer>
            </Item>
          ))}
        </Grid>

        <H4 mb="lg">lightness(60)</H4>
        <Grid>
          {palette(colorizr.hex, { lightness: 70 }).map((d, index) => (
            <Item key={getKey(d, index)}>
              <Color bgColor={d} />
              <Footer>{d}</Footer>
            </Item>
          ))}
        </Grid>

        <H4 mb="lg">saturation(100); size(12)</H4>
        <Grid>
          {palette(colorizr.hex, { saturation: 100, size: 12 }).map((d, index) => (
            <Item key={getKey(d, index)}>
              <Color bgColor={d} />
              <Footer>{d}</Footer>
            </Item>
          ))}
        </Grid>
      </Section>

      <Section data-component-name="Scheme">
        <H2 mb="xl">scheme</H2>

        <H4 mb="lg">analogous</H4>
        <Grid>
          {scheme(colorizr.hex, 'analogous').map((d, index) => (
            <Item key={getKey(d, index)}>
              <Color bgColor={d} />
              <Footer>{d}</Footer>
            </Item>
          ))}
        </Grid>

        <H4 mb="lg">complementary</H4>
        <Grid>
          {scheme(colorizr.hex, 'complementary').map((d, index) => (
            <Item key={getKey(d, index)}>
              <Color bgColor={d} />
              <Footer>{d}</Footer>
            </Item>
          ))}
        </Grid>

        <H4 mb="lg">split</H4>
        <Grid>
          {scheme(colorizr.hex, 'split').map((d, index) => (
            <Item key={getKey(d, index)}>
              <Color bgColor={d} />
              <Footer>{d}</Footer>
            </Item>
          ))}
        </Grid>

        <H4 mb="lg">triadic</H4>
        <Grid>
          {scheme(colorizr.hex, 'triadic').map((d, index) => (
            <Item key={getKey(d, index)}>
              <Color bgColor={d} />
              <Footer>{d}</Footer>
            </Item>
          ))}
        </Grid>

        <H4 mb="lg">tetradic</H4>
        <Grid>
          {scheme(colorizr.hex, 'tetradic').map((d, index) => (
            <Item key={getKey(d, index)}>
              <Color bgColor={d} />
              <Footer>{d}</Footer>
            </Item>
          ))}
        </Grid>

        <H4 mb="lg">rectangle</H4>
        <Grid>
          {scheme(colorizr.hex, 'rectangle').map((d, index) => (
            <Item key={getKey(d, index)}>
              <Color bgColor={d} />
              <Footer>{d}</Footer>
            </Item>
          ))}
        </Grid>

        <H4 mb="lg">square</H4>
        <Grid>
          {scheme(colorizr.hex, 'square').map((d, index) => (
            <Item key={getKey(d, index)}>
              <Color bgColor={d} />
              <Footer>{d}</Footer>
            </Item>
          ))}
        </Grid>
      </Section>
    </Wrapper>
  );
}
