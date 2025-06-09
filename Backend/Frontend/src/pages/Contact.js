import React from 'react';
import styled from 'styled-components';

const ContactContainer = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
  padding: 2rem;
`;

const ContactContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: #333;
  text-align: center;
  margin: 0 0 3rem 0;
  font-weight: bold;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContactCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
`;

const CardTitle = styled.h2`
  color: #ff6b35;
  margin: 0 0 1.5rem 0;
  font-size: 1.8rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
`;

const ContactIcon = styled.span`
  font-size: 1.5rem;
  width: 40px;
  text-align: center;
`;

const ContactText = styled.div`
  flex: 1;
`;

const ContactLabel = styled.div`
  font-weight: bold;
  color: #333;
  margin-bottom: 0.3rem;
`;

const ContactValue = styled.div`
  color: #666;
`;

const MapContainer = styled.div`
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  height: 400px;
`;

const MapIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

const WhatsAppButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #25d366;
  color: white;
  padding: 1rem 2rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s;
  margin-top: 1rem;
  
  &:hover {
    background: #128c7e;
    transform: translateY(-2px);
  }
`;

const Contact = () => {
  return (
    <ContactContainer>
      <ContactContent>
        <Title>📞 Entre em Contato</Title>
        
        <ContactGrid>
          <ContactCard>
            <CardTitle>📍 Informações de Contato</CardTitle>
            
            <ContactItem>
              <ContactIcon>📱</ContactIcon>
              <ContactText>
                <ContactLabel>WhatsApp</ContactLabel>
                <ContactValue>(41) 996415306</ContactValue>
              </ContactText>
            </ContactItem>
            
            <ContactItem>
              <ContactIcon>📞</ContactIcon>
              <ContactText>
                <ContactLabel>Telefone</ContactLabel>
                <ContactValue>(41) 3333-4444</ContactValue>
              </ContactText>
            </ContactItem>
            
            <ContactItem>
              <ContactIcon>📧</ContactIcon>
              <ContactText>
                <ContactLabel>Email</ContactLabel>
                <ContactValue>contato@freshmercado.com</ContactValue>
              </ContactText>
            </ContactItem>
            
            <ContactItem>
              <ContactIcon>📍</ContactIcon>
              <ContactText>
                <ContactLabel>Endereço</ContactLabel>
                <ContactValue>
                  Av. Presidente Affonso Camargo, 811<br />
                  Cristo Rei - Curitiba/PR<br />
                  CEP: 80050-370
                </ContactValue>
              </ContactText>
            </ContactItem>
            
            <WhatsAppButton 
              href="https://wa.me/554196415306?text=Olá! Gostaria de fazer um pedido."
              target="_blank"
              rel="noopener noreferrer"
            >
              💬 Falar no WhatsApp
            </WhatsAppButton>
          </ContactCard>
          
          <ContactCard>
            <CardTitle>⏰ Horário de Funcionamento</CardTitle>
            
            <ContactItem>
              <ContactIcon>📅</ContactIcon>
              <ContactText>
                <ContactLabel>Segunda a Sexta</ContactLabel>
                <ContactValue>07:00 às 20:00</ContactValue>
              </ContactText>
            </ContactItem>
            
            <ContactItem>
              <ContactIcon>📅</ContactIcon>
              <ContactText>
                <ContactLabel>Sábado</ContactLabel>
                <ContactValue>07:00 às 20:00</ContactValue>
              </ContactText>
            </ContactItem>
            
            <ContactItem>
              <ContactIcon>📅</ContactIcon>
              <ContactText>
                <ContactLabel>Domingo</ContactLabel>
                <ContactValue>08:00 às 20:00</ContactValue>
              </ContactText>
            </ContactItem>
            
            <ContactItem>
              <ContactIcon>🚚</ContactIcon>
              <ContactText>
                <ContactLabel>Entrega</ContactLabel>
                <ContactValue>30-45 minutos</ContactValue>
              </ContactText>
            </ContactItem>
            
            <ContactItem>
              <ContactIcon>💳</ContactIcon>
              <ContactText>
                <ContactLabel>Formas de Pagamento</ContactLabel>
                <ContactValue>
                  Dinheiro, Cartão, PIX<br />
                  (PIX com 5% de desconto)
                </ContactValue>
              </ContactText>
            </ContactItem>
            
            <ContactItem>
              <ContactIcon>🏪</ContactIcon>
              <ContactText>
                <ContactLabel>Venha nos visitar!</ContactLabel>
                <ContactValue>
                  Estamos sempre prontos para atendê-lo<br />
                  com os melhores produtos frescos.
                </ContactValue>
              </ContactText>
            </ContactItem>
          </ContactCard>
        </ContactGrid>
        
        <MapContainer>
          <MapIframe
            src="https://www.google.com/maps?q=Av.+Presidente+Affonso+Camargo,+811+-+Cristo+Rei,+Curitiba+-+PR,+80050-370&output=embed"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localização do Fresh Mercado Express"
          ></MapIframe>
        </MapContainer>
      </ContactContent>
    </ContactContainer>
  );
};

export default Contact;