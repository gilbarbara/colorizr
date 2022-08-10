import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import Colorizr, { formatHex, isValidHex, palette, random, rotate, scheme } from 'colorizr';

import {
  Block,
  Box,
  Checker,
  ColorPicker,
  Contrast,
  Flex,
  Footer,
  Grid,
  H1,
  H2,
  H3,
  H4,
  InputBox,
  Item,
  Label,
  Pattern,
  Properties,
  Title,
  Wrapper,
} from './components';
import Check from './icons/Check';
import Times from './icons/Times';

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
    const { h, s, l } = colorizr.hsl;

    return `hsl(${h}, ${s}%, ${l}%)`;
  };

  const rgb = () => {
    const { r, g, b } = colorizr.rgb;

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

    timeout.current = setTimeout(() => {
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
      <H2>Color conversion, manipulation, comparison, and analysis.</H2>
      <Box>
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
      </Box>
      <Box>
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
      </Box>

      <H3>utilities</H3>

      <Grid>
        <Item>
          <Title>lighten</Title>
          <Block color={colorizr.lighten(10)} />
        </Item>
        <Item>
          <Title>darken</Title>
          <Block color={colorizr.darken(10)} />
        </Item>
      </Grid>

      <Grid>
        <Item>
          <Title>saturate</Title>
          <Block color={colorizr.saturate(20)} />
        </Item>
        <Item>
          <Title>desaturate</Title>
          <Block color={colorizr.desaturate(20)} />
        </Item>
      </Grid>

      <Grid>
        <Item>
          <Title>fade</Title>
          <Pattern>
            <Block color={colorizr.fade(30)} />
          </Pattern>
        </Item>

        <Item>
          <Title>invert</Title>
          <Block color={colorizr.invert()} />
        </Item>
      </Grid>

      <H3>rotate</H3>

      <Grid>
        {Array.from({ length: 360 / 60 - 1 }, (_, index) => index + 1).map(index => {
          const degrees = index * 60;
          const color = rotate(colorizr.hex, degrees);

          return (
            <Item key={degrees}>
              <Title>{degrees} deg</Title>
              <Block color={color} />
              <Footer>{color}</Footer>
            </Item>
          );
        })}
      </Grid>

      <H3>palette</H3>

      <H4>basic</H4>
      <Grid>
        {palette(colorizr.hex).map((d, index) => (
          <Item key={d + index}>
            <Block color={d} />
            <Footer>{d}</Footer>
          </Item>
        ))}
      </Grid>

      <H4>type: monochromatic, size: 12</H4>
      <Grid>
        {palette(colorizr.hex, { size: 12, type: 'monochromatic' }).map((d, index) => (
          <Item key={d + index}>
            <Block color={d} />
            <Footer>{d}</Footer>
          </Item>
        ))}
      </Grid>

      <H4>lightness(60)</H4>
      <Grid>
        {palette(colorizr.hex, { lightness: 70 }).map((d, index) => (
          <Item key={d + index}>
            <Block color={d} />
            <Footer>{d}</Footer>
          </Item>
        ))}
      </Grid>

      <H4>saturation(100); size(20)</H4>
      <Grid>
        {palette(colorizr.hex, { saturation: 100, size: 24 }).map((d, index) => (
          <Item key={d + index}>
            <Block color={d} />
            <Footer>{d}</Footer>
          </Item>
        ))}
      </Grid>

      <H3>Scheme</H3>

      <H4>analogous</H4>
      <Grid>
        {scheme(colorizr.hex, 'analogous').map((d, index) => (
          <Item key={d + index}>
            <Block color={d} />
            <Footer>{d}</Footer>
          </Item>
        ))}
      </Grid>

      <H4>complementary</H4>
      <Grid>
        {scheme(colorizr.hex, 'complementary').map((d, index) => (
          <Item key={d + index}>
            <Block color={d} />
            <Footer>{d}</Footer>
          </Item>
        ))}
      </Grid>

      <H4>split</H4>
      <Grid>
        {scheme(colorizr.hex, 'split').map((d, index) => (
          <Item key={d + index}>
            <Block color={d} />
            <Footer>{d}</Footer>
          </Item>
        ))}
      </Grid>

      <H4>triadic</H4>
      <Grid>
        {scheme(colorizr.hex, 'triadic').map((d, index) => (
          <Item key={d + index}>
            <Block color={d} />
            <Footer>{d}</Footer>
          </Item>
        ))}
      </Grid>

      <H4>tetradic</H4>
      <Grid>
        {scheme(colorizr.hex, 'tetradic').map((d, index) => (
          <Item key={d + index}>
            <Block color={d} />
            <Footer>{d}</Footer>
          </Item>
        ))}
      </Grid>

      <H4>rectangle</H4>
      <Grid>
        {scheme(colorizr.hex, 'rectangle').map((d, index) => (
          <Item key={d + index}>
            <Block color={d} />
            <Footer>{d}</Footer>
          </Item>
        ))}
      </Grid>

      <H4>square</H4>
      <Grid>
        {scheme(colorizr.hex, 'square').map((d, index) => (
          <Item key={d + index}>
            <Block color={d} />
            <Footer>{d}</Footer>
          </Item>
        ))}
      </Grid>
    </Wrapper>
  );
}
