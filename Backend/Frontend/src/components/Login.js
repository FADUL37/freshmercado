import React, { useState } from 'react';
import { authService } from '../services/api';
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

const LoginContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  width: 400px;
  max-width: 90vw;
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  color: #333;
  margin: 0 0 0.5rem 0;
`;

const Subtitle = styled.p`
  color: #666;
  margin: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  flex: 1;
  padding: 0.8rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
`;

const LoginButton = styled(Button)`
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

const CancelButton = styled(Button)`
  background: #f5f5f5;
  color: #333;
  
  &:hover {
    background: #e0e0e0;
  }
`;

const ToggleMode = styled.button`
  background: none;
  border: none;
  color: #ff6b35;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 1rem;
  width: 100%;
  
  &:hover {
    color: #e55a2b;
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

const PasswordRequirements = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.3rem;
  
  ul {
    margin: 0.3rem 0 0 1rem;
    padding: 0;
  }
  
  li {
    margin: 0.2rem 0;
  }
`;

const Login = ({ onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');
    setSuccess('');
    
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
    
    if (!isLogin && (!formData.name || formData.name.length < 2)) {
      errors.name = true;
    }
    
    if (!formData.email || !formData.email.includes('@')) {
      errors.email = true;
    }
    
    if (!formData.password || formData.password.length < 6) {
      errors.password = true;
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Por favor, corrija os campos destacados');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        const response = await authService.login({
          email: formData.email,
          password: formData.password
        });
        
        if (response.data.success) {
          setSuccess('Login realizado com sucesso!');
          setTimeout(() => {
            onLogin(response.data.user);
          }, 1000);
        }
      } else {
        const response = await authService.register(formData);
        
        if (response.data.success) {
          setSuccess('Cadastro realizado com sucesso! Bem-vindo!');
          setTimeout(() => {
            onLogin(response.data.user);
          }, 1500);
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao processar solicitação');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <LoginContainer onClick={(e) => e.stopPropagation()}>
        <LoginHeader>
          <Title>{isLogin ? '🔐 Entrar' : '📝 Cadastrar'}</Title>
          <Subtitle>
            {isLogin ? 'Acesse sua conta' : 'Crie sua conta gratuitamente'}
          </Subtitle>
        </LoginHeader>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <Form onSubmit={handleSubmit}>
          {!isLogin && (
            <InputGroup>
              <Label>Nome Completo</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required={!isLogin}
                placeholder="Seu nome completo"
                className={fieldErrors.name ? 'error' : ''}
              />
              {fieldErrors.name && (
                <span style={{color: '#e53e3e', fontSize: '0.8rem'}}>
                  Nome deve ter pelo menos 2 caracteres
                </span>
              )}
            </InputGroup>
          )}
          
          <InputGroup>
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="seu@email.com"
              className={fieldErrors.email ? 'error' : ''}
            />
            {fieldErrors.email && (
              <span style={{color: '#e53e3e', fontSize: '0.8rem'}}>
                Digite um email válido
              </span>
            )}
          </InputGroup>
          
          <InputGroup>
            <Label>Senha</Label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Sua senha"
              className={fieldErrors.password ? 'error' : ''}
            />
            {!isLogin && (
              <PasswordRequirements>
                <strong>Requisitos da senha:</strong>
                <ul>
                  <li>Mínimo de 6 caracteres</li>
                  <li>Recomendado: letras, números e símbolos</li>
                </ul>
              </PasswordRequirements>
            )}
            {fieldErrors.password && (
              <span style={{color: '#e53e3e', fontSize: '0.8rem'}}>
                Senha deve ter pelo menos 6 caracteres
              </span>
            )}
          </InputGroup>
          
          <ButtonGroup>
            <CancelButton type="button" onClick={onClose}>
              Cancelar
            </CancelButton>
            <LoginButton type="submit" disabled={isLoading}>
              {isLoading ? 'Processando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
            </LoginButton>
          </ButtonGroup>
        </Form>
        
        <ToggleMode onClick={() => {
          setIsLogin(!isLogin);
          setError('');
          setSuccess('');
          setFieldErrors({});
          setFormData({ name: '', email: '', password: '' });
        }}>
          {isLogin ? 'Não tem conta? Cadastre-se gratuitamente' : 'Já tem conta? Entre aqui'}
        </ToggleMode>
      </LoginContainer>
    </Overlay>
  );
};

export default Login;