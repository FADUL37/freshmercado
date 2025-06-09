import React, { useState, useEffect } from 'react';
import { productService, offerService } from '../services/api';
import ProductCard from '../components/ProductCard';
import OfferCarousel from '../components/OfferCarousel';
import styled from 'styled-components';

const HomeContainer = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  color: white;
  padding: 4rem 2rem;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin: 0 0 1rem 0;
  font-weight: bold;
`;

const HeroSubtitle = styled.p`
  font-size: 1.3rem;
  margin: 0 0 2rem 0;
  opacity: 0.9;
`;

const Section = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
`;

const OffersSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 2rem 4rem 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.8rem;
  color: #333;
  text-align: center;
  margin: 0 0 3rem 0;
  font-weight: bold;
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: #666;
`;

// Novos componentes do Footer
const Footer = styled.footer`
  background: linear-gradient(135deg, #2c3e50, #34495e);
  color: white;
  padding: 3rem 2rem 2rem;
  margin-top: 4rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterTitle = styled.h3`
  font-size: 1.5rem;
  margin: 0 0 1.5rem 0;
  color: #ff6b35;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FooterText = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 1rem 0;
  opacity: 0.9;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  border-radius: 50%;
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
  
  &:hover {
    transform: translateY(-3px) scale(1.1);
    box-shadow: 0 8px 25px rgba(255, 107, 53, 0.5);
    background: linear-gradient(135deg, #f7931e, #ff6b35);
  }
  
  &:active {
    transform: translateY(-1px) scale(1.05);
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1rem;
  opacity: 0.9;
  
  span {
    font-size: 1.2rem;
  }
`;

const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 2rem auto 0;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.p`
  margin: 0;
  opacity: 0.8;
  font-size: 0.95rem;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    justify-content: center;
    flex-wrap: wrap;
  }
`;

const FooterLink = styled.a`
  color: white;
  text-decoration: none;
  opacity: 0.8;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 1;
    color: #ff6b35;
  }
`;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ofertas em destaque com mais variedade
  const featuredOffers = [
    {
      id: 'offer1',
      name: 'Frutas Frescas Premium',
      description: 'Seleção especial de frutas da estação com até 40% de desconto!',
      originalPrice: 25.90,
      discountPrice: 15.50,
      image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=300&fit=crop',
      category: 'frutas',
      highlight: 'SUPER OFERTA'
    },
    {
      id: 'offer2',
      name: 'Carnes Nobres Selecionadas',
      description: 'Cortes especiais com qualidade premium e preços imperdíveis!',
      originalPrice: 89.90,
      discountPrice: 59.90,
      image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop',
      category: 'carnes',
      highlight: 'OFERTA RELÂMPAGO'
    },
    {
      id: 'offer3',
      name: 'Vegetais Orgânicos',
      description: 'Verduras e legumes frescos direto do produtor com 35% OFF!',
      originalPrice: 18.90,
      discountPrice: 12.30,
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
      category: 'vegetais',
      highlight: 'ORGÂNICO'
    },
    {
      id: 'offer4',
      name: 'Pães Artesanais Frescos',
      description: 'Pães quentinhos saídos do forno com ingredientes selecionados!',
      originalPrice: 12.90,
      discountPrice: 8.90,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
      category: 'bakery',
      highlight: 'FRESQUINHO'
    },
    {
      id: 'offer5',
      name: 'Laticínios Premium',
      description: 'Queijos, iogurtes e leites especiais com qualidade garantida!',
      originalPrice: 32.90,
      discountPrice: 22.90,
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop',
      category: 'laticinios',
      highlight: 'PREMIUM'
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsResponse] = await Promise.all([
        productService.getAll()
      ]);
      
      setProducts(productsResponse.data);
      setOffers(featuredOffers); // Usando ofertas em destaque
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setOffers(featuredOffers); // Fallback para ofertas estáticas
    } finally {
      setLoading(false);
    }
  };

  return (
    <HomeContainer>
      <HeroSection>
        <HeroTitle>🛒 Fresh Mercado Express</HeroTitle>
        <HeroSubtitle>
          Produtos frescos e de qualidade entregues na sua porta!
        </HeroSubtitle>
      </HeroSection>

      {offers.length > 0 && (
        <OffersSection>
          <SectionTitle>🔥 Ofertas Imperdíveis</SectionTitle>
          <OfferCarousel offers={offers} />
        </OffersSection>
      )}

      <Section>
        {loading ? (
          <LoadingSpinner>
            Carregando produtos...
          </LoadingSpinner>
        ) : (
          <ProductGrid>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductGrid>
        )}
      </Section>

      <Footer>
        <FooterContent>
          <FooterSection>
            <FooterTitle>
              🛒 Fresh Mercado Express
            </FooterTitle>
            <FooterText>
              Sua loja online de confiança para produtos frescos e de qualidade. 
              Entregamos sabor e praticidade diretamente na sua casa!
            </FooterText>
            <FooterText>
              <strong>Horário de Funcionamento:</strong><br />
              Segunda a Sábado: 07h às 20h<br />
              Domingo: 8h às 20h
            </FooterText>
          </FooterSection>

          <FooterSection>
            <FooterTitle>
              📞 Contato
            </FooterTitle>
            <ContactInfo>
              <ContactItem>
                <span>📱</span>
                <div>
                  <strong>WhatsApp:</strong><br />
                  (41) 996415306
                </div>
              </ContactItem>
              <ContactItem>
                <span>📧</span>
                <div>
                  <strong>Email:</strong><br />
                  contato@freshmercado.com.br
                </div>
              </ContactItem>
              <ContactItem>
                <span>📍</span>
                <div>
                  <strong>Endereço:</strong><br />
                  Av. Presidente Affonso Camargo, n• 811 - Cristo Rei
                </div>
              </ContactItem>
            </ContactInfo>
          </FooterSection>

          <FooterSection>
            <FooterTitle>
              🌐 Redes Sociais
            </FooterTitle>
            <FooterText>
              Siga-nos nas redes sociais e fique por dentro das nossas ofertas e novidades!
            </FooterText>
            <SocialLinks>
              <SocialLink 
                href="https://www.instagram.com/freshmercadoexpress/" 
                target="_blank" 
                rel="noopener noreferrer"
                title="Instagram"
              >
                📷
              </SocialLink>
              <SocialLink 
                href="https://www.facebook.com/freshmercadoexpress" 
                target="_blank" 
                rel="noopener noreferrer"
                title="Facebook"
              >
                📘
              </SocialLink>
              <SocialLink 
                href="https://wa.me/554196415306" 
                target="_blank" 
                rel="noopener noreferrer"
                title="WhatsApp"
              >
                💬
              </SocialLink>
              <SocialLink 
                href="mailto:contato@freshmercado.com.br" 
                title="Email"
              >
                ✉️
              </SocialLink>
            </SocialLinks>
          </FooterSection>
        </FooterContent>

        <FooterBottom>
          <Copyright>
            © 2025 Fresh Mercado Express. Todos os direitos reservados.
          </Copyright>
          <FooterLinks>
            <FooterLink href="#">Política de Privacidade</FooterLink>
            <FooterLink href="#">Termos de Uso</FooterLink>
            <FooterLink href="#">Trocas e Devoluções</FooterLink>
          </FooterLinks>
        </FooterBottom>
      </Footer>
    </HomeContainer>
  );
};

export default Home;