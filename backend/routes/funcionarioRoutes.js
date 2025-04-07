const express = require('express');
const router = express.Router();
const { createFuncionario, getFuncionarios, login, updateFuncionario, deleteFuncionario, getFuncionarioById } = require('../controllers/funcionarioController');

// Rotas de funcionarios
router.post('/', createFuncionario);
router.get('/', getFuncionarios);
router.get('/:id', getFuncionarioById);
router.post('/login', login);
router.put('/:id', updateFuncionario); // Rota para atualizar funcionario
router.delete('/:id', deleteFuncionario); // Rota para deletar funcionario

module.exports = router;
