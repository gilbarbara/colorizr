import { createRoot } from 'react-dom/client';

import App from './App';
import { GlobalStyles } from './components';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <>
      <GlobalStyles />
      <App />
    </>,
  );
}
