const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const funcionarioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    senha: { type: String, required: true },
    perfil: { type: String, enum: ['admin', 'funcionario'], required: true }
});

// Middleware para criptografar senha antes de salvar
funcionarioSchema.pre('save', async function (next) {
    if (!this.isModified('senha')) return next();
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
});

const Funcionario = mongoose.model('Funcionario', funcionarioSchema);

module.exports = Funcionario;
