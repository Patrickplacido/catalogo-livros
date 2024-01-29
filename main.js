document.addEventListener('DOMContentLoaded', function () {
  const booksContainer = document.getElementById('books-container');
  const modal = document.getElementById('modal');
  const searchInput = document.getElementById('search-input');
  const searchForm = document.getElementById('search-form');

  fetchBooks('query');

  searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const searchTerm = document.getElementById('search-input').value.trim();
      if (searchTerm !== '') {
        fetchBooks(searchTerm);
      }
  });

  searchInput.addEventListener('input', function () {
    const searchTerm = this.value.trim();
    if (searchTerm !== '') {
        fetchBooks(searchTerm);
    }
  });

  async function fetchBooks(query) {
      try {
          const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
          const data = await response.json();
          displayBooks(data.items);
      } catch (error) {
          console.error('Erro ao obter livros:', error.message);
      }
  }

  function displayBooks(books) {
      booksContainer.innerHTML = '';
      books.forEach(book => {
          const bookCard = createBookCard(book.volumeInfo);
          booksContainer.appendChild(bookCard);
      });
  }

  function createBookCard(book) {
      const card = document.createElement('div');
      card.classList.add('book-card');

      const img = document.createElement('img');
      img.src = book.imageLinks?.thumbnail || 'placeholder.jpg';
      img.alt = `${book.title} - ${book.authors?.join(', ') || 'Autor Desconhecido'}`;

      const info = document.createElement('div');
      info.classList.add('book-info');
      info.innerHTML = `<h3>${book.title}</h3><p>${book.authors?.join(', ') || 'Autor Desconhecido'}</p>`;

      card.appendChild(img);
      card.appendChild(info);

      card.addEventListener('click', () => displayBookDetails(book));

      return card;
  }

  function displayBookDetails(book) {
      const modalContent = document.createElement('div');
      modalContent.classList.add('modal-content');

      modalContent.innerHTML = `
        <span class="close-btn" onclick="closeModal()">&times;</span>
        <h2>${book.title}</h2>
        <p>Autor(es): ${book.authors?.join(', ') || 'Autor Desconhecido'}</p>
        <p>Sinopse: ${book.description || 'Sinopse não disponível'}</p>
        <p>Data de Publicação: ${book.publishedDate || 'Data não disponível'}</p>
        <p>Número de Páginas: ${book.pageCount || 'Número de páginas não disponível'}</p>
      `;

      modal.innerHTML = '';
      modal.appendChild(modalContent);
      modal.style.display = 'flex';
  }

  window.closeModal = function () {
    modal.style.display = 'none';
    modal.innerHTML = '';
  };
});