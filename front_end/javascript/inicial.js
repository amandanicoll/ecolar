// Elementos da página
const searchInput = document.querySelector('.search-bar input');
const searchButton = document.querySelector('.search-bar button');
const cardsGroup = document.querySelector('.cards-group');

// Função para criar um card dinamicamente
function createCard(material, description) {
  const card = document.createElement('div');
  card.classList.add('card');

  const cardInner = document.createElement('div');
  cardInner.classList.add('card-inner');

  const cardFront = document.createElement('div');
  cardFront.classList.add('card-front');
  cardFront.innerHTML = `<p>${material}</p>`;

  const cardBack = document.createElement('div');
  cardBack.classList.add('card-back');
  cardBack.innerHTML = `<p>${description}</p>`;

  cardInner.appendChild(cardFront);
  cardInner.appendChild(cardBack);
  card.appendChild(cardInner);

  return card;
}

// Função para renderizar os cards
function renderCards(data) {
  cardsGroup.innerHTML = ''; // Limpa os cards existentes
  if (data.length > 0) {
    data.forEach(item => {
      const card = createCard(item.material, item.descarte);
      cardsGroup.appendChild(card);
    });
  } else {
    cardsGroup.innerHTML = '<p>Nenhum resultado encontrado.</p>';
  }
}

// Função para carregar os dados (para inicialização ou pesquisa)
async function fetchAndRenderCards(query = '') {
  const url = query 
    ? `http://localhost:2000/api/descarte?query=${encodeURIComponent(query)}`
    : 'http://localhost:2000/api/descarte';
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Erro ao buscar dados do backend');
    }
    const data = await response.json();
    renderCards(data);
  } catch (error) {
    console.error('Erro ao buscar os dados:', error);
    cardsGroup.innerHTML = '<p>Erro ao carregar os dados.</p>';
  }
}

// Evento para carregar os cards automaticamente quando a página é aberta
document.addEventListener('DOMContentLoaded', () => fetchAndRenderCards());

// Evento para realizar a pesquisa ao clicar no botão
searchButton.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchAndRenderCards(query);
  } else {
    alert('Por favor, insira um termo para pesquisar.');
  }
});
