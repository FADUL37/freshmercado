import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import styled from 'styled-components';

const CarouselContainer = styled.div`
  position: relative;
  max-width: 1200px;
  margin: 2rem auto;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.15);
  
  @media (max-width: 768px) {
    margin: 1rem;
    border-radius: 15px;
  }
  
  @media (max-width: 480px) {
    margin: 0.5rem;
    border-radius: 12px;
  }
`;

const CarouselTrack = styled.div`
  display: flex;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(${props => -props.currentSlide * 100}%);
`;

const OfferSlide = styled.div`
  min-width: 100%;
  position: relative;
  height: 320px;
  background: ${props => {
    const gradients = [
      'linear-gradient(135deg, #ff6b35, #f7931e)',
      'linear-gradient(135deg, #667eea, #764ba2)',
      'linear-gradient(135deg, #f093fb, #f5576c)',
      'linear-gradient(135deg, #4facfe, #00f2fe)',
      'linear-gradient(135deg, #43e97b, #38f9d7)'
    ];
    return gradients[props.index % gradients.length];
  }};
  display: flex;
  align-items: center;
  color: white;
  padding: 2rem;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.05);
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    height: 400px;
    padding: 1.5rem;
    flex-direction: column;
    justify-content: flex-start;
    text-align: center;
  }
  
  @media (max-width: 480px) {
    height: 450px;
    padding: 1rem;
    flex-direction: column;
    justify-content: flex-start;
  }
`;

const OfferContent = styled.div`
  flex: 1;
  z-index: 2;
  max-width: 60%;
  
  @media (max-width: 768px) {
    max-width: 100%;
    margin-bottom: 1.5rem;
    order: 2;
  }
  
  @media (max-width: 480px) {
    max-width: 100%;
    margin-bottom: 1rem;
    order: 2;
  }
`;

const HighlightBadge = styled.div`
  display: inline-block;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(10px);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  margin-bottom: 1rem;
  border: 1px solid rgba(255,255,255,0.3);
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
    margin-bottom: 0.5rem;
  }
`;

const OfferTitle = styled.h2`
  font-size: 2.2rem;
  margin: 0 0 0.8rem 0;
  font-weight: 900;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  line-height: 1.1;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin: 0 0 0.5rem 0;
  }
`;

const OfferDescription = styled.p`
  font-size: 1.1rem;
  margin: 0 0 1.5rem 0;
  opacity: 0.95;
  line-height: 1.4;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin: 0 0 1rem 0;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin: 0 0 0.8rem 0;
  }
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    justify-content: center;
    gap: 0.8rem;
    margin: 1rem 0;
  }
  
  @media (max-width: 480px) {
    gap: 0.5rem;
    margin: 0.8rem 0;
  }
`;

const OriginalPrice = styled.span`
  font-size: 1.4rem;
  text-decoration: line-through;
  opacity: 0.8;
  background: rgba(255,255,255,0.1);
  padding: 0.3rem 0.8rem;
  border-radius: 10px;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 0.2rem 0.6rem;
  }
`;

const DiscountPrice = styled.span`
  font-size: 2rem;
  font-weight: 900;
  color: #fff3e0;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const Discount = styled.span`
  background: #e53e3e;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-weight: bold;
  font-size: 1.1rem;
  box-shadow: 0 4px 15px rgba(229, 62, 62, 0.4);
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.4rem 0.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 0.3rem 0.6rem;
  }
`;

const OfferButton = styled.button`
  background: white;
  color: #ff6b35;
  border: none;
  padding: 1.2rem 2.5rem;
  border-radius: 30px;
  font-weight: bold;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 1rem;
  box-shadow: 0 6px 20px rgba(0,0,0,0.2);
  
  &:hover {
    background: #fff3e0;
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.3);
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    padding: 1rem 2rem;
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
    margin-top: 0.5rem;
    border-radius: 25px;
  }
