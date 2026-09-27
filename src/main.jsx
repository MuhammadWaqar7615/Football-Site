import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { MatchDataProvider } from './context/MatchDataContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <MatchDataProvider>
        <App />
      </MatchDataProvider>
    </ThemeProvider>
  </StrictMode>
);
