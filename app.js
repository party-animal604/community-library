const form = document.querySelector("#book-form");
const titleInput = document.querySelector("#title");
const authorInput = document.querySelector("#author");
const bookList = document.querySelector("#book-list");
const bookCount = document.querySelector("#book-count");

const STORAGE_KEY = "community-library-books";
let books = loadBooks();

function loadBooks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveBooks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function escapeText(value) {
  const element = document.createElement("span");
  element.textContent = value;
  return element.innerHTML;
}

function createId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return String(Date.now());
}

function renderBooks() {
  bookCount.textContent = `${books.length} ${books.length === 1 ? "book" : "books"}`;

  if (books.length === 0) {
    bookList.innerHTML = '<p class="empty-state">The shelves are ready. Add the first book!</p>';
    return;
  }

  bookList.innerHTML = books
    .map(
      (book) => `
        <article class="book">
          <div class="book-accent" aria-hidden="true"></div>
          <div class="book-info">
            <h3>${escapeText(book.title)}</h3>
            <p>by ${escapeText(book.author)}</p>
          </div>
          <button class="delete-button" type="button" data-id="${escapeText(book.id)}" aria-label="Remove ${escapeText(book.title)}">Remove</button>
        </article>
      `,
    )
    .join("");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const author = authorInput.value.trim();

  if (!title || !author) return;

  books.unshift({
    id: createId(),
    title,
    author,
  });

  saveBooks();
  renderBooks();
  form.reset();
  titleInput.focus();
});

bookList.addEventListener("click", (event) => {
  const button = event.target.closest(".delete-button");
  if (!button) return;

  books = books.filter((book) => book.id !== button.dataset.id);
  saveBooks();
  renderBooks();
});

renderBooks();
