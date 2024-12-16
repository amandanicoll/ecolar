// Selecionando os elementos HTML
const loginButton = document.querySelector('.botaoLogin');
const userNameInput = document.getElementById('userName');
const senhaInput = document.getElementById('senha');

// Função para realizar o login
async function realizarLogin() {
    const email = userNameInput.value;
    const senha = senhaInput.value;

    // Verificar se os campos de email e senha estão preenchidos
    if (!email || !senha) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Criar o corpo da requisição
    const body = {
        email: email,
        senha: senha
    };

    try {
        // Enviar a requisição para o backend
        const response = await fetch('http://localhost:2000/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const result = await response.json();

        // Verificar se o login foi bem-sucedido
        if (response.ok) {
            // Armazenar o nome do usuário no localStorage
            localStorage.setItem('userName', result.user.nome);
            localStorage.setItem('tipo', result.user.tipo);
            localStorage.setItem('userId', result.user.id);
            
            alert('Login realizado com sucesso!');
            // Redirecionar para a página principal ou área restrita
            window.location.href = './pages/pag_inicial.html'; // Exemplo de redirecionamento
        } else {
            alert(result.message); // Exibir a mensagem de erro
        }

    } catch (error) {
        console.error('Erro ao realizar login:', error);
        alert('Erro ao tentar fazer login. Tente novamente mais tarde.');
    }
}

// Adicionar o evento de clique ao botão de login
loginButton.addEventListener('click', realizarLogin);
