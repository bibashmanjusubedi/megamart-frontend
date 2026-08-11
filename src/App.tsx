// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'
import { HomePage } from './pages/HomePage';
import React from 'react';
import { BrowserRouter,Routes,Route} from 'react-router-dom';
 
const App: React.FC = () =>{
  return (
    // <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}/>
      </Routes>
    // </BrowserRouter>
  );
}

export default App;
