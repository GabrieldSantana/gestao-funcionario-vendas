const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const funcionarioRoutes = require('./routes/funcionarioRoutes');
const vendaRoutes = require('./routes/vendaRoutes');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parse de JSON
app.use(express.json());

app.use(cors());

// Carregar os modelos explicitamente
require('./models/funcionario'); // Carrega o modelo Funcionario
require('./models/venda');       // Carrega o modelo Venda

// Conectando ao MongoDB
mongoose.connect('mongodb://localhost:27017/gestaoVendas', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado ao MongoDB!');
}).catch(err => {
    console.log('Erro ao conectar ao MongoDB:', err);
});

// Usando rotas
app.use('/api/funcionarios', funcionarioRoutes);
app.use('/api/vendas', vendaRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
