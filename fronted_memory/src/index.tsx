import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './app/app';

import './index.scss';
import { Provider } from 'react-redux';
import { setupStore } from './store/store';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <Provider store={setupStore()}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
