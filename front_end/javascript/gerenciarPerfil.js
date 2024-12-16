document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profile-form');
    const additionalFields = document.getElementById('additional-fields');
    const saveButton = document.getElementById('save-profile');
    const userId = localStorage.getItem('userId');
      
    if (!userId) {
        alert('Você precisa estar autenticado para acessar esta página.');
        window.location.href = '../index.html'; // Redireciona para a página de login
        return;
    }
      
    // Simular obtenção do tipo de usuário do localStorage
    const userType = localStorage.getItem('tipo') || 'usuario'; // Exemplo: 'voluntario' ou 'ponto'
  
    // Simular obtenção dos dados do usuário do backend
    async function fetchUserData() {
        const userId = localStorage.getItem('userId'); // Obtém o ID do usuário do localStorage
      
        if (!userId) {
          console.error('Usuário não autenticado.');
          return null;
        }
      
        try {
          const response = await fetch(`http://localhost:2000/api/usuario-perfil?userId=${userId}`);
      
          if (!response.ok) {
            const error = await response.json(); // Tenta capturar a mensagem de erro
            throw new Error(error.message || 'Erro ao buscar dados do perfil');
          }
      
          return await response.json();
        } catch (error) {
          console.error('Erro ao buscar perfil:', error.message);
          return null; // Retorna `null` em caso de erro
        }
    }
  
    // Carregar os dados do usuário no formulário
    async function loadUserProfile() {
        const userData = await fetchUserData();
      
        if (userData) {
          document.getElementById('nome').value = userData.nome || '';
          document.getElementById('email').value = userData.email || '';
          // Deixe o campo de senha vazio por padrão
      
          if (userType === 'ponto') {
            additionalFields.classList.remove('hidden');
            document.getElementById('material').value = userData.material || '';
            document.getElementById('endereco').value = userData.endereco || '';
            document.getElementById('responsavel').value = userData.responsavel || '';
            document.getElementById('contato').value = userData.contato || '';
            document.getElementById('linkmapa').value = userData.linkmapa || '';
            document.getElementById('linkimg').value = userData.linkimg || '';
          } else {
            additionalFields.classList.add('hidden');
          }
      
          profileForm.classList.remove('hidden');
        } else {
          alert('Não foi possível carregar os dados do perfil.');
        }
    }
  
    // Salvar as alterações no perfil
    async function saveUserProfile() {
        const userId = localStorage.getItem('userId');
      
        if (!userId) {
          alert('Erro: ID do usuário não encontrado.');
          return;
        }
      
        const senha = document.getElementById('senha').value.trim(); // Captura o valor do campo senha
      
        const userData = {
          userId,
          nome: document.getElementById('nome').value.trim(),
          email: document.getElementById('email').value.trim(),
        };
      
        // Inclui o campo senha somente se o usuário digitou algo
        if (senha) {
          userData.senha = senha;
        }
      
        if (userType === 'ponto') {
          Object.assign(userData, {
            material: document.getElementById('material').value.trim(),
            endereco: document.getElementById('endereco').value.trim(),
            responsavel: document.getElementById('responsavel').value.trim(),
            contato: document.getElementById('contato').value.trim(),
            linkmapa: document.getElementById('linkmapa').value.trim(),
            linkimg: document.getElementById('linkimg').value.trim(),
          });
        }
      
        try {
          const response = await fetch('http://localhost:2000/api/usuario-perfil', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          });
      
          if (response.ok) {
            alert('Perfil atualizado com sucesso!');
            loadUserProfile(); // Recarrega os dados no formulário
          } else {
            const errorData = await response.json();
            alert(errorData.message || 'Erro ao atualizar perfil');
          }
        } catch (error) {
          console.error('Erro ao salvar perfil:', error);
        }
    }
    // Adicionar evento ao botão de salvar
    saveButton.addEventListener('click', saveUserProfile);
  
    // Inicializar a página
    loadUserProfile();
  });
  