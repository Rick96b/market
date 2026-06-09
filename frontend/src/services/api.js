import { getStorageItem } from './storage.js';

const API_URL = import.meta.env.VITE_API_URL || '/api';

function isJsonResponse(response) {
  return response.headers.get('content-type')?.includes('application/json');
}

async function request(path, options = {}) {
  const token = getStorageItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  const data = text && isJsonResponse(response) ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.error || 'Сервер API недоступен или неверно настроен прокси.');
  }

  if (text && !isJsonResponse(response)) {
    throw new Error('Сервер вернул не JSON. Проверьте, что /api проксируется на backend.');
  }

  return data;
}

export default request;
