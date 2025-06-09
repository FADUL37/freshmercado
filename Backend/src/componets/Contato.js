import React from 'react';
import styled from '@emotion/styled';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Phone, Email, LocationOn, WhatsApp } from '@mui/icons-material';
import 'leaflet/dist/leaflet.css';

const ContatoContainer = styled.div`
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 3rem;
  color: var(--dark-gray);
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

const ContactInfo = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--light-gray);
  border-radius: 8px;
`;

const MapSection = styled.div`
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
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
  font-weight: 500;
  margin-top: 1rem;
  transition: background 0.3s;
  
  &:hover {
    background: #128c7e;
  }
`;

function Contato() {
  const position = [-25.4284, -49.2733]; // Coordenadas de Curitiba

  return (
    <ContatoContainer>
      <Title>Entre em Contato</Title>
      
      <ContactGrid>
        <ContactInfo>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-orange)' }}>
            Informações de Contato
          </h2>
          
          <ContactItem>
            <LocationOn style={{ color: 'var(--primary-orange)' }} />
            <div>
              <strong>Endereço:</strong><br />
              Av. Presidente Affonso Camargo, 811<br />
              Cristo Rei, Curitiba - PR<br />
              CEP: 80050-370
            </div>
          </ContactItem>
          
          <ContactItem>
            <Phone style={{ color: 'var(--primary-orange)' }} />
            <div>
              <strong>Telefone:</strong><br />
              (41) 9641-5306
            </div>
          </ContactItem>
          
          <ContactItem>
            <Email style={{ color: 'var(--primary-orange)' }} />
            <div>
              <strong>Email:</strong><br />
              contato@mercadoonline.com
            </div>
          </ContactItem>
          
          <WhatsAppButton href="https://wa.me/554196415306" target="_blank">
            <WhatsApp />
            Peça no WhatsApp
          </WhatsAppButton>
        </ContactInfo>
        
        <div>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-orange)' }}>
            Nossa Localização
          </h2>
          <MapSection>
            <MapContainer 
              center={position} 
              zoom={15} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={position}>
                <Popup>
                  Mercado Online<br />
                  Av. Presidente Affonso Camargo, 811
                </Popup>
              </Marker>
            </MapContainer>
          </MapSection>
        </div>
      </ContactGrid>
      
      <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--light-gray)', borderRadius: '12px' }}>
        <h3 style={{ color: 'var(--primary-orange)', marginBottom: '1rem' }}>
          Horário de Funcionamento
        </h3>
        <p><strong>Segunda a Sábado:</strong> 08:00 às 20:00</p>
        <p><strong>Domingo:</strong> 08:00 às 18:00</p>
        <p style={{ marginTop: '1rem', color: 'var(--primary-orange)' }}>
          <strong>Entrega 24 horas!</strong>
        </p>
      </div>
    </ContatoContainer>
  );
}

export default Contato;