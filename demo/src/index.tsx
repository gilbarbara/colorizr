import * as React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { Global } from './components';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <>
      <Global />
      <App />
    </>,
  );
}
