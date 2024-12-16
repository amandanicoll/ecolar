// Verifica se há um username no localStorage
const storedUserName = localStorage.getItem('userName');

// Seleciona o elemento com ID 'username'
const usernameElement = document.getElementById('username');

// Atualiza o conteúdo do span com o username, ou mantém o padrão 'Usuário!' se não houver nada no localStorage
if (storedUserName) {
    usernameElement.textContent = storedUserName;
} else {
    usernameElement.textContent = 'Usuário!'; // Valor padrão
}