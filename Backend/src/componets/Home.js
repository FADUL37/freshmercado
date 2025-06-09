import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import Slider from 'react-slick';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HomeContainer = styled.div`
  min-height: 100vh;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, var(--light-orange), var(--primary-orange));
  color: white;
  padding: 4rem 1rem;
  text-align: center;
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const Section = styled.section`
  padding: 3rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  color: var(--dark-gray);
`;

const OffersCarousel = styled.div`
  margin-bottom: 3rem;
  
  .slick-dots {
    bottom: -50px;
  }
  
  .slick-dots li button:before {
    color: var(--primary-orange);
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

function Home() {
  const [ofertas, setOfertas] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [ofertasRes, produtosRes] = await Promise.all([
          api.get('/ofertas'),
          api.get('/produtos')
        ]);
        setOfertas(ofertasRes.data);
        setProdutos(produtosRes.data.slice(0, 8)); // Primeiros 8 produtos
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        Carregando...
      </div>
    );
  }

  return (
    <HomeContainer>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Bem-vindo ao Mercado Online</HeroTitle>
          <HeroSubtitle>
            Produtos frescos e de qualidade entregues na sua casa!
          </HeroSubtitle>
          <p>📍 Av. Presidente Affonso Camargo, 811 - Cristo Rei, Curitiba - PR</p>
        </HeroContent>
      </HeroSection>

      <Section>
        <SectionTitle>🔥 Ofertas do Dia</SectionTitle>
        <OffersCarousel>
          <Slider {...carouselSettings}>
            {ofertas.map(produto => (
              <div key={produto.id} style={{ padding: '0 10px' }}>
                <ProductCard produto={produto} isOffer={true} />
              </div>
            ))}
          </Slider>
        </OffersCarousel>

        <SectionTitle>🛍️ Produtos em Destaque</SectionTitle>
        <ProductGrid>
          {produtos.map(produto => (
            <ProductCard key={produto.id} produto={produto} />
          ))}
        </ProductGrid>
      </Section>
    </HomeContainer>
  );
}

export default Home;