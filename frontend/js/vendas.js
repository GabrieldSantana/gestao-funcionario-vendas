const API_URL_FUNCIONARIOS = 'http://localhost:3000/api/funcionarios';
const API_URL_VENDAS = 'http://localhost:3000/api/vendas';
let editingId = null;

const vendaModal = new bootstrap.Modal(document.getElementById('vendaModal'));
const vendaForm = document.getElementById('vendaForm');
const addVendaBtn = document.getElementById('addVendaBtn');
const modalTitleVenda = document.getElementById('modalTitleVenda');
const vendasTableBody = document.getElementById('vendasTableBody');
const responsavelSelect = document.getElementById('responsavel');

document.addEventListener('DOMContentLoaded', () => {
    loadFuncionarios();
    loadVendas();
});

addVendaBtn.onclick = () => {
    editingId = null;
    modalTitleVenda.textContent = 'Adicionar Venda';
    vendaForm.reset();
    vendaModal.show();
};

async function loadFuncionarios() {
    try {
        const response = await fetch(API_URL_FUNCIONARIOS);
        if (!response.ok) throw new Error('Erro ao carregar funcionários');
        const funcionarios = await response.json();
        responsavelSelect.innerHTML = '<option value="">Selecione um responsável</option>';
        funcionarios.forEach(func => {
            const option = document.createElement('option');
            option.value = func._id;
            option.textContent = func.nome;
            responsavelSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar funcionários:', error);
        alert('Erro ao carregar funcionários');
    }
}

async function loadVendas() {
    try {
        const response = await fetch(API_URL_VENDAS);
        if (!response.ok) throw new Error('Erro ao carregar vendas');
        const vendas = await response.json();
        vendasTableBody.innerHTML = '';
        vendas.forEach(venda => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${venda._id}</td>
                <td>${venda.produto}</td>
                <td>${venda.descricao}</td>
                <td>${venda.responsavel ? venda.responsavel.nome : 'Sem responsável'}</td>
                <td>
                    <button class="btn btn-sm btn-warning action-btn" onclick="editVenda('${venda._id}')">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteVenda('${venda._id}')">Excluir</button>
                </td>
            `;
            vendasTableBody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao carregar vendas:', error);
        alert('Erro ao carregar vendas');
    }
}

vendaForm.onsubmit = async (e) => {
    e.preventDefault();
    const vendaData = {
        produto: document.getElementById('produto').value,
        descricao: document.getElementById('descricao').value,
        responsavel: document.getElementById('responsavel').value
    };

    try {
        const url = editingId ? `${API_URL_VENDAS}/${editingId}` : API_URL_VENDAS;
        const method = editingId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vendaData)
        });

        if (response.ok) {
            vendaModal.hide();
            loadVendas();
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao salvar venda');
        }
    } catch (error) {
        console.error('Erro ao salvar venda:', error);
        alert(`Erro ao salvar venda: ${error.message}`);
    }
};

async function editVenda(id) {
    try {
        const response = await fetch(`${API_URL_VENDAS}/${id}`);
        if (!response.ok) throw new Error('Venda não encontrada');
        const venda = await response.json();
        editingId = id;
        modalTitleVenda.textContent = 'Editar Venda';
        document.getElementById('produto').value = venda.produto;
        document.getElementById('descricao').value = venda.descricao;
        document.getElementById('responsavel').value = venda.responsavel._id;
        vendaModal.show();
    } catch (error) {
        console.error('Erro ao carregar venda:', error);
        alert('Erro ao carregar venda');
    }
}

async function deleteVenda(id) {
    if (confirm('Tem certeza que deseja excluir esta venda?')) {
        try {
            const response = await fetch(`${API_URL_VENDAS}/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                loadVendas();
            } else {
                throw new Error('Erro ao deletar venda');
            }
        } catch (error) {
            console.error('Erro ao deletar venda:', error);
            alert('Erro ao deletar venda');
        }
    }
}