const express = require('express');
const router = express.Router();
const { createVenda, getVendas, updateVenda, deleteVenda, getVendaById } = require('../controllers/vendaController');

// Rotas de vendas
router.post('/', createVenda);
router.get('/', getVendas);
router.get('/:id', getVendaById);
router.put('/:id', updateVenda); // Rota para atualizar vendas
router.delete('/:id', deleteVenda); // Rota para deletar vendas

module.exports = router;
