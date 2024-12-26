import { css, Global } from '@emotion/react';

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
