import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ToastContainer } from "react-toastify";
import App from './App.jsx';
import { LoadingContextProvider } from './components/common/context/LoaderContext.jsx';
import './index.css';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoadingContextProvider>
      <ToastContainer />    
      <App />
      {/* ewk */}
    </LoadingContextProvider>
  </StrictMode>,
)
