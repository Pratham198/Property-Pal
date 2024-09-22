import React from 'react'; 
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './contexts/AuthContext'; // Import AuthProvider

const root = ReactDOM.createRoot(
  document.getElementById('root')
);
root.render(
  <AuthProvider> {/* Wrap App with AuthProvider */}
    <App />
  </AuthProvider>
);

reportWebVitals();
