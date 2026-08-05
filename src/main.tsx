import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux';
import { store } from './store/store';
import { BrowserRouter } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css'; // Optional: if using Bootstrap CSS
// import 'bootstrap-icons/font/bootstrap-icons.css'; // Optional: if using Bootstrap icons

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
       
    </Provider>
  
  </StrictMode>,
)