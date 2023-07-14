import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './store.ts';

class ArtisansApp extends HTMLElement {
  connectedCallback() {
    createRoot(this).render(
      <React.StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </React.StrictMode>
    );
  }

  disconnectedCallback() {
    createRoot(this).unmount();
  }
}

customElements.define('artisans-app', ArtisansApp);
