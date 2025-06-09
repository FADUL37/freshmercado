import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { orderService } from './api'; 
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const CheckoutContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  width: 500px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
`;

const CheckoutHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Section = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-bottom: 2px solid #ecf0f1;
  padding-bottom: 0.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #333;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: #ff6b35;
  }
  
  &.error {
    border-color: #e53e3e;
  }
`;

const Select = styled.select`
  padding: 0.8rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: #ff6b35;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const OrderSummary = styled.div`
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 10px;
  margin: 1rem 0;
  border: 2px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 0;
  border-bottom: 1px solid #ddd;
  color: #333;
  font-size: 1rem;
  
  &:last-child {
    border-bottom: none;
    font-weight: bold;
    font-size: 1.2rem;
    color: #ff6b35;
    background: #fff5f0;
    padding: 1rem;
    border-radius: 8px;
    margin-top: 0.5rem;
  }
  
  span:first-child {
    color: #555;
    font-weight: 500;
  }
  
  span:last-child {
    color: #333;
    font-weight: 600;
  }
`;

const DeliveryInfo = styled.div`
  background: #e8f5e8;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  border-left: 4px solid #4caf50;
  color: #2e7d32;
  
  strong {
    color: #1b5e20;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
`;

const CancelButton = styled(Button)`
  background: #f5f5f5;
  color: #333;
  
  &:hover {
    background: #e0e0e0;
  }
`;

const ConfirmButton = styled(Button)`
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  color: white;
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #e55a2b, #e8851a);
    transform: translateY(-2px);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c53030;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid #fed7d7;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.div`
  background: #f0fff4;
  color: #38a169;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid #9ae6b4;
  margin-bottom: 1rem;
`;

const Checkout = ({ onClose, onSuccess }) => {
  const { items, getTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    // Dados pessoais
    name: '',
    email: '',
    phone: '',
    
    // Endereço
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Entrega
    deliveryMethod: 'delivery',
    paymentMethod: 'money'
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');
    
    // Limpar erro do campo específico
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: false
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Validações obrigatórias
    if (!formData.name || formData.name.length < 2) errors.name = true;
    if (!formData.email || !formData.email.includes('@')) errors.email = true;
    if (!formData.phone || formData.phone.length < 10) errors.phone = true;
    
    if (formData.deliveryMethod === 'delivery') {
      if (!formData.street) errors.street = true;
      if (!formData.number) errors.number = true;
      if (!formData.neighborhood) errors.neighborhood = true;
      if (!formData.city) errors.city = true;
      if (!formData.state) errors.state = true;
      if (!formData.zipCode || formData.zipCode.length < 8) errors.zipCode = true;
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculateDeliveryFee = () => {
    if (formData.deliveryMethod === 'pickup') return 0;
    // Aqui você pode implementar lógica de cálculo baseada na distância
    // Por enquanto, entrega gratuita até 1km (simulado)
    return 0; // Entrega gratuita
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Por favor, corrija os campos destacados');
      return;
    }
    
    if (items.length === 0) {
      setError('Seu carrinho está vazio. Adicione produtos antes de finalizar o pedido.');
      return;
    }
    
    setIsProcessing(true);
    setError('');
    setSuccess('');
    
    try {
      const deliveryFee = calculateDeliveryFee();
      const total = getTotal() + deliveryFee;
      
      const orderData = {
        items: items,
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        address: formData.deliveryMethod === 'delivery' ? {
          street: formData.street,
          number: formData.number,
          complement: formData.complement,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        } : null,
        delivery: {
          method: formData.deliveryMethod,
          fee: deliveryFee
        },
        payment: {
          method: formData.paymentMethod
        },
        total: total,
        subtotal: getTotal()
      };
      
      console.log('Enviando pedido:', orderData);
      
      const response = await orderService.create(orderData);
      
      console.log('Resposta do servidor:', response);
      
      if (response && response.data && response.data.success) {
        try {
          // Tentar enviar email de confirmação
          await orderService.sendConfirmationEmail({
            ...orderData,
            orderId: response.data.orderId
          });
          
          setSuccess(`✅ Pedido realizado com sucesso!\n📧 Número: ${response.data.orderId}\n📬 Email de confirmação enviado para ${formData.email}`);
        } catch (emailError) {
          console.warn('Erro ao enviar email:', emailError);
          setSuccess(`✅ Pedido realizado com sucesso!\n📧 Número: ${response.data.orderId}\n⚠️ Email de confirmação não pôde ser enviado, mas seu pedido foi processado.`);
        }
        
        setTimeout(() => {
          clearCart();
          onSuccess && onSuccess(response.data);
          onClose();
        }, 4000);
      } else {
        throw new Error('Resposta inválida do servidor');
      }
    } catch (error) {
      console.error('Erro detalhado ao finalizar pedido:', error);
      
      let errorMessage = 'Erro ao processar pedido. Tente novamente.';
      
      if (error.response) {
        // Erro da API
        errorMessage = error.response.data?.message || `Erro do servidor: ${error.response.status}`;
      } else if (error.request) {
        // Erro de rede
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      } else if (error.message) {
        // Outros erros
        errorMessage = error.message;
      }
      
      setError(`❌ ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const deliveryFee = calculateDeliveryFee();
  const total = getTotal() + deliveryFee;

  return (
    <Overlay onClick={onClose}>
      <CheckoutContainer onClick={(e) => e.stopPropagation()}>
        <CheckoutHeader>
          <h2>🛒 Finalizar Pedido</h2>
          <CloseButton onClick={onClose}>×</CloseButton>
        </CheckoutHeader>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <Form onSubmit={handleSubmit}>
          {/* Dados Pessoais */}
          <Section>
            <SectionTitle>👤 Dados Pessoais</SectionTitle>
            
            <InputGroup>
              <Label>Nome Completo *</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Seu nome completo"
                className={fieldErrors.name ? 'error' : ''}
                required
              />
            </InputGroup>
            
            <Row>
              <InputGroup>
                <Label>Email *</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="seu@email.com"
                  className={fieldErrors.email ? 'error' : ''}
                  required
                />
              </InputGroup>
              
              <InputGroup>
                <Label>Telefone *</Label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(11) 99999-9999"
                  className={fieldErrors.phone ? 'error' : ''}
                  required
                />
              </InputGroup>
            </Row>
          </Section>

          {/* Método de Entrega */}
          <Section>
            <SectionTitle>🚚 Entrega</SectionTitle>
            
            <InputGroup>
              <Label>Método de Entrega</Label>
              <Select
                name="deliveryMethod"
                value={formData.deliveryMethod}
                onChange={handleInputChange}
              >
                <option value="delivery">Entrega em casa (Grátis até 1km)</option>
                <option value="pickup">Retirar na loja</option>
              </Select>
            </InputGroup>
            
            {formData.deliveryMethod === 'delivery' && (
              <>
                <Row>
                  <InputGroup>
                    <Label>Rua/Avenida *</Label>
                    <Input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      placeholder="Nome da rua"
                      className={fieldErrors.street ? 'error' : ''}
                      required
                    />
                  </InputGroup>
                  
                  <InputGroup>
                    <Label>Número *</Label>
                    <Input
                      type="text"
                      name="number"
                      value={formData.number}
                      onChange={handleInputChange}
                      placeholder="123"
                      className={fieldErrors.number ? 'error' : ''}
                      required
                    />
                  </InputGroup>
                </Row>
                
                <InputGroup>
                  <Label>Complemento</Label>
                  <Input
                    type="text"
                    name="complement"
                    value={formData.complement}
                    onChange={handleInputChange}
                    placeholder="Apartamento, bloco, etc."
                  />
                </InputGroup>
                
                <Row>
                  <InputGroup>
                    <Label>Bairro *</Label>
                    <Input
                      type="text"
                      name="neighborhood"
                      value={formData.neighborhood}
                      onChange={handleInputChange}
                      placeholder="Nome do bairro"
                      className={fieldErrors.neighborhood ? 'error' : ''}
                      required
                    />
                  </InputGroup>
                  
                  <InputGroup>
                    <Label>CEP *</Label>
                    <Input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="00000-000"
                      className={fieldErrors.zipCode ? 'error' : ''}
                      required
                    />
                  </InputGroup>
                </Row>
                
                <Row>
                  <InputGroup>
                    <Label>Cidade *</Label>
                    <Input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Nome da cidade"
                      className={fieldErrors.city ? 'error' : ''}
                      required
                    />
                  </InputGroup>
                  
                  <InputGroup>
                    <Label>Estado *</Label>
                    <Select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={fieldErrors.state ? 'error' : ''}
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="SP">São Paulo</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="RS">Rio Grande do Sul</option>
                      <option value="PR">Paraná</option>
                      <option value="SC">Santa Catarina</option>
                      {/* Adicione outros estados conforme necessário */}
                    </Select>
                  </InputGroup>
                </Row>
                
                <DeliveryInfo>
                  <strong>🎉 Entrega Gratuita!</strong><br />
                  Entregamos gratuitamente em um raio de 1km da nossa loja.
                  Tempo estimado: 30-45 minutos.
                </DeliveryInfo>
              </>
            )}
            
            {formData.deliveryMethod === 'pickup' && (
              <DeliveryInfo>
                <strong>📍 Retirada na Loja</strong><br />
                Rua das Flores, 123 - Centro<br />
                Horário: Segunda a Sábado, 7h às 20h
              </DeliveryInfo>
            )}
          </Section>

          {/* Pagamento */}
          <Section>
            <SectionTitle>💳 Pagamento</SectionTitle>
            
            <InputGroup>
              <Label>Forma de Pagamento</Label>
              <Select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
              >
                <option value="money">Dinheiro</option>
                <option value="card">Cartão (na entrega)</option>
                <option value="pix">PIX</option>
              </Select>
            </InputGroup>
          </Section>

          {/* Resumo do Pedido */}
          <OrderSummary>
            <SectionTitle>📋 Resumo do Pedido</SectionTitle>
            
            {items.map(item => (
              <OrderItem key={item.id}>
                <span>{item.name} (x{item.quantity})</span>
                <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
              </OrderItem>
            ))}
            
            <OrderItem>
              <span>Subtotal</span>
              <span>R$ {getTotal().toFixed(2)}</span>
            </OrderItem>
            
            <OrderItem>
              <span>Taxa de Entrega</span>
              <span>{deliveryFee === 0 ? 'Grátis' : `R$ ${deliveryFee.toFixed(2)}`}</span>
            </OrderItem>
            
            <OrderItem>
              <span>Total</span>
              <span>R$ {total.toFixed(2)}</span>
            </OrderItem>
          </OrderSummary>

          <ButtonGroup>
            <CancelButton type="button" onClick={onClose}>
              Cancelar
            </CancelButton>
            <ConfirmButton type="submit" disabled={isProcessing}>
              {isProcessing ? 'Processando...' : '🎉 Confirmar Pedido'}
            </ConfirmButton>
          </ButtonGroup>
        </Form>
      </CheckoutContainer>
    </Overlay>
  );
};

export default Checkout;