import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Cart from './Cart';
import Login from './Login';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  
  @media (max-width: 768px) {
    padding: 0.8rem 0;
  }
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 0 0.8rem;
  }
`;

const Logo = styled.h1`
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0;
  color: white;
  
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: 768px) {
    gap: 1rem;
    order: 3;
    width: 100%;
    justify-content: center;
    margin-top: 0.5rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.8rem;
    flex-wrap: wrap;
  }
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
  
  &:hover {
    color: #fff3e0;
  }
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
    order: 2;
  }
  
  @media (max-width: 480px) {
    gap: 0.3rem;
  }
`;

const CartButton = styled.button`
  background: rgba(255,255,255,0.2);
  border: 2px solid white;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  position: relative;
  transition: all 0.3s;
  
  &:hover {
    background: white;
    color: #ff6b35;
  }
  
  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.3rem 0.6rem;
    font-size: 0.8rem;
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #e53e3e;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
  
  @media (max-width: 480px) {
    width: 18px;
    height: 18px;
    font-size: 0.7rem;
    top: -6px;
    right: -6px;
  }
`;

const LoginButton = styled.button`
  background: transparent;
  border: 2px solid white;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
  
  &:hover {
    background: white;
    color: #ff6b35;
  }
  
  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.3rem 0.6rem;
    font-size: 0.8rem;
  }
`;

const WhatsAppButton = styled.a`
  background: #25d366;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s;
  
  &:hover {
    background: #128c7e;
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.3rem 0.6rem;
    font-size: 0.8rem;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
    font-size: 0.85rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.3rem;
    font-size: 0.8rem;
  }
`;

// ... existing code ...

const Header = () => {
  const { items } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogin = (userData) => {
    setUser(userData);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <>
      <HeaderContainer>
        <Nav>
          <Logo>🛒 Fresh Mercado Express</Logo>
          
          <ActionButtons>
            <WhatsAppButton 
              href="https://wa.me/5541996415306" 
              target="_blank"
              rel="noopener noreferrer"
            >
              📱 WhatsApp
            </WhatsAppButton>
            
            <CartButton onClick={() => setShowCart(true)}>
              🛒 Carrinho
              {totalItems > 0 && <CartBadge>{totalItems}</CartBadge>}
            </CartButton>
            
            {user ? (
              <UserInfo>
                <span>Olá, {user.name}!</span>
                <LoginButton onClick={handleLogout}>Sair</LoginButton>
              </UserInfo>
            ) : (
              <LoginButton onClick={() => setShowLogin(true)}>
                🔐 Entrar
              </LoginButton>
            )}
          </ActionButtons>
          
          <NavLinks>
            <NavLink to="/">Início</NavLink>
            <NavLink to="/products">Produtos</NavLink>
            <NavLink to="/contact">Contato</NavLink>
          </NavLinks>
        </Nav>
      </HeaderContainer>
      
      {showCart && <Cart onClose={() => setShowCart(false)} />}
      {showLogin && <Login onClose={() => setShowLogin(false)} onLogin={handleLogin} />}
    </>
  );
};

export default Header;