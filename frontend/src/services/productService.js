import request from './api.js';

export function getCategories() {
  return request('/categories');
}

export function createCategory(values) {
  return request('/categories', {
    method: 'POST',
    body: JSON.stringify(values),
  });
}

export function getProducts(filters = {}) {
  const params = new URLSearchParams();

  if (filters.categoryId) params.set('categoryId', filters.categoryId);
  if (filters.search) params.set('search', filters.search);
  if (filters.minPrice) params.set('minPrice', filters.minPrice);
  if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
  if (filters.featured) params.set('featured', 'true');
  if (filters.sort) params.set('sort', filters.sort);

  const query = params.toString();
  return request(`/products${query ? `?${query}` : ''}`);
}

export function getProduct(id) {
  return request(`/products/${id}`);
}

export function createProduct(values) {
  return request('/products', {
    method: 'POST',
    body: JSON.stringify(values),
  });
}

export function updateProduct(id, values) {
  return request(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(values),
  });
}

export function deleteProduct(id) {
  return request(`/products/${id}`, {
    method: 'DELETE',
  });
}
