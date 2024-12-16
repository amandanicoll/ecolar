// Elemento da página onde os cards serão adicionados
const cardsGroup = document.querySelector('.cards-group');

// Função para criar um card dinamicamente
function createCollectionPointCard({ nome, material, endereco, responsavel, contato, linkmapa, linkimg }) {
  const card = document.createElement('div');
  card.classList.add('card');

  const cardInner = document.createElement('div');
  cardInner.classList.add('card-inner');

  // Frente do card
  const cardFront = document.createElement('div');
  cardFront.classList.add('card-front');
  cardFront.innerHTML = `
    <img src="${linkimg}" alt="Imagem do Ponto de Coleta">
    <p>${nome}</p>
    <p>Ponto de coleta de <span>${material}</span></p>

  `;

  // Verso do card
  const cardBack = document.createElement('div');
  cardBack.classList.add('card-back');
  cardBack.innerHTML = `
    <p><strong>Endereço:</strong> ${endereco}</p>
    <p><strong>Responsável:</strong> ${responsavel}</p>
    <p><strong>Contato:</strong> ${contato}</p>
    <a href="${linkmapa}" target="_blank">
      📍 Ver no mapa
    </a>
  `;

  cardInner.appendChild(cardFront);
  cardInner.appendChild(cardBack);
  card.appendChild(cardInner);

  return card;
}

// Função para buscar dados do backend
async function fetchCollectionPoints() {
  try {
    const response = await fetch('http://localhost:2000/api/pontos');
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
async function renderCollectionPointCards() {
  const points = await fetchCollectionPoints(); // Busca os dados do backend
  cardsGroup.innerHTML = ''; // Limpa os cards existentes

  if (points.length > 0) {
    points.forEach(point => {
      const card = createCollectionPointCard(point);
      cardsGroup.appendChild(card);
    });
  } else {
    cardsGroup.innerHTML = '<p>Nenhum ponto de coleta encontrado.</p>';
  }
}

// Carrega os cards automaticamente ao abrir a página
document.addEventListener('DOMContentLoaded', renderCollectionPointCards);
