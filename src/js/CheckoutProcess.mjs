import { getLocalStorage } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';

const money = (amount) => Math.round((amount + Number.EPSILON) * 100) / 100;
const formatMoney = (amount) => `$${amount.toFixed(2)}`;

export default class CheckoutProcess {
  constructor(form, dataSource = new ExternalServices()) {
    this.form = form;
    this.dataSource = dataSource;
    this.cartList = [];
    this.items = [];
    this.itemSubtotal = 0;
    this.tax = 0;
    this.shipping = 0;
    this.orderTotal = 0;
  }

  init() {
    const storedCart = getLocalStorage('so-cart') || [];
    this.cartList = Array.isArray(storedCart) ? storedCart : [storedCart];
    this.items = this.cartList.map((product) => ({
      id: product.Id,
      name: product.Name,
      price: Number(product.FinalPrice),
      quantity: 1,
    }));
    this.itemSubtotal = money(
      this.items.reduce((total, item) => total + item.price * item.quantity, 0),
    );
    this.calculateOrderTotal();
  }

  calculateOrderTotal() {
    this.tax = money(this.itemSubtotal * 0.06);
    this.shipping = this.items.length === 0 ? 0 : 10 + 2 * (this.items.length - 1);
    this.orderTotal = money(this.itemSubtotal + this.tax + this.shipping);

    document.querySelector('#subtotal').textContent = formatMoney(this.itemSubtotal);
    document.querySelector('#tax').textContent = formatMoney(this.tax);
    document.querySelector('#shipping').textContent = formatMoney(this.shipping);
    document.querySelector('#order-total').textContent = formatMoney(this.orderTotal);

    return this.orderTotal;
  }

  checkout(form = this.form) {
    const values = new FormData(form);
    const order = {
      orderDate: new Date().toISOString(),
      fname: values.get('fname'),
      lname: values.get('lname'),
      street: values.get('street'),
      city: values.get('city'),
      state: values.get('state'),
      zip: values.get('zip'),
      cardNumber: values.get('cardNumber'),
      expiration: values.get('expiration'),
      code: values.get('code'),
      items: this.items,
      orderTotal: this.orderTotal,
      shipping: this.shipping,
      tax: this.tax,
    };

    return this.dataSource.checkout(order);
  }
}