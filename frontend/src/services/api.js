import { getStorageItem } from './storage.js';

const API_URL = import.meta.env.VITE_API_URL || '/api';

function isJsonResponse(response) {
  return response.headers.get('content-type')?.includes('application/json');
}

function createResponseError(response, text, data) {
  if (data?.error) {
    return new Error(data.error);
  }

  const contentType = response.headers.get('content-type') || 'unknown';
  const responsePreview = text.trim().slice(0, 120);

  return new Error(
    `API вернул ${response.status} ${response.statusText || ''} (${contentType})${
      responsePreview ? `: ${responsePreview}` : ''
    }`
  );
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
    throw createResponseError(response, text, data);
  }

  if (text && !isJsonResponse(response)) {
    throw new Error('Сервер вернул не JSON. Проверьте, что /api проксируется на backend.');
  }

  return data;
}

export default request;
