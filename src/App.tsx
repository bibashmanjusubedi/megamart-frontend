// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'
import { HomePage } from './pages/HomePage';
import { ProductListingPage } from './pages/ProductListingPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartPage } from './pages/CartPage';
import { SignInPage } from './pages/SignInPage';
import React from 'react';
import { BrowserRouter,Routes,Route} from 'react-router-dom';
 
const App: React.FC = () =>{
  return (
    // <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/products" element={<ProductListingPage />}/>
        <Route path="products/:id" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />

        {/* Auth Routes */}
        <Route path="/signin" element={<SignInPage />} />
      </Routes>
    // </BrowserRouter>
  );
}

export default App;
