const baseURL = import.meta.env?.VITE_SERVER_URL || '';
const endpoint = (path) => `${baseURL.replace(/\/?$/, '/')}${path}`;

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Bad Response');
  }
}

export default class ExternalServices {
  async getData(category) {
    const response = await fetch(endpoint(`products/search/${category}`));
    const data = await convertToJson(response);
    return data.Result;
  }

  async findProductById(id) {
    const response = await fetch(endpoint(`product/${id}`));
    const data = await convertToJson(response);
    return data.Result;
  }

  async checkout(order) {
    const response = await fetch(endpoint('checkout'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    return convertToJson(response);
  }
}