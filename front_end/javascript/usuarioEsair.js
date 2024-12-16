const logoutButton = document.getElementById('logout');

// Função para carregar o nome do usuário do localStorage
function loadUserName() {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
        usernameElement.textContent = storedUserName;
    } else {
        usernameElement.textContent = 'Usuário!';
    }
}

// Função para realizar logout
function logout() {
    // Remover o nome do usuário do localStorage
    localStorage.clear();
    // Redirecionar para a página de login
    window.location.href = '../index.html'; // Exemplo de redirecionamento
}

// Evento para o botão de logout
logoutButton.addEventListener('click', logout);

// Chamar a função para carregar o nome do usuário ao abrir a página
document.addEventListener('DOMContentLoaded', loadUserName);
