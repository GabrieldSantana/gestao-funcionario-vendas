
const API_URL = 'http://localhost:3000/api/funcionarios';
let editingId = null;

const userModal = new bootstrap.Modal(document.getElementById('userModal'));
const userForm = document.getElementById('userForm');
const addUserBtn = document.getElementById('addUserBtn');
const modalTitle = document.getElementById('modalTitle');
const usersTableBody = document.getElementById('usersTableBody');

document.addEventListener('DOMContentLoaded', loadFuncionarios);

addUserBtn.onclick = () => {
    editingId = null;
    modalTitle.textContent = 'Adicionar Funcionário';
    userForm.reset();
    userModal.show();
};

async function loadFuncionarios() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erro na resposta da API');
        const funcionarios = await response.json();
        usersTableBody.innerHTML = '';
        funcionarios.forEach(func => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${func._id}</td>
                <td>${func.nome}</td>
                <td>${func.perfil}</td>
                <td>
                    <button class="btn btn-sm btn-warning action-btn" onclick="editFuncionario('${func._id}')">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteFuncionario('${func._id}')">Excluir</button>
                </td>
            `;
            usersTableBody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao carregar funcionários:', error);
        alert('Erro ao carregar funcionários');
    }
}

userForm.onsubmit = async (e) => {
    e.preventDefault();
    const funcionarioData = {
        nome: document.getElementById('nome').value,
        senha: document.getElementById('senha').value,
        perfil: document.getElementById('perfil').value
    };

    try {
        const url = editingId ? `${API_URL}/${editingId}` : API_URL;
        const method = editingId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(funcionarioData)
        });

        if (response.ok) {
            userModal.hide();
            loadFuncionarios();
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao salvar funcionário');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert(error.message);
    }
};

async function editFuncionario(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error('Funcionário não encontrado');
        const funcionario = await response.json();
        editingId = id;
        modalTitle.textContent = 'Editar Funcionário';
        document.getElementById('nome').value = funcionario.nome;
        document.getElementById('perfil').value = funcionario.perfil;
        // Não preenchemos a senha por segurança
        userModal.show();
    } catch (error) {
        console.error('Erro ao carregar funcionário:', error);
        alert('Erro ao carregar funcionário');
    }
}

async function deleteFuncionario(id) {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                loadFuncionarios();
            } else {
                throw new Error('Erro ao deletar funcionário');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao deletar funcionário');
        }
    }
}