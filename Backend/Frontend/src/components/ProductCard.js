import React from 'react';
import { useCart } from '../context/CartContext';
import styled from 'styled-components';

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.12);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  height: 160px;
  overflow: hidden;
  background: #f8f9fa;
  
  @media (max-width: 768px) {
    height: 140px;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${Card}:hover & {
    transform: scale(1.03);
  }
`;

const CategoryBadge = styled.span`
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(255, 107, 53, 0.9);
  color: white;
  padding: 0.25rem 0.6rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: capitalize;
  backdrop-filter: blur(4px);
`;

const CardContent = styled.div`
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    padding: 0.8rem;
  }
`;

const ProductName = styled.h3`
  margin: 0 0 0.4rem 0;
  color: #333;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const ProductDescription = styled.p`
  color: #666;
  font-size: 0.8rem;
  margin: 0 0 0.8rem 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
    margin-bottom: 0.6rem;
  }
`;

const PriceContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
`;

const Price = styled.span`
  font-size: 1.3rem;
  font-weight: 700;
  color: #ff6b35;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const AddButton = styled.button`
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  
  &:hover {
    background: linear-gradient(135deg, #e55a2b, #e8851a);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem 0.8rem;
    font-size: 0.8rem;
  }
`;

const ProductCard = ({ product }) => {
  const { addItem } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addItem(product);
    
    // Feedback visual
    const button = e.target;
    const originalText = button.textContent;
    button.textContent = '✓ Adicionado!';
    button.style.background = '#4caf50';
    
    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = '';
    }, 1000);
  };

  return (
    <Card>
      <ImageContainer>
        <ProductImage src={product.image} alt={product.name} />
        <CategoryBadge>{product.category}</CategoryBadge>
      </ImageContainer>
      
      <CardContent>
        <ProductName>{product.name}</ProductName>
        <ProductDescription>{product.description}</ProductDescription>
        
        <PriceContainer>
          <Price>R$ {product.price.toFixed(2)}</Price>
        </PriceContainer>
        
        <AddButton onClick={handleAddToCart}>
          🛒 Adicionar
        </AddButton>
      </CardContent>
    </Card>
  );
};

export default ProductCard;