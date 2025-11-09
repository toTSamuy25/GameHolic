// main.js — корзина + drag&drop (перемещение, а не копия)
// ======================================================

// --- Данные ---
const games = [
  { id:1, title:'мой title', genre:'Аркада', rating:4.7, img:'/assets/imgs/games_logo/Among Us!.jpg' },
  { id:2, title:'Block Merge', genre:'Головоломка', rating:4.4, img:'/assets/imgs/games_logo/ICO.jpg' },
  { id:3, title:'Turbo Track', genre:'Гонки', rating:4.6, img:'/assets/imgs/games_logo/Stumble guys.jpg' },
  { id:4, title:'Battle Lobby', genre:'Мультиплеер', rating:4.2, img:'/assets/imgs/games_logo/Surf the Subway.jpg' },
  { id:5, title:'Mystic Match', genre:'Головоломка', rating:4.5, img:'/assets/imgs/games_logo/ред булл 4.jpg' },
  { id:6, title:'Pixel Runner', genre:'Аркада', rating:4.3, img:'assets/imgs/games_logo/Энгри бердс топ.jpg' },
  { id:7, title:'Drift King', genre:'Гонки', rating:4.1, img:'/assets/imgs/games_logo/Fortnite.jpg' },
  { id:8, title:'Team Clash', genre:'Мультиплеер', rating:4.0, img:'/assets/imgs/games_logo/Clash Royale.jpg' }
];

// --- DOM ---
const CART_COUNT = document.getElementById('cart-count');
const CART_BTN = document.getElementById('cart-btn');
const CART_PANEL = document.getElementById('cart-panel');
const CART_LIST = document.getElementById('cart-list');
const CLEAR_CART = document.getElementById('clear-cart');

// --- Toast ---
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = 'toast show';
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// --- LocalStorage / корзина ---
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}
function updateCartUI() {
  CART_COUNT.textContent = cart.length;
  CART_LIST.innerHTML = '';
  if (!cart.length) {
    const li = document.createElement('li');
    li.textContent = 'Корзина пуста';
    li.style.opacity = '0.8';
    CART_LIST.appendChild(li);
    return;
  }
  cart.forEach(item => {
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <img src="${item.img}" alt="${item.title}" class="cart-thumb">
      <span>${item.title}</span>
      <button class="cart-remove" data-id="${item.id}">✖</button>
    `;
    li.querySelector('.cart-remove').onclick = () => removeFromCart(item.id);
    CART_LIST.appendChild(li);
  });
}
function addToCart(game) {
  if (cart.some(i => i.id === game.id)) {
    showToast('Уже в корзине 😉');
    return;
  }
  cart.push(game);
  saveCart();
  updateCartUI();
  showToast(`🎮 ${game.title} добавлена в корзину`);
}
function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
  showToast('Удалено из корзины');
}
function clearCart() {
  cart = [];
  saveCart();
  updateCartUI();
}

// --- Toggle ---
function toggleCartPanel(open) {
  CART_PANEL.classList.toggle('open', open ?? !CART_PANEL.classList.contains('open'));
}

// --- Render ---
function populateSection(gridId, items) {
  const grid = document.getElementById(gridId);
  const tpl = document.getElementById('card-template');
  grid.innerHTML = '';

  items.forEach(game => {
    const clone = tpl.content.cloneNode(true);
    const card = clone.querySelector('.game-card');
    const imgEl = clone.querySelector('img');
    const titleEl = clone.querySelector('h3');
    const metaEl = clone.querySelector('p');
    const btn = clone.querySelector('button');

    imgEl.src = game.img;
    imgEl.alt = game.title;
    titleEl.textContent = game.title;
    metaEl.textContent = `${game.genre} • ${game.rating}`;
    btn.textContent = 'Добавить 🛒';
    btn.onclick = () => addToCart(game);

    // Drag & Drop
    card.draggable = true;
    card.dataset.id = game.id;
    card.addEventListener('dragstart', e => {
      e.dataTransfer.setData('gameId', game.id);
      card.classList.add('dragging');
    });
    card.addEventListener('dragend', () => card.classList.remove('dragging'));

    grid.appendChild(clone);
  });
}

// --- Drop zone ---
function initDropZone() {
  const dropZone = document.createElement('div');
  dropZone.id = 'drop-zone';
  dropZone.innerHTML = '🛒 Перетащи сюда игру';
  CART_PANEL.prepend(dropZone);

  dropZone.addEventListener('dragover', e => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
  dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const id = e.dataTransfer.getData('gameId');
    const game = games.find(g => g.id == id);
    if (game) {
      addToCart(game);
      // удалить карточку из витрины (и при желании из localStorage каталога)
      const draggedCard = document.querySelector(`.game-card[data-id="${id}"]`);
      if (draggedCard) draggedCard.remove();
      // удаляем игру из массива games
      const idx = games.findIndex(g => g.id == id);
      if (idx !== -1) games.splice(idx, 1);
      showToast(`🗑️ ${game.title} перемещена в корзину`);
    }
  });
}

// --- DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {
  populateSection('grid-new', games.slice(0,4));
  populateSection('grid-popular', games.slice(2,6));
  populateSection('grid-rec', games.slice(4,8));
  updateCartUI();
  initDropZone();

  CART_BTN.onclick = () => toggleCartPanel();
  CLEAR_CART.onclick = clearCart;
  document.addEventListener('click', e => {
    if (!CART_PANEL.contains(e.target) && !CART_BTN.contains(e.target)) {
      toggleCartPanel(false);
    }
  });
});


// изменение 