import styled from '@emotion/styled';
import { theme } from '@gilbarbara/components';

import { getContrastBgColor, getTextBgColor } from './utils';

export const Block = styled.div`
  background-color: #fff;
  border-radius: ${theme.radius.md};
  color: #000;
  max-width: 460px;
  padding: ${theme.spacing.md};
  text-align: left;
  width: 100%;

  @media (min-width: 480px) {
    padding: ${theme.radius.lg};
  }
`;

export const Checker = styled.div`
  align-items: start;
  display: inline-flex;
  flex-direction: column;
  width: 100%;

  strong {
    margin-bottom: ${theme.spacing.sm};
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

export const InputBox = styled.div`
  border: 1px solid #ccc;
  border-radius: ${theme.radius.xs};
  display: flex;
  margin-top: 8px;
  overflow: hidden;
  position: relative;
`;

export const Item = styled.div`
  background-color: #fff;
  border-radius: ${theme.radius.xs};
  color: #000;
  padding: ${theme.spacing.xs};
  text-align: center;
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

export const Main = styled.main<any>`
  background-color: ${props => props.bg || '#f7f7f7'};
  color: ${props => props.color || '#000'};
  min-height: 100vh;
  padding: ${theme.spacing.md};
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
