// Elemento da página onde os cards serão adicionados
const cardsGroup = document.querySelector('.cards-group');

// Função para criar um card dinamicamente
function createCommunityCard({ nome, categoria, contato, descricao, linkimg }) {
  const card = document.createElement('div');
  card.classList.add('card');

  const cardInner = document.createElement('div');
  cardInner.classList.add('card-inner');

  // Frente do card
  const cardFront = document.createElement('div');
  cardFront.classList.add('card-front');
  cardFront.innerHTML = `
    <img src="${linkimg}" alt="Imagem da Comunidade">
    <p>${nome}</p>
  `;

  // Verso do card
  const cardBack = document.createElement('div');
  cardBack.classList.add('card-back');
  cardBack.innerHTML = `
    <p><strong>Categoria:</strong> ${categoria}</p>
    <p><strong>Contato:</strong> ${contato}</p>
    <p><strong>Descrição:</strong> ${descricao}</p>
  `;

  cardInner.appendChild(cardFront);
  cardInner.appendChild(cardBack);
  card.appendChild(cardInner);

  return card;
}

// Função para buscar dados do backend
async function fetchCommunityData() {
  try {
    const response = await fetch('http://localhost:2000/api/comunidades');
    if (!response.ok) {
      throw new Error('Erro ao buscar dados do backend');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar os dados:', error);
    return [];
  }
}

// Função para renderizar os cards
async function renderCommunityCards() {
  const communities = await fetchCommunityData(); // Busca os dados do backend
  cardsGroup.innerHTML = ''; // Limpa os cards existentes

  if (communities.length > 0) {
    communities.forEach(community => {
      const card = createCommunityCard(community);
      cardsGroup.appendChild(card);
    });
  } else {
    cardsGroup.innerHTML = '<p>Nenhuma comunidade encontrada.</p>';
  }
}

// Carrega os cards automaticamente ao abrir a página
document.addEventListener('DOMContentLoaded', renderCommunityCards);
