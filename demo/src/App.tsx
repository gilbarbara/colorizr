import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Colorizr, { scheme, palette, random, rotate } from 'colorizr';

const Global = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
  }
`;

const Wrapper = styled.main<any>`
  background-color: ${props => props.bg || '#f7f7f7'};
  color: ${props => props.color || '#000'};
  font-family: sans-serif;
  min-height: 100vh;
  padding: 20px;
  text-align: center;
`;

const H1 = styled.h1`
  font-size: 44px;
  margin: 0 0 20px;
`;

const H2 = styled.h2`
  font-size: 32px;
  margin: 30px 0 15px;
`;

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin: 0 auto 20px;
  max-width: 640px;
`;

const Item = styled.div`
  background-color: #fff;
  color: #000;
  padding: 10px;
`;

const Block = styled.div<any>`
  background-color: ${props => props.color};
  height: ${props => (props.size ? `${props.size}px` : '64px')};
  margin: 0 auto;
  position: relative;
  width: ${props => (props.size ? `${props.size}px` : '64px')};
`;

const Lobby = styled(Block)`
  &:before {
    background-color: #fff;
    background-image: repeating-linear-gradient(
        -45deg,
        #666,
        #666 0.42em,
        transparent 0.42em,
        transparent 0.98em,
        #666 0.98em,
        #666 1em
      ),
      repeating-linear-gradient(
        45deg,
        #666,
        #666 0.42em,
        transparent 0.42em,
        transparent 0.98em,
        #666 0.98em,
        #666 1em
      );
    background-size: 1em 1em;
    bottom: 0;
    content: '';
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
  }
`;

const Title = styled.p`
  margin: 0 0 5px;
`;

const Footer = styled.p`
  margin: 5px 0 0;
`;

const Color = styled.p`
  font-size: 20px;
  font-weight: bold;
  margin: 0 0 5px;
`;

export default function App() {
  const [color, setColor] = useState(random());
  const timeout = useRef<number>();
  const instance = useRef(new Colorizr(color));

  const colorizr = instance.current;
  const textColor = colorizr.textColor;

  useEffect(() => {
    instance.current = new Colorizr(color);
  }, [color]);

  const handleChangeColor = useCallback(e => {
    const { value } = e.target;
    clearTimeout(timeout.current);

    timeout.current = setTimeout(() => {
      console.log(value);
      instance.current = new Colorizr(value);
      setColor(value);
    }, 200);
  }, []);

  return (
    <Wrapper bg={colorizr.hex} color={textColor}>
      <Global />
      <H1>Colorizr</H1>

      <Color>
        {colorizr.hex} <input type="color" onChange={handleChangeColor} value={colorizr.hex} />{' '}
      </Color>
      <br />
      <Title>
        <strong>luminance:</strong> {colorizr.luminance}
      </Title>
      <Title>
        <strong>chroma:</strong> {colorizr.chroma}
      </Title>
      <Title>
        <strong>css:</strong> {colorizr.css}
      </Title>
      <br />
      <Title>
        <strong>compare:</strong> {textColor}
      </Title>
      <pre>
        {Object.entries(colorizr.compare(textColor)).map(([key, value]) => (
          <div key={key}>
            {key}: {value.toString()}
          </div>
        ))}
      </pre>

      <br />
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
          <Title>desaturate</Title>
          <Block color={colorizr.desaturate(20)} />
        </Item>
        <Item>
          <Title>saturate</Title>
          <Block color={colorizr.saturate(20)} />
        </Item>
      </Grid>

      <Grid>
        <Item>
          <Title>fade</Title>
          <Lobby>
            <Block color={colorizr.fade(30)} />
          </Lobby>
        </Item>

        <Item>
          <Title>invert</Title>
          <Block color={colorizr.invert()} />
        </Item>
      </Grid>

      <H2>rotate</H2>

      <Grid>
        <Item>
          <Title>rotate: 60</Title>
          <Block color={rotate(colorizr.hex, 60)} />
        </Item>
        <Item>
          <Title>rotate: 120</Title>
          <Block color={rotate(colorizr.hex, 120)} />
        </Item>
        <Item>
          <Title>rotate: 240</Title>
          <Block color={rotate(colorizr.hex, 240)} />
        </Item>
      </Grid>

      <H2>palette</H2>

      <h3>basic</h3>
      <Grid>
        {palette(colorizr.hex).map(d => (
          <Item key={d}>
            <Block color={d} />
            <Footer>{d}</Footer>
          </Item>
        ))}
      </Grid>

      <h3>type: monochromatic, size: 12</h3>
      <Grid>
        {palette(colorizr.hex, { size: 12, type: 'monochromatic' }).map(d => (
          <Item key={d}>
            <Block color={d} />
            <Footer>{d}</Footer>
          </Item>
        ))}
      </Grid>

      <h3>lightness(60)</h3>
      <Grid>
        {palette(colorizr.hex, { lightness: 70 }).map(d => (
          <Item key={d}>
            <Block color={d} />
            <Footer>{d}</Footer>
          </Item>
        ))}
      </Grid>

      <h3>saturation(100); size(20)</h3>
      <Grid>
        {palette(colorizr.hex, { saturation: 100, size: 24 }).map(d => (
          <Item key={d}>
            <Block color={d} />
            <Footer>{d}</Footer>
          </Item>
        ))}
      </Grid>

      <H2>Scheme</H2>

      <h3>analogous</h3>
      <Grid>
        {scheme(colorizr.hex, 'analogous').map(d => (
          <Item key={d}>
            <Block color={d} />
            <Footer>{d}</Footer>
          </Item>
        ))}
      </Grid>

      <h3>complementary</h3>
      <Grid>
        {scheme(colorizr.hex, 'complementary').map(d => (
          <Item key={d}>
            <Block color={d} />
            <Footer>{d}</Footer>
          </Item>
        ))}
      </Grid>

      <h3>split</h3>
      <Grid>
        {scheme(colorizr.hex, 'split').map(d => (
          <Item key={d}>
            <Block color={d} />
            <Footer>{d}</Footer>
          </Item>
        ))}
      </Grid>

      <h3>triadic</h3>
      <Grid>
        {scheme(colorizr.hex, 'triadic').map(d => (
          <Item key={d}>
            <Block color={d} />
            <Footer>{d}</Footer>
          </Item>
        ))}
      </Grid>

      <h3>tetradic</h3>
      <Grid>
        {scheme(colorizr.hex, 'tetradic').map(d => (
          <Item key={d}>
            <Block color={d} />
            <Footer>{d}</Footer>
          </Item>
        ))}
      </Grid>

      <h3>rectangle</h3>
      <Grid>
        {scheme(colorizr.hex, 'rectangle').map(d => (
          <Item key={d}>
            <Block color={d} />
            <Footer>{d}</Footer>
          </Item>
        ))}
      </Grid>

      <h3>square</h3>
      <Grid>
        {scheme(colorizr.hex, 'square').map(d => (
          <Item key={d}>
            <Block color={d} />
            <Footer>{d}</Footer>
          </Item>
        ))}
      </Grid>
    </Wrapper>
  );
}
