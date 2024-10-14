import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

const root = document.getElementById('root');

if (root) {
  try {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  } catch (error) {
    console.error('Error rendering React app:', error);
    root.innerHTML = '<p>An error occurred while rendering the app. Please check the console for details.</p>';
  }
} else {
  console.error('Root element not found');
}