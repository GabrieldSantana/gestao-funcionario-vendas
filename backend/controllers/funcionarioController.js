const Funcionario = require('../models/funcionario');
const bcrypt = require('bcryptjs');

// Criar novo Funcionario
exports.createFuncionario = async (req, res) => {
    try {
        const { nome, senha, perfil } = req.body;
        const funcionario = new Funcionario({ nome, senha, perfil });
        await funcionario.save();
        res.status(201).json(funcionario);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Listar todos os Funcionarios
exports.getFuncionarios = async (req, res) => {
    try {
        const funcionarios = await Funcionario.find();
        res.status(200).json(funcionarios);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Buscar um Funcionario específico por ID
exports.getFuncionarioById = async (req, res) => {
    try {
        const funcionario = await Funcionario.findById(req.params.id);
        if (!funcionario) {
            return res.status(404).json({ message: 'Funcionário não encontrado' });
        }
        res.status(200).json(funcionario);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Fazer login
exports.login = async (req, res) => {
    const { nome, senha } = req.body;
    try {
        const funcionario = await Funcionario.findOne({ nome });
        if (!funcionario) return res.status(400).json({ message: 'Funcionário não encontrado' });

        const isMatch = await bcrypt.compare(senha, funcionario.senha);
        if (!isMatch) return res.status(400).json({ message: 'Senha incorreta' });

        // Não retornar a senha no response
        const { senha: _, ...funcionarioSemSenha } = funcionario.toObject();
        res.status(200).json({ message: 'Login bem-sucedido', funcionario: funcionarioSemSenha });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Atualizar Funcionario
exports.updateFuncionario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, senha, perfil } = req.body;

        const updateData = { nome, perfil };
        if (senha) {
            const salt = await bcrypt.genSalt(10);
            updateData.senha = await bcrypt.hash(senha, salt);
        }

        const updatedFuncionario = await Funcionario.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );
        if (!updatedFuncionario) return res.status(404).json({ message: 'Funcionário não encontrado' });

        res.status(200).json(updatedFuncionario);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Excluir Funcionario
exports.deleteFuncionario = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedFuncionario = await Funcionario.findByIdAndDelete(id);
        if (!deletedFuncionario) return res.status(404).json({ message: 'Funcionário não encontrado' });

        res.status(200).json({ message: 'Funcionário excluído com sucesso' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};