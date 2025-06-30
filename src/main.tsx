import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { RootProvider } from './providers/RootProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <RootProvider>
        <App />
      </RootProvider>
    </BrowserRouter>
  </StrictMode>
);