`;

const OfferImage = styled.img`
  position: absolute;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  width: 280px;
  height: 280px;
  object-fit: cover;
  border-radius: 20px;
  opacity: 1;
  box-shadow: 0 20px 60px rgba(0,0,0,0.6);
  z-index: 10;
  border: 5px solid rgba(255,255,255,0.4);
  transition: all 0.3s ease;
  background: white;
  
  &:hover {
    transform: translateY(-50%) scale(1.08);
    box-shadow: 0 25px 80px rgba(0,0,0,0.7);
    border-color: rgba(255,255,255,0.6);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
    border-radius: 25px;
    z-index: -1;
  }
  
  @media (max-width: 768px) {
    position: relative;
    right: auto;
    top: auto;
    transform: none;
    width: 200px;
    height: 200px;
    margin: 0 auto 1rem;
    border-radius: 15px;
    border: 4px solid rgba(255,255,255,0.5);
    order: 1;
    box-shadow: 0 15px 40px rgba(0,0,0,0.5);
    
    &:hover {
      transform: scale(1.05);
    }
  }
  
  @media (max-width: 480px) {
    width: 180px;
    height: 180px;
    border-radius: 12px;
    margin-bottom: 1rem;
    border: 3px solid rgba(255,255,255,0.6);
    box-shadow: 0 12px 30px rgba(0,0,0,0.4);
  }
`;

const ImageGlow = styled.div`
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  width: 300px;
  height: 300px;
  border-radius: 25px;
  background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
  z-index: 5;
  pointer-events: none;
  animation: glow 3s ease-in-out infinite alternate;
  
  @keyframes glow {
    from {
      opacity: 0.5;
      transform: translateY(-50%) scale(0.95);
    }
    to {
      opacity: 0.8;
      transform: translateY(-50%) scale(1.05);
    }
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const CarouselControls = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.8rem;
  z-index: 15;
  
  @media (max-width: 768px) {
    bottom: 1.5rem;
    gap: 0.6rem;
  }
  
  @media (max-width: 480px) {
    bottom: 1rem;
    gap: 0.5rem;
  }
`;

const ControlDot = styled.button`
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: none;
  background: ${props => props.active ? 'white' : 'rgba(255,255,255,0.5)'};
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  
  &:hover {
    background: white;
    transform: scale(1.2);
  }
  
  @media (max-width: 768px) {
    width: 12px;
    height: 12px;
  }
  
  @media (max-width: 480px) {
    width: 10px;
    height: 10px;
  }
`;

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.direction === 'prev' ? 'left: 1rem;' : 'right: 1rem;'}
  background: rgba(255,255,255,0.9);
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 1.5rem;
  color: #333;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 15;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  
  &:hover {
    background: white;
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
  }
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
    ${props => props.direction === 'prev' ? 'left: 0.5rem;' : 'right: 0.5rem;'}
  }
  
  @media (max-width: 480px) {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
`;

const OfferCarousel = ({ offers }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { addItem } = useCart();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % offers.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [offers.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % offers.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + offers.length) % offers.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleAddToCart = (offer) => {
    addItem({
      id: offer.id,
      name: offer.name,
      price: offer.discountPrice,
      image: offer.image,
      category: offer.category || 'ofertas'
    });
  };

  const calculateDiscount = (original, discount) => {
    return Math.round(((original - discount) / original) * 100);
  };

  if (!offers || offers.length === 0) {
    return null;
  }

  return (
    <CarouselContainer>
      <CarouselTrack currentSlide={currentSlide}>
        {offers.map((offer, index) => (
          <OfferSlide key={offer.id} index={index}>
            <OfferContent>
              <HighlightBadge>{offer.highlight}</HighlightBadge>
              <OfferTitle>🔥 {offer.name}</OfferTitle>
              <OfferDescription>{offer.description}</OfferDescription>
              
              <PriceContainer>
                <OriginalPrice>De: R$ {offer.originalPrice.toFixed(2)}</OriginalPrice>
                <DiscountPrice>Por: R$ {offer.discountPrice.toFixed(2)}</DiscountPrice>
                <Discount>
                  -{calculateDiscount(offer.originalPrice, offer.discountPrice)}% OFF
                </Discount>
              </PriceContainer>
              
              <OfferButton onClick={() => handleAddToCart(offer)}>
                🛒 Aproveitar Agora!
              </OfferButton>
            </OfferContent>
            
            <ImageGlow />
            <OfferImage 
              src={offer.image} 
              alt={offer.name}
              onError={(e) => {
                e.target.style.display = 'none';
                console.log('Erro ao carregar imagem:', offer.image);
              }}
            />
          </OfferSlide>
        ))}
      </CarouselTrack>
      
      <NavButton direction="prev" onClick={prevSlide}>
        ‹
      </NavButton>
      <NavButton direction="next" onClick={nextSlide}>
        ›
      </NavButton>
      
      <CarouselControls>
        {offers.map((_, index) => (
          <ControlDot
            key={index}
            active={index === currentSlide}
            onClick={() => goToSlide(index)}
          />
        ))}
      </CarouselControls>
    </CarouselContainer>
  );
};

export default OfferCarousel;