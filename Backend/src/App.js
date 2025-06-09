import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Global, css } from '@emotion/react';
import Header from './components/Header';
import Home from './pages/Home';
import Categoria from './pages/Categoria';
import Carrinho from './pages/Carrinho';
import Login from './pages/Login';
import Contato from './pages/Contato';
import { CarrinhoProvider } from './context/CarrinhoContext';
import { AuthProvider } from './context/AuthContext';

const globalStyles = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #ffffff;
    color: #333;
  }

  :root {
    --primary-orange: #ff6b35;
    --light-orange: #ff8c42;
    --dark-orange: #e55a2b;
    --white: #ffffff;
    --light-gray: #f8f9fa;
    --gray: #6c757d;
    --dark-gray: #343a40;
  }
`;

function App() {
  return (
    <AuthProvider>
      <CarrinhoProvider>
        <Router>
          <Global styles={globalStyles} />
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categoria/:nome" element={<Categoria />} />
            <Route path="/carrinho" element={<Carrinho />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contato" element={<Contato />} />
          </Routes>
        </Router>
      </CarrinhoProvider>
    </AuthProvider>
  );
}

export default App;