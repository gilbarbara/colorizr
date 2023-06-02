import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Box, H1, H2, H3, H4, Icon } from '@gilbarbara/components';
import Colorizr, { formatHex, isValidHex, palette, random, rotate, scheme, swatch } from 'colorizr';

import {
  Block,
  Checker,
  ColorPicker,
  Contrast,
  Footer,
  Grid,
  InputBox,
  Item,
  Label,
  Pattern,
  Properties,
  Section,
  Swatch,
  Title,
  Wrapper,
} from './components';
import { getColorNumber, getKey } from './utils';

function Check() {
  return <Icon name="check-o" shade="dark" size={20} variant="green" />;
}

function Times() {
  return <Icon name="close-o" shade="dark" size={20} variant="red" />;
}

export default function App() {
  const [color, setColor] = useState(random());
  const [textColor, setTextColor] = useState('');
  const [colorInput, setColorInput] = useState(color);
  const [textColorInput, setTextColorInput] = useState('');

  const [colorizr, setColorizr] = useState(new Colorizr(color));
  const timeout = useRef<number>();

  const text = textColor || colorizr.textColor;
  const analysis = colorizr.compare(text);

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

  const hsl = () => {
    const { h, l, s } = colorizr.hsl;

    return `hsl(${h}, ${s}%, ${l}%)`;
  };

  const rgb = () => {
    const { b, g, r } = colorizr.rgb;

    return `rgb(${r}, ${g}, ${b})`;
  };

  useEffect(() => {
    setColorizr(new Colorizr(color));
    setColorInput(color);
  }, [color]);

  const handleChangeBgColor = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const hex = `#${value.replace(/[^\da-f]/gi, '')}`;

    if (hex.length > 7) {
      return;
    }

    setColorInput(hex);

    if (isValidHex(hex, false)) {
      setColor(hex);
    }
  };

  const handleChangeBgColorPicker = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    clearTimeout(timeout.current);

    timeout.current = window.setTimeout(() => {
      setColor(value);
    }, 0);
  };

  const handleChangeTextColor = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    const hex = `#${value.replace(/[^\da-f]/gi, '')}`;

    if (hex.length > 7) {
      return;
    }

    setTextColorInput(hex);

    if (isValidHex(hex, false)) {
      setTextColor(hex);
    }
  };

  const handleChangeTextColorPicker = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;

    setTextColorInput(value);
    setTextColor(value);
  };

  return (
    <Wrapper bg={colorizr.hex} color={text}>
      <H1>Colorizr</H1>
      <H3 mb="xxl">Color conversion, manipulation, comparison, and analysis.</H3>
      <Block>
        <Label>
          Background color
          <InputBox>
            <input onChange={handleChangeBgColor} type="text" value={colorInput} />
            <ColorPicker>
              <input onInput={handleChangeBgColorPicker} type="color" value={formatHex(color)} />
            </ColorPicker>
          </InputBox>
        </Label>
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
            <span>HSL</span>
            <span>{hsl()}</span>
          </div>
          <div>
            <span>RGB</span>
            <span>{rgb()}</span>
          </div>
        </Properties>
      </Block>
      <Block>
        <Checker>
          <Label>
            Text color
            <InputBox>
              <input onChange={handleChangeTextColor} type="text" value={textColorInput || text} />
              <ColorPicker>
                <input onInput={handleChangeTextColorPicker} type="color" value={formatHex(text)} />
              </ColorPicker>
            </InputBox>
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
                <p>Small text</p>a
                <Box className="grades" flexBox>
                  <Box flexBox>
                    <span>AA</span>
                    {analysis.normalAA ? <Check /> : <Times />}
                  </Box>
                  <Box flexBox>
                    <span>AAA</span> {analysis.normalAAA ? <Check /> : <Times />}
                  </Box>
                </Box>
              </div>
              <div className="large">
                <p>Large text</p>
                <Box className="grades" flexBox>
                  <Box flexBox>
                    <span>AA</span>
                    {analysis.largeAA ? <Check /> : <Times />}
                  </Box>
                  <Box flexBox>
                    <span>AAA</span>
                    {analysis.largeAAA ? <Check /> : <Times />}
                  </Box>
                </Box>
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

      <Section>
        <H2 mb="xl">utilities</H2>

        <Grid>
          <Item>
            <Title>lighten</Title>
            <Swatch bgColor={colorizr.lighten(10)} />
          </Item>
          <Item>
            <Title>darken</Title>
            <Swatch bgColor={colorizr.darken(10)} />
          </Item>
        </Grid>

        <Grid>
          <Item>
            <Title>saturate</Title>
            <Swatch bgColor={colorizr.saturate(20)} />
          </Item>
          <Item>
            <Title>desaturate</Title>
            <Swatch bgColor={colorizr.desaturate(20)} />
          </Item>
        </Grid>

        <Grid>
          <Item>
            <Title>fade</Title>
            <Pattern>
              <Swatch bgColor={colorizr.fade(30)} />
            </Pattern>
          </Item>

          <Item>
            <Title>invert</Title>
            <Swatch bgColor={colorizr.invert()} />
          </Item>
        </Grid>
      </Section>

      <Section>
        <H2 mb="xl">rotate</H2>

        <Grid>
          {Array.from({ length: 360 / 60 - 1 }, (_, index) => index + 1).map(index => {
            const degrees = index * 60;
            const shade = rotate(colorizr.hex, degrees);

            return (
              <Item key={degrees}>
                <Title>{degrees} deg</Title>
                <Swatch bgColor={shade} />
                <Footer>{shade}</Footer>
              </Item>
            );
          })}
        </Grid>
      </Section>

      <Section>
        <H2 mb="xl">palette</H2>

        <H4 mb="lg">basic</H4>
        <Grid isLarge>
          {palette(colorizr.hex).map((d, index) => (
            <Item key={getKey(d, index)}>
              <Swatch bgColor={d} />
              <Footer>{d}</Footer>
            </Item>
          ))}
        </Grid>

        <H4 mb="lg">type: monochromatic, size: 12</H4>
        <Grid isLarge>
          {palette(colorizr.hex, { size: 12, type: 'monochromatic' }).map((d, index) => (
            <Item key={getKey(d, index)}>
              <Swatch bgColor={d} />
              <Footer>{d}</Footer>
            </Item>
          ))}
        </Grid>

        <H4 mb="lg">lightness(60)</H4>
        <Grid isLarge>
          {palette(colorizr.hex, { lightness: 70 }).map((d, index) => (
            <Item key={getKey(d, index)}>
              <Swatch bgColor={d} />
              <Footer>{d}</Footer>
            </Item>
          ))}
        </Grid>

        <H4 mb="lg">saturation(100); size(12)</H4>
        <Grid isLarge>
          {palette(colorizr.hex, { saturation: 100, size: 12 }).map((d, index) => (
            <Item key={getKey(d, index)}>
              <Swatch bgColor={d} />
              <Footer>{d}</Footer>
            </Item>
          ))}
        </Grid>
      </Section>

      <Section>
        <H2 mb="xl">swatch</H2>

        <Grid>
          {swatch(colorizr.hex).map((d, index) => (
            <Item key={getKey(d, index)}>
              <Swatch bgColor={d}>color-{getColorNumber(index)}</Swatch>
              <Footer>{d}</Footer>
            </Item>
          ))}
        </Grid>
      </Section>

      <Section>
        <H2 mb="xl">scheme</H2>

        <H4 mb="lg">analogous</H4>
        <Grid>
          {scheme(colorizr.hex, 'analogous').map((d, index) => (
            <Item key={getKey(d, index)}>
              <Swatch bgColor={d} />
              <Footer>{d}</Footer>
            </Item>
          ))}
        </Grid>

        <H4 mb="lg">complementary</H4>
        <Grid>
          {scheme(colorizr.hex, 'complementary').map((d, index) => (
            <Item key={getKey(d, index)}>
              <Swatch bgColor={d} />
              <Footer>{d}</Footer>
            </Item>
          ))}
        </Grid>

        <H4 mb="lg">split</H4>
        <Grid>
          {scheme(colorizr.hex, 'split').map((d, index) => (
            <Item key={getKey(d, index)}>
              <Swatch bgColor={d} />
              <Footer>{d}</Footer>
            </Item>
          ))}
        </Grid>

        <H4 mb="lg">triadic</H4>
        <Grid>
          {scheme(colorizr.hex, 'triadic').map((d, index) => (
            <Item key={getKey(d, index)}>
              <Swatch bgColor={d} />
              <Footer>{d}</Footer>
            </Item>
          ))}
        </Grid>

        <H4 mb="lg">tetradic</H4>
        <Grid>
          {scheme(colorizr.hex, 'tetradic').map((d, index) => (
            <Item key={getKey(d, index)}>
              <Swatch bgColor={d} />
              <Footer>{d}</Footer>
            </Item>
          ))}
        </Grid>

        <H4 mb="lg">rectangle</H4>
        <Grid>
          {scheme(colorizr.hex, 'rectangle').map((d, index) => (
            <Item key={getKey(d, index)}>
              <Swatch bgColor={d} />
              <Footer>{d}</Footer>
            </Item>
          ))}
        </Grid>

        <H4 mb="lg">square</H4>
        <Grid>
          {scheme(colorizr.hex, 'square').map((d, index) => (
            <Item key={getKey(d, index)}>
              <Swatch bgColor={d} />
              <Footer>{d}</Footer>
            </Item>
          ))}
        </Grid>
      </Section>
    </Wrapper>
  );
}
