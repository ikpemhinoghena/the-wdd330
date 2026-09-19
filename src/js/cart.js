import {
  getLocalStorage,
  setLocalStorage,
  loadHeaderFooter,
  updateCartCount,
} from './utils.mjs';

loadHeaderFooter();

function renderCartContents() {
  const storedCart = getLocalStorage('so-cart') || [];
  const cartItems = Array.isArray(storedCart) ? storedCart : [storedCart];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector('.product-list').innerHTML = htmlItems.join('');
  document.querySelector('#clear-cart-control').hidden = cartItems.length === 0;
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Images?.PrimaryMedium || item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();

document.querySelector('#clear-cart').addEventListener('click', () => {
  setLocalStorage('so-cart', []);
  renderCartContents();
  updateCartCount();
});
