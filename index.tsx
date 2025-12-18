
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const mountApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("Critical Error: Could not find root element to mount to");
    return;
  }

  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Failed to render React application:", error);
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: sans-serif; text-align: center;">
        <h2>Initialization Error</h2>
        <p>The application failed to start. Please check the console for details.</p>
        <pre style="text-align: left; background: #eee; padding: 10px; margin-top: 10px;">${error}</pre>
      </div>
    `;
  }
};

// Start the application
mountApp();
