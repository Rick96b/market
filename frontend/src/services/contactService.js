import request from './api.js';

export function sendContactRequest(values) {
  return request('/contact', {
    method: 'POST',
    body: JSON.stringify(values),
  });
}
