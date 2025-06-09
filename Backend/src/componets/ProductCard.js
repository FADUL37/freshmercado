import React from 'react';
import styled from '@emotion/styled';
import { AddShoppingCart } from '@mui/icons-material';
import { useCarrinho } from '../context/CarrinhoContext';

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }
`;

const OfferBadge = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: #e74c3c;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: bold;
  z-index: 1;
`;

const ProductImage = styled.div`
  height: 200px;
  background: var(--light-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: var(--gray);
`;

const ProductInfo = styled.div`
  padding: 1.5rem;
`;

const ProductName = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--dark-gray);
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Price = styled.span`
  font-size: 1.4rem;
  font-weight: bold;
  color: var(--primary-orange);
`;

const OriginalPrice = styled.span`
  font-size: 1rem;
  color: var(--gray);
  text-decoration: line-through;
`;

const AddButton = styled.button`
  width: 100%;
  background: var(--primary-orange);
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background 0.3s;
  
  &:hover {
    background: var(--dark-orange);
  }
`;

function ProductCard({ produto, isOffer = false }) {
  const { adicionarItem } = useCarrinho();

  const handleAddToCart = () => {
    adicionarItem(produto);
  };

  const getProductIcon = (categoria) => {
    const icons = {
      frutas: '🍎',
      verduras: '🥬',
      carnes: '🥩',
      laticinios: '🥛',
      bebidas: '🥤'
    };
    return icons[categoria] || '🛒';
  };

  return (
    <Card>
      {isOffer && produto.oferta && (
        <OfferBadge>
          OFERTA!
        </OfferBadge>
      )}
      
      <ProductImage>
        {getProductIcon(produto.categoria)}
      </ProductImage>
      
      <ProductInfo>
        <ProductName>{produto.nome}</ProductName>
        
        <PriceContainer>
          <Price>R$ {produto.preco.toFixed(2)}</Price>
          {produto.precoOriginal && (
            <OriginalPrice>R$ {produto.precoOriginal.toFixed(2)}</OriginalPrice>
          )}
        </PriceContainer>
        
        <AddButton onClick={handleAddToCart}>
          <AddShoppingCart />
          Adicionar ao Carrinho
        </AddButton>
      </ProductInfo>
    </Card>
  );
}

export default ProductCard;