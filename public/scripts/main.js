// main.js — корзина + рендер карточек + toast
// ==========================================

// Данные (как у тебя)
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

// DOM элементы (проверяем наличие)
const cartCountEl = document.getElementById('cart-count');
const cartBtnEl = document.getElementById('cart-btn');
const cartPanelEl = document.getElementById('cart-panel');
const cartListEl = document.getElementById('cart-list');
const clearCartBtn = document.getElementById('clear-cart');
const toastEl = document.getElementById('toast');

// Если какой-то элемент отсутствует, создаём минимальные заглушки чтобы не падать с ошибкой
function ensureEl(id, tag='div') {
  const el = document.getElementById(id);
  if (el) return el;
  const created = document.createElement(tag);
  created.id = id;
  // если это toast — скрываем
  if (id === 'toast') { created.style.display='none'; document.body.appendChild(created); }
  else document.body.appendChild(created);
  return created;
}

const CART_COUNT = cartCountEl || ensureEl('cart-count', 'span');
const CART_BTN = cartBtnEl || ensureEl('cart-btn','div');
const CART_PANEL = cartPanelEl || ensureEl('cart-panel','div');
const CART_LIST = cartListEl || ensureEl('cart-list','ul');
const CLEAR_CART = clearCartBtn || ensureEl('clear-cart','button');
const TOAST = toastEl || ensureEl('toast','div');

// LocalStorage cart (array of game objects with at least id,title,img)
let cart = [];
try {
  cart = JSON.parse(localStorage.getItem('cart')) || [];
} catch(e) {
  cart = [];
}

// ------------ Utility: toast ------------
function showToast(message = 'Добавлено в корзину ✅') {
  TOAST.textContent = message;
  TOAST.style.display = 'block';
  TOAST.style.opacity = '1';
  // hide after 1.6s
  clearTimeout(TOAST._timeout);
  TOAST._timeout = setTimeout(() => {
    TOAST.style.opacity = '0';
    // match with CSS transition (if any) — then hide
    setTimeout(()=> { TOAST.style.display = 'none'; }, 250);
  }, 1600);
}

// ------------ Cart logic ------------
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartUI() {
  // update counter
  CART_COUNT.textContent = cart.length;
  // render list
  renderCartList();
}

function renderCartList() {
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
    li.style.display = 'flex';
    li.style.gap = '8px';
    li.style.alignItems = 'center';
    // thumbnail (small)
    const thumb = document.createElement('img');
    thumb.src = item.img || '';
    thumb.alt = item.title || '';
    thumb.style.width = '48px';
    thumb.style.height = '36px';
    thumb.style.objectFit = 'cover';
    thumb.style.borderRadius = '6px';
    thumb.style.flex = '0 0 auto';

    const title = document.createElement('div');
    title.textContent = item.title;
    title.style.flex = '1 1 auto';

    const remove = document.createElement('button');
    remove.textContent = '✖';
    remove.className = 'cart-remove-btn';
    remove.dataset.id = item.id;
    remove.style.background = 'transparent';
    remove.style.border = 'none';
    remove.style.color = '#ff6b6b';
    remove.style.cursor = 'pointer';
    remove.style.fontSize = '16px';

    remove.addEventListener('click', () => {
      removeFromCart(item.id);
    });

    li.appendChild(thumb);
    li.appendChild(title);
    li.appendChild(remove);
    CART_LIST.appendChild(li);
  });
}

function addToCart(game) {
  // check by id
  if (cart.some(i => i.id === game.id)) {
    showToast('Уже в корзине 😉');
    return;
  }
  // store a lightweight object
  const item = { id: game.id, title: game.title, img: game.img, genre: game.genre, rating: game.rating };
  cart.push(item);
  saveCart();
  updateCartUI();
  showToast('Добавлено в корзину ✅');
}

function removeFromCart(id) {
  const prevLen = cart.length;
  cart = cart.filter(i => i.id !== id);
  if (cart.length !== prevLen) {
    saveCart();
    updateCartUI();
    showToast('Удалено из корзины');
  }
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartUI();
}

// ------------ Panel toggle ------------
function toggleCartPanel(open) {
  if (open === undefined) {
    CART_PANEL.classList.toggle('open');
  } else if (open) {
    CART_PANEL.classList.add('open');
  } else {
    CART_PANEL.classList.remove('open');
  }
}

// ------------ Render game cards ------------
function populateSection(gridId, items) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  const tpl = document.getElementById('card-template');
  if (!tpl) return;

  // clear existing
  grid.innerHTML = '';

  items.forEach(game => {
    const clone = tpl.content.cloneNode(true);

    // find elements inside clone
    const imgEl = clone.querySelector('img');
    const titleEl = clone.querySelector('h3');
    const metaEl = clone.querySelector('p');
    const playBtn = clone.querySelector('.play-btn') || clone.querySelector('button');
    const addBtn = clone.querySelector('.add-cart-btn');

    if (imgEl) {
      imgEl.src = game.img || '';
      imgEl.alt = game.title;
      imgEl.loading = 'lazy';
      // fallback on error
      imgEl.onerror = () => { imgEl.src = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"400\" height=\"240\"><rect width=\"100%\" height=\"100%\" fill=\"#0b1220\"/><text x=\"50%\" y=\"50%\" fill=\"#98a0b3\" font-size=\"16\" text-anchor=\"middle\" dominant-baseline=\"middle\">Preview unavailable</text></svg>'); };
    }
    if (titleEl) titleEl.textContent = game.title;
    if (metaEl) metaEl.textContent = `${game.genre} • ${game.rating}`;

    // add button must exist with class 'add-cart-btn'
    if (addBtn) {
      addBtn.addEventListener('click', (e) => {
        e.preventDefault();
        addToCart(game);
      });
    } else {
      // if not present, create one
      const wrapper = clone.querySelector('.game-info') || document.createElement('div');
      const generated = document.createElement('button');
      generated.className = 'add-cart-btn';
      generated.textContent = 'Добавить 🛒';
      generated.style.marginTop = '8px';
      generated.addEventListener('click', (e) => {
        e.preventDefault();
        addToCart(game);
      });
      wrapper.appendChild(generated);
    }

    grid.appendChild(clone);
  });
}

// ------------ Init & events ------------
document.addEventListener('DOMContentLoaded', () => {
  // initial render
  populateSection('grid-new', games.slice(0,4));
  populateSection('grid-popular', games.slice(2,6));
  populateSection('grid-rec', games.slice(4,8));

  // fill UI from localStorage
  updateCartUI();

  // cart button toggles panel
  CART_BTN.addEventListener('click', () => {
    toggleCartPanel();
  });

  // clear cart
  CLEAR_CART.addEventListener('click', () => {
    clearCart();
  });

  // close panel on outside click (optional)
  document.addEventListener('click', (e) => {
    if (!CART_PANEL.contains(e.target) && !CART_BTN.contains(e.target)) {
      // if panel is open, close it when clicked outside
      if (CART_PANEL.classList.contains('open')) toggleCartPanel(false);
    }
  });
});
