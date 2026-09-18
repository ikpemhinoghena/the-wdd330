import { getLocalStorage, setLocalStorage } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = null;
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    if (!this.product) {
      document.querySelector('.product-detail').textContent =
        'Product not found.';
      return;
    }
    this.renderProductDetails();
    document
      .getElementById('addToCart')
      .addEventListener('click', () => this.addProductToCart());
  }

  addProductToCart() {
    if (!this.product) return;
    const storedCart = getLocalStorage('so-cart') || [];
    const cartItems = Array.isArray(storedCart) ? storedCart : [storedCart];
    cartItems.push(this.product);
    setLocalStorage('so-cart', cartItems);
  }

  renderProductDetails() {
    const product = this.product;
    document.title = `Sleep Outside | ${product.Name}`;
    document.querySelector('.product-detail').innerHTML = `
      <h3>${product.Brand.Name}</h3>
      <h2 class="divider">${product.NameWithoutBrand}</h2>
      <img class="divider" src="${product.Image}" alt="${product.Name}" />
      <p class="product-card__price">$${product.FinalPrice.toFixed(2)}</p>
      <p class="product__color">${product.Colors[0].ColorName}</p>
      <p class="product__description">${product.DescriptionHtmlSimple}</p>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
      </div>`;
  }
}
