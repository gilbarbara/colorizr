import { ReactNode } from 'react';
import { css, Global } from '@emotion/react';
import styled from '@emotion/styled';
import { Box, CopyToClipboard, Flex, Text } from '@gilbarbara/components';
import Colorizr, { ColorType, textColor } from 'colorizr';

import { getContrastBgColor, getTextBgColor } from './utils';

export function GlobalStyles() {
  return (
    <Global
      styles={css`
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        body {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          background-image: linear-gradient(45deg, #999 25%, transparent 25%),
            linear-gradient(135deg, #999 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #999 75%),
            linear-gradient(135deg, transparent 75%, #999 75%);
          background-size: 24px 24px;
          background-position:
            0 0,
            12px 0,
            12px -12px,
            0 12px;
          font-family: Rubik, sans-serif;
          margin: 0;
          padding: 0;
        }
      `}
    />
  );
}

export function ColorModel({ colorizr, format }: { colorizr: Colorizr; format: ColorType }) {
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

export function Grid({ children, maxWidth = 800 }: { children: ReactNode; maxWidth?: number }) {
  return (
    <Flex justify="center" maxWidth={maxWidth} mb="lg" mx="auto" style={{ gap: 20 }} wrap="wrap">
      {children}
    </Flex>
  );
}

export function Section({ children }: { children: ReactNode }) {
  return (
    <Box data-component-name="Section" mb="xxl">
      {children}
    </Box>
  );
}

export const Wrapper = styled.main<any>`
  background-color: ${props => props.bg || '#f7f7f7'};
  color: ${props => props.color || '#000'};
  min-height: 100vh;
  padding: 20px;
  text-align: center;
`;

export const Item = styled.div`
  background-color: #fff;
  border-radius: 6px;
  color: #000;
  padding: 10px;
`;

export const Swatch = styled.div<{ bgColor?: string }>`
  align-items: center;
  background-color: ${props => props.bgColor};
  border-radius: 6px;
  color: ${props => (props.bgColor ? textColor(props.bgColor) : undefined)};
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 96px;
  margin: 0 auto;
  position: relative;
  width: 96px;
`;

export const Pattern = styled(Swatch)`
  &:before {
    background-image: linear-gradient(45deg, #999 25%, transparent 25%),
      linear-gradient(135deg, #999 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #999 75%),
      linear-gradient(135deg, transparent 75%, #999 75%);
    background-size: 24px 24px;
    background-position:
      0 0,
      12px 0,
      12px -12px,
      0 12px;
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

export const Block = styled.div`
  background-color: #fff;
  border-radius: 12px;
  color: #000;
  max-width: 500px;
  padding: 16px;
  text-align: left;
  width: 100%;

  @media (min-width: 480px) {
    padding: 24px;
  }
`;

export const Label = styled.label`
  text-align: left;
  width: 100%;

  input[type='text'] {
    appearance: none;
    border: 0;
    font-size: 16px;
    line-height: 40px;
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

export const Formats = styled.div`
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

export const Refresh = styled.div`
  border-radius: 6px;
  display: flex;
  height: 32px;
  position: absolute;
  place-items: center;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  overflow: hidden;
  width: 32px;
`;
