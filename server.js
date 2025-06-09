const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Simulação de banco de dados em memória (para desenvolvimento)
let users = [];
let orders = [];
let nextUserId = 1;
let nextOrderId = 1;

// Chave secreta para JWT (em produção, use uma variável de ambiente)
const JWT_SECRET = 'sua_chave_secreta_aqui';

// Configuração do Nodemailer - IMPORTANTE: Configure com sua senha de app do Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'fadul34ro@gmail.com',
    pass: 'kykc khst hrxn iwcg' // ⚠️ SUBSTITUA por uma senha de app válida do Gmail
  }
});

// ==================== ROTAS DE AUTENTICAÇÃO ====================

// Rota de cadastro
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validação dos dados
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nome, email e senha são obrigatórios'
      });
    }

    // Verificar se o email já existe
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Este email já está cadastrado'
      });
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de email inválido'
      });
    }

    // Validar senha
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'A senha deve ter pelo menos 6 caracteres'
      });
    }

    // Criptografar senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Criar novo usuário
    const newUser = {
      id: nextUserId++,
      name,
      email,
      password: hashedPassword,
      phone: phone || '',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // Gerar token JWT
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remover senha da resposta
    const userResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone
    };

    console.log(`✅ Novo usuário cadastrado: ${email}`);

    res.status(201).json({
      success: true,
      message: 'Usuário cadastrado com sucesso!',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('❌ Erro no cadastro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Rota de login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validação dos dados
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios'
      });
    }

    // Buscar usuário
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remover senha da resposta
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone
    };

    console.log(`✅ Login realizado: ${email}`);

    res.json({
      success: true,
      message: 'Login realizado com sucesso!',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('❌ Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// ==================== ROTAS DE PEDIDOS ====================

// Rota para criar pedido (integrada com envio de email)
app.post('/api/pedidos', async (req, res) => {
  try {
    const orderData = req.body;
    
    // Gerar ID do pedido
    const orderId = `ORD-${Date.now()}`;
    
    // Criar pedido
    const newOrder = {
      id: orderId,
      ...orderData,
      status: 'confirmado',
      createdAt: new Date().toISOString()
    };
    
    orders.push(newOrder);
    
    console.log(`📦 Novo pedido criado: ${orderId}`);
    
    // Tentar enviar email de confirmação automaticamente
    try {
      if (orderData.customer && orderData.customer.email) {
        await sendConfirmationEmail({
          customerEmail: orderData.customer.email,
          customerName: orderData.customer.name,
          orderDetails: orderData.items,
          total: orderData.total,
          orderId: orderId
        });
        
        console.log(`📧 Email enviado automaticamente para: ${orderData.customer.email}`);
      }
    } catch (emailError) {
      console.warn('⚠️ Erro ao enviar email automaticamente:', emailError.message);
      // Não falha o pedido se o email não for enviado
    }
    
    res.json({
      success: true,
      orderId: orderId,
      message: 'Pedido criado com sucesso!',
      order: newOrder
    });
    
  } catch (error) {
    console.error('❌ Erro ao criar pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao criar pedido'
    });
  }
});

// ==================== FUNÇÕES DE EMAIL ====================

// Função para enviar email de confirmação
async function sendConfirmationEmail({ customerEmail, customerName, orderDetails, total, orderId }) {
  // Gerar lista de produtos para o email
  const productsList = orderDetails.map(item => 
    `<tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">R$ ${item.price.toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">R$ ${(item.price * item.quantity).toFixed(2)}</td>
    </tr>`
  ).join('');

  // Template HTML do email
  const htmlTemplate = `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="utf-8">
      <title>Confirmação de Pedido</title>
      <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .order-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .order-table th { background-color: #4CAF50; color: white; padding: 12px; text-align: left; }
          .order-table td { padding: 10px; border-bottom: 1px solid #eee; }
          .total { font-size: 18px; font-weight: bold; color: #4CAF50; }
          .footer { text-align: center; padding: 20px; color: #666; }
          .order-id { background-color: #e8f5e8; padding: 10px; border-radius: 5px; margin: 15px 0; }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>🛒 Fresh Mercado Express</h1>
              <h2>Confirmação de Pedido</h2>
          </div>
          
          <div class="content">
              <p>Olá <strong>${customerName}</strong>,</p>
              
              <p>Obrigado por sua compra! Seu pedido foi confirmado com sucesso.</p>
              
              <div class="order-id">
                  <strong>📋 Número do Pedido: ${orderId}</strong>
              </div>
              
              <h3>🛍️ Detalhes do Pedido:</h3>
              <table class="order-table">
                  <thead>
                      <tr>
                          <th>Produto</th>
                          <th style="text-align: center;">Quantidade</th>
                          <th style="text-align: right;">Preço Unit.</th>
                          <th style="text-align: right;">Subtotal</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${productsList}
                  </tbody>
              </table>
              
              <div style="text-align: right; margin-top: 20px;">
                  <p class="total">💰 Total: R$ ${total.toFixed(2)}</p>
              </div>
              
              <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
                  <h4>📞 Próximos Passos:</h4>
                  <ul>
                      <li>Seu pedido está sendo preparado</li>
                      <li>Você receberá uma notificação quando estiver pronto para retirada</li>
                      <li>Em caso de dúvidas, entre em contato conosco</li>
                      <li>Guarde o número do pedido: <strong>${orderId}</strong></li>
                  </ul>
              </div>
              
              <p>Agradecemos sua preferência!</p>
              <p><strong>Equipe Fresh Mercado Express</strong></p>
          </div>
          
          <div class="footer">
              <p>Este é um email automático, não responda.</p>
              <p>© 2025 Fresh Mercado Express - Todos os direitos reservados</p>
          </div>
      </div>
  </body>
  </html>
  `;

  // Configuração do email
  const mailOptions = {
    from: 'fadul34ro@gmail.com',
    to: customerEmail,
    subject: `🛒 Confirmação de Pedido ${orderId} - Fresh Mercado Express`,
    html: htmlTemplate
  };

  // Enviar email
  await transporter.sendMail(mailOptions);
}

// Rota manual para envio de email (compatibilidade com frontend atual)
app.post('/api/send-confirmation-email', async (req, res) => {
  try {
    const { orderData } = req.body;
    
    // Extrair dados do orderData se vier nesse formato
    let customerEmail, customerName, orderDetails, total, orderId;
    
    if (orderData) {
      customerEmail = orderData.customer?.email;
      customerName = orderData.customer?.name;
      orderDetails = orderData.items;
      total = orderData.total;
      orderId = orderData.orderId || `ORD-${Date.now()}`;
    } else {
      // Formato antigo (compatibilidade)
      ({ customerEmail, customerName, orderDetails, total } = req.body);
      orderId = `ORD-${Date.now()}`;
    }

    // Validação dos dados
    if (!customerEmail || !customerName || !orderDetails || !total) {
      return res.status(400).json({ 
        success: false, 
        message: 'Dados incompletos para envio do email' 
      });
    }

    // Enviar email
    await sendConfirmationEmail({
      customerEmail,
      customerName,
      orderDetails,
      total,
      orderId
    });
    
    console.log(`📧 Email de confirmação enviado para: ${customerEmail}`);
    
    res.json({ 
      success: true, 
      message: 'Email de confirmação enviado com sucesso!' 
    });

  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor ao enviar email',
      error: error.message 
    });
  }
});

