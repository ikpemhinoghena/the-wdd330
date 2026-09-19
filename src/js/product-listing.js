import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import { getParam, loadHeaderFooter } from './utils.mjs';

loadHeaderFooter();

const category = getParam('category');
if (category) {
  const title = category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  document.querySelector('.products h2').textContent = `Top Products: ${title}`;
  const dataSource = new ProductData();
  const listElement = document.querySelector('.product-list');
  const productList = new ProductList(category, dataSource, listElement);
  productList.init();
}
