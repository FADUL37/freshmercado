const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Dados mockados
const produtos = [
  {
    id: 1,
    nome: 'Maçã Gala',
    preco: 4.99,
    categoria: 'frutas',
    imagem: '/images/maca.jpg',
    oferta: true,
    precoOriginal: 6.99
  },
  {
    id: 2,
    nome: 'Banana Prata',
    preco: 3.49,
    categoria: 'frutas',
    imagem: '/images/banana.jpg'
  },
  {
    id: 3,
    nome: 'Alface Americana',
    preco: 2.99,
    categoria: 'verduras',
    imagem: '/images/alface.jpg'
  },
  {
    id: 4,
    nome: 'Carne Bovina',
    preco: 29.99,
    categoria: 'carnes',
    imagem: '/images/carne.jpg',
    oferta: true,
    precoOriginal: 34.99
  }
];

const usuarios = [];

// Rotas
app.get('/api/produtos', (req, res) => {
  res.json(produtos);
});

app.get('/api/produtos/categoria/:categoria', (req, res) => {
  const categoria = req.params.categoria;
  const produtosFiltrados = produtos.filter(p => p.categoria === categoria);
  res.json(produtosFiltrados);
});

app.get('/api/ofertas', (req, res) => {
  const ofertas = produtos.filter(p => p.oferta);
  res.json(ofertas);
});

app.post('/api/login', (req, res) => {
  const { email, senha } = req.body;
  // Simulação de login
  if (email && senha) {
    res.json({ 
      success: true, 
      user: { id: 1, nome: email.split('@')[0], email },
      token: 'fake-jwt-token'
    });
  } else {
    res.status(401).json({ success: false, message: 'Credenciais inválidas' });
  }
});

app.post('/api/pedidos', (req, res) => {
  const { carrinho, usuario, endereco, pagamento } = req.body;
  const pedido = {
    id: Date.now(),
    carrinho,
    usuario,
    endereco,
    pagamento,
    status: 'confirmado',
    data: new Date().toISOString()
  };
  res.json({ success: true, pedido });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});