import request from './api.js';

export function createOrder(orderData) {
  return request('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
}

export function getMyOrders() {
  return request('/orders/my');
}

export function getAllOrders() {
  return request('/orders');
}

export function updateOrderStatus(orderId, status) {
  return request(`/orders/${orderId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}