// ==================== ROTAS DE CONSULTA ====================

// Rota para listar pedidos
app.get('/api/pedidos', (req, res) => {
  res.json({
    success: true,
    orders: orders
  });
});

// Rota para buscar pedido por ID
app.get('/api/pedidos/:id', (req, res) => {
  const { id } = req.params;
  const order = orders.find(o => o.id === id);
  
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Pedido não encontrado'
    });
  }
  
  res.json({
    success: true,
    order: order
  });
});

// ==================== ROTAS DE TESTE ====================

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Servidor backend funcionando!',
    timestamp: new Date().toISOString(),
    users: users.length,
    orders: orders.length
  });
});

// Rota para testar email
app.post('/api/test-email', async (req, res) => {
  try {
    const testEmail = {
      customerEmail: 'teste@exemplo.com',
      customerName: 'Cliente Teste',
      orderDetails: [
        { name: 'Produto Teste', quantity: 1, price: 10.00 }
      ],
      total: 10.00,
      orderId: 'TEST-001'
    };
    
    await sendConfirmationEmail(testEmail);
    
    res.json({
      success: true,
      message: 'Email de teste enviado com sucesso!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao enviar email de teste',
      error: error.message
    });
  }
});

// Rota para listar usuários (apenas para desenvolvimento)
app.get('/api/users', (req, res) => {
  const usersWithoutPasswords = users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt
  }));
  
  res.json({ 
    success: true, 
    users: usersWithoutPasswords 
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📧 Serviço de email configurado e pronto!`);
  console.log(`🔐 Sistema de autenticação ativo!`);
  console.log(`\n📋 Rotas disponíveis:`);
  console.log(`   POST /api/auth/register - Cadastro de usuário`);
  console.log(`   POST /api/auth/login - Login de usuário`);
  console.log(`   POST /api/pedidos - Criar pedido (com email automático)`);
  console.log(`   GET  /api/pedidos - Listar pedidos`);
  console.log(`   GET  /api/pedidos/:id - Buscar pedido por ID`);
  console.log(`   POST /api/send-confirmation-email - Envio manual de email`);
  console.log(`   POST /api/test-email - Teste de email`);
  console.log(`   GET  /api/test - Teste do servidor`);
  console.log(`   GET  /api/users - Listar usuários\n`);
  
  // Verificar configuração de email
  console.log(`⚠️  IMPORTANTE: Configure a senha de app do Gmail na linha 19!`);
  console.log(`   Substitua 'sua_senha_de_app_aqui' por uma senha de app válida.\n`);
});