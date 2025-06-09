import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import Checkout from './Checkout';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: flex-end;
  z-index: 2000;
`;

const CartContainer = styled.div`
  background: white;
  width: 400px;
  height: 100vh;
  overflow-y: auto;
  box-shadow: -5px 0 15px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  
  @media (max-width: 480px) {
    width: 100vw;
  }
`;

const CartHeader = styled.div`
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  color: white;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.3s;
  
  &:hover {
    background: rgba(255,255,255,0.2);
  }
`;

const CartItems = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  gap: 1rem;
  transition: background 0.3s;
  
  &:hover {
    background: #f9f9f9;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #f0f0f0;
`;

const ItemInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ItemName = styled.h4`
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 0.9rem;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ItemPrice = styled.span`
  color: #ff6b35;
  font-weight: bold;
  font-size: 1rem;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
`;

const QuantityButton = styled.button`
  background: #ff6b35;
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1rem;
  transition: all 0.3s;
  
  &:hover:not(:disabled) {
    background: #e55a2b;
    transform: scale(1.1);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const QuantityDisplay = styled.span`
  font-weight: bold;
  color: #333;
  min-width: 20px;
  text-align: center;
`;

const RemoveButton = styled.button`
  background: #e53e3e;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.3s;
  
  &:hover {
    background: #c53030;
    transform: translateY(-1px);
  }
`;

const CartFooter = styled.div`
  padding: 1.5rem;
  border-top: 2px solid #eee;
  background: #f9f9f9;
  position: sticky;
  bottom: 0;
`;

const Total = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 2px solid #ff6b35;
`;

const CheckoutButton = styled.button`
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #e55a2b, #e8851a);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
  
  h3 {
    color: #333;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
  
  p {
    font-size: 1rem;
    line-height: 1.5;
  }
`;

const ItemCount = styled.div`
  background: #ff6b35;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
  position: absolute;
  top: -5px;
  right: -5px;
`;

const Cart = ({ onClose }) => {
  const { items, updateQuantity, removeItem, getTotal } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity === 0) {
      removeItem(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    setShowCheckout(true);
  };

  const handleCheckoutSuccess = (orderData) => {
    console.log('Pedido realizado com sucesso:', orderData);
    // Aqui você pode adicionar lógica adicional após o sucesso do pedido
    // Como mostrar uma notificação, redirecionar, etc.
  };

  const handleCloseCheckout = () => {
    setShowCheckout(false);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  // Se o checkout estiver aberto, mostrar o componente Checkout
  if (showCheckout) {
    return (
      <Checkout 
        onClose={handleCloseCheckout}
        onSuccess={handleCheckoutSuccess}
      />
    );
  }

  return (
    <Overlay onClick={onClose}>
      <CartContainer onClick={(e) => e.stopPropagation()}>
        <CartHeader>
          <div>
            <h2>🛒 Seu Carrinho</h2>
            {items.length > 0 && (
              <small>{getTotalItems()} {getTotalItems() === 1 ? 'item' : 'itens'}</small>
            )}
          </div>
          <CloseButton onClick={onClose}>×</CloseButton>
        </CartHeader>
        
        <CartItems>
          {items.length === 0 ? (
            <EmptyCart>
              <h3>🛒 Carrinho vazio</h3>
              <p>Adicione produtos deliciosos para continuar suas compras!</p>
            </EmptyCart>
          ) : (
            items.map(item => (
              <CartItem key={item.id}>
                <ItemImage 
                  src={item.image} 
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/60x60?text=Produto';
                  }}
                />
                <ItemInfo>
                  <ItemName title={item.name}>{item.name}</ItemName>
                  <ItemPrice>R$ {item.price.toFixed(2)}</ItemPrice>
                </ItemInfo>
                <QuantityControls>
                  <QuantityButton 
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    title="Diminuir quantidade"
                  >
                    -
                  </QuantityButton>
                  <QuantityDisplay>{item.quantity}</QuantityDisplay>
                  <QuantityButton 
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    title="Aumentar quantidade"
                  >
                    +
                  </QuantityButton>
                  <RemoveButton 
                    onClick={() => removeItem(item.id)}
                    title="Remover item"
                  >
                    🗑️
                  </RemoveButton>
                </QuantityControls>
              </CartItem>
            ))
          )}
        </CartItems>
        
        {items.length > 0 && (
          <CartFooter>
            <Total>
              💰 Total: R$ {getTotal().toFixed(2)}
            </Total>
            <CheckoutButton onClick={handleCheckout}>
              🎉 Finalizar Pedido
            </CheckoutButton>
          </CartFooter>
        )}
      </CartContainer>
    </Overlay>
  );
};

export default Cart;