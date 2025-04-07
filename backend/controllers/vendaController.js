const Venda = require('../models/venda');

// Criar nova plantação
exports.createVenda = async (req, res) => {
    try {
        const { produto, descricao, responsavel } = req.body;
        const venda = new Venda({ produto, descricao, responsavel });
        await venda.save();
        res.status(201).json(venda);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Listar todas as plantações
exports.getVendas = async (req, res) => {
    try {
        const vendas = await Venda.find().populate('responsavel', 'nome');
        res.status(200).json(vendas);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getVendaById = async (req, res) => {
    try {
        const venda = await Venda.findById(req.params.id).populate('responsavel', 'nome');
        if (!venda) {
            return res.status(404).json({ message: 'Venda não encontrada' });
        }
        res.status(200).json(venda);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Atualizar venda
exports.updateVenda = async (req, res) => {
    try {
        const { id } = req.params;
        const { produto, descricao, responsavel } = req.body;

        const updatedVenda = await Venda.findByIdAndUpdate(id, { produto, descricao, responsavel }, { new: true });
        if (!updatedVenda) return res.status(404).json({ message: 'Venda não encontrada' });

        res.status(200).json(updatedVenda);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Excluir Venda
exports.deleteVenda = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedVenda = await Venda.findByIdAndDelete(id);
        if (!deletedVenda) return res.status(404).json({ message: 'Venda não encontrada' });

        res.status(200).json({ message: 'Venda excluída com sucesso' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
