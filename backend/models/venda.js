const mongoose = require('mongoose');

const vendaSchema = new mongoose.Schema({
    produto: { type: String, required: true },
    descricao: { type: String, required: true },
    responsavel: { type: mongoose.Schema.Types.ObjectId, ref: 'Funcionario', required: true }
});

const Venda = mongoose.model('Venda', vendaSchema);

module.exports = Venda;
