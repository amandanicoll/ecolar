// Seleciona todos os links do menu
const menuLinks = document.querySelectorAll('.sidebar nav ul li a');

// Obtém a URL completa da página atual
const currentPage = window.location.href;

console.log('Página atual:', currentPage);

menuLinks.forEach(link => {
  // Verifica se a URL do link está contida na URL da página atual
  if (currentPage.includes(link.href)) {
    console.log('Link:', link.href);
    link.classList.add('active'); // Adiciona a classe 'active' ao link correspondente
  } else {
    link.classList.remove('active'); // Remove 'active' caso não corresponda
  }
});
