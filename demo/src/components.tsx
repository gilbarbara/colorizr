import styled, { createGlobalStyle } from 'styled-components';

interface ContrastProps {
  contrast: number;
  largeText: number;
  normalText: number;
}

function getContrastBgColor({ contrast }: ContrastProps) {
  let backgroundColor = '#fbd0da';

  if (contrast >= 7) {
    backgroundColor = '#d2fbd0';
  } else if (contrast >= 4.5) {
    backgroundColor = '#f5f5d0';
  }

  return backgroundColor;
}

function getTextBgColor(type: 'normal' | 'large') {
  return ({ normalText, largeText }: ContrastProps) => {
    let backgroundColor = '#fbd0da';

    if (type === 'normal' ? normalText === 2 : largeText === 2) {
      backgroundColor = '#d2fbd0';
    } else if (type === 'normal' ? normalText === 1 : largeText === 1) {
      backgroundColor = '#f5f5d0';
    }

    return backgroundColor;
  };
}

export const Global = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: Rubik, sans-serif;
    margin: 0;
    padding: 0;
  }
`;

export const Wrapper = styled('main')<any>`
  background-color: ${props => props.bg || '#f7f7f7'};
  color: ${props => props.color || '#000'};
  min-height: 100vh;
  padding: 20px;
  text-align: center;
`;

export const Flex = styled.div`
  display: flex;
`;

export const H1 = styled.h1`
  font-size: 48px;
  margin: 0 0 24px;
`;

export const H2 = styled.h2`
  font-size: 32px;
  margin: 0 auto 32px;
  max-width: 600px;
`;

export const H3 = styled.h3`
  font-size: 28px;
  margin: 28px 0 14px;
`;

export const H4 = styled.h4`
  font-size: 22px;
  margin: 32px 0 22px;
`;

export const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin: 0 auto 20px;
  max-width: 640px;
`;

export const Item = styled.div`
  background-color: #fff;
  border-radius: 6px;
  color: #000;
  padding: 10px;
`;

export const Block = styled.div.attrs<any>(props => ({
  style: {
    backgroundColor: props.color,
  },
}))`
  border-radius: 6px;
  height: 96px;
  margin: 0 auto;
  position: relative;
  width: 96px;
`;

export const Pattern = styled(Block)`
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

export const Title = styled.p`
  font-size: 18px;
  margin: 0 0 5px;
`;

export const Footer = styled.p`
  margin: 5px 0 0;
`;

export const Box = styled.div`
  background-color: #fff;
  border-radius: 12px;
  color: #000;
  margin: 0 auto 32px;
  max-width: 500px;
  padding: 24px;
  text-align: left;
  width: 100%;
`;

export const Label = styled.label`
  text-align: left;
  width: 100%;

  input[type='text'] {
    appearance: none;
    border: 0;
    font-size: 18px;
    line-height: 46px;
    outline: none;
    padding: 0 48px 0 10px;
    width: 100%;
  }
`;

export const InputBox = styled.div`
  border: 1px solid #ccc;
  border-radius: 10px;
  display: flex;
  margin-top: 8px;
  overflow: hidden;
  position: relative;
`;

export const Checker = styled.div`
  align-items: start;
  display: inline-flex;
  flex-direction: column;
  width: 100%;

  strong {
    margin-bottom: 12px;
  }
`;

export const ColorPicker = styled.div`
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: inherit;
  height: 32px;
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  overflow: hidden;
  width: 32px;

  input[type='color'] {
    appearance: none;
    background: none;
    border: 0;
    cursor: pointer;
    height: 48px;
    margin: -8px;
    padding: 0;
    width: 48px;
  }
`;

export const Contrast = styled.div`
  border-radius: 12px;
  overflow: hidden;
  text-align: left;
  width: 100%;

  .top {
    align-items: center;
    background-color: ${getContrastBgColor};
    border-bottom: 2px solid #fff;
    display: flex;
    justify-content: space-between;
    padding: 16px;

    @media (min-width: 480px) {
      padding: 32px;
    }

    div:first-of-type {
      font-size: 40px;
      font-weight: bold;

      @media (min-width: 480px) {
        font-size: 50px;
      }
    }

    div:last-of-type {
      font-size: 24px;
      text-align: right;

      @media (min-width: 480px) {
        font-size: 32px;
      }
    }
  }

  .bottom {
    display: flex;
    flex-direction: column;

    p {
      margin: 0;
    }

    > div {
      align-items: center;
      display: flex;
      justify-content: space-between;
    }

    .small {
      background-color: ${getTextBgColor('normal')};
      border-bottom: 2px solid #fff;
      padding: 16px;
    }

    .large {
      background-color: ${getTextBgColor('large')};
      padding: 16px;
    }

    .grades {
      > div {
        align-items: center;

        &:first-of-type {
          margin-right: 8px;
        }
      }

      span {
        display: inline-flex;
        font-size: 18px;
        font-weight: 500;
        margin-right: 4px;
      }
    }
  }
`;

export const Properties = styled.div`
  margin-top: 24px;
  width: 100%;

  > div {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-top: 8px;

    &:first-of-type {
      margin-top: 0;
    }

    span:last-of-type {
      font-weight: 500;
    }
  }
`;
