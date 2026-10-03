const baseURL = import.meta.env?.VITE_SERVER_URL || '';
const endpoint = (path) => `${baseURL.replace(/\/?$/, '/')}${path}`;

async function convertToJson(res) {
  const data = await res.json();
  if (res.ok) {
    return data;
  }
  throw { name: 'servicesError', message: data };
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