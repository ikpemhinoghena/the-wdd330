export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) callback(data);
}

export async function loadTemplate(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not load template: ${path}`);
  return response.text();
}

export async function loadHeaderFooter() {
  const [headerTemplate, footerTemplate] = await Promise.all([
    loadTemplate('/partials/header.html'),
    loadTemplate('/partials/footer.html'),
  ]);
  const header = qs('#main-header');
  const footer = qs('#main-footer');
  if (header) renderWithTemplate(headerTemplate, header, null, updateCartCount);
  if (footer) renderWithTemplate(footerTemplate, footer);
}

export function updateCartCount() {
  const cartLink = qs('.cart a');
  if (!cartLink) return;
  const storedCart = getLocalStorage('so-cart') || [];
  const count = Array.isArray(storedCart) ? storedCart.length : 1;
  let badge = qs('.cart-count', cartLink);
  if (!badge) {
    badge = document.createElement('span');
    badge.className = 'cart-count';
    badge.setAttribute('aria-hidden', 'true');
    cartLink.appendChild(badge);
  }
  badge.textContent = count;
  badge.hidden = count === 0;
  cartLink.setAttribute(
    'aria-label',
    `Shopping cart, ${count} ${count === 1 ? 'item' : 'items'}`,
  );
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = 'afterbegin',
  clear = false,
) {
  if (clear === true) parentElement.innerHTML = '';
  const html = list.map(templateFn).join('');
  parentElement.insertAdjacentHTML(position, html);
}

export function getParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener('touchend', (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener('click', callback);
}
