import request from './api.js';

export function registerUser(values) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(values),
  });
}

export function loginUser(values) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(values),
  });
}

export function getCurrentUser() {
  return request('/auth/me');
}
