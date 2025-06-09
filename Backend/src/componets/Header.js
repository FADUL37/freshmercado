import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { ShoppingCart, Menu, Person, Phone } from '@mui/icons-material';
import { useCarrinho } from '../context/CarrinhoContext';
import { useAuth } from '../context/AuthContext';

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, var(--primary-orange), var(--light-orange));
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: bold;
  text-decoration: none;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--primary-orange);
    flex-direction: column;
    padding: 1rem;
  }
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.3s;
  
  &:hover {
    opacity: 0.8;
  }
`;

const CartButton = styled(Link)`
  position: relative;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255,255,255,0.2);
  padding: 0.5rem 1rem;
  border-radius: 25px;
  transition: background 0.3s;
  
  &:hover {
    background: rgba(255,255,255,0.3);
  }
`;

const CartCount = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const WhatsAppButton = styled.a`
  background: #25d366;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: background 0.3s;
  
  &:hover {
    background: #128c7e;
  }
`;

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { itensCarrinho } = useCarrinho();
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const totalItens = itensCarrinho.reduce((total, item) => total + item.quantidade, 0);

  const categorias = [
    { nome: 'frutas', label: 'Frutas' },
    { nome: 'verduras', label: 'Verduras' },
    { nome: 'carnes', label: 'Carnes' },
    { nome: 'laticinios', label: 'Laticínios' },
    { nome: 'bebidas', label: 'Bebidas' }
  ];

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">
          🛒 Mercado Online
        </Logo>
        
        <MenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu />
        </MenuButton>
        
        <NavLinks isOpen={isMenuOpen}>
          {categorias.map(cat => (
            <NavLink key={cat.nome} to={`/categoria/${cat.nome}`}>
              {cat.label}
            </NavLink>
          ))}
          <NavLink to="/contato">Contato</NavLink>
          
          {usuario ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>Olá, {usuario.nome}</span>
              <button 
                onClick={logout}
                style={{ 
                  background: 'none', 
                  border: '1px solid white', 
                  color: 'white', 
                  padding: '0.25rem 0.5rem', 
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Sair
              </button>
            </div>
          ) : (
            <NavLink to="/login">
              <Person /> Login
            </NavLink>
          )}
        </NavLinks>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <WhatsAppButton href="https://wa.me/554196415306" target="_blank">
            <Phone /> WhatsApp
          </WhatsAppButton>
          
          <CartButton to="/carrinho">
            <ShoppingCart />
            Carrinho
            {totalItens > 0 && <CartCount>{totalItens}</CartCount>}
          </CartButton>
        </div>
      </Nav>
    </HeaderContainer>
  );
}

export default Header;