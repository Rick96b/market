import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { createOrder, getMyOrders } from '../services/orderService.js';

const orderSteps = ['new', 'confirmed', 'packing', 'shipped', 'delivered'];

const statusLabels = {
  new: 'Новый',
  confirmed: 'Подтвержден',
  packing: 'Собирается',
  shipped: 'В пути',
  delivered: 'Доставлен',
  cancelled: 'Отменен',
};

const deliveryLabels = {
  courier: 'Курьер',
  pickup: 'Самовывоз',
};

const paymentLabels = {
  cash: 'Наличными',
  card: 'Картой при получении',
};

function formatPhone(value) {
  let digits = value.replace(/\D/g, '');

  if (!digits) return '';
  if (digits[0] === '8') digits = `7${digits.slice(1)}`;
  if (digits[0] !== '7') digits = `7${digits}`;

  digits = digits.slice(0, 11);

  const code = digits.slice(1, 4);
  const first = digits.slice(4, 7);
  const second = digits.slice(7, 9);
  const third = digits.slice(9, 11);

  let phone = '+7';
  if (code) phone += ` (${code}`;
  if (code.length === 3) phone += ')';
  if (first) phone += ` ${first}`;
  if (second) phone += `-${second}`;
  if (third) phone += `-${third}`;

  return phone;
}

function Cart({ showOrdersOnly = false }) {
  const { items, total, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [delivery, setDelivery] = useState({
    delivery_name: '',
    delivery_phone: '',
    delivery_address: '',
    delivery_method: 'courier',
    payment_method: 'cash',
    note: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    getMyOrders()
      .then(setOrders)
      .catch(() => setOrders([]));
  }, [isAuthenticated, message]);

  async function handleCheckout() {
    setMessage('');
    setError('');

    if (!isAuthenticated) {
      setError('Войдите в аккаунт перед оформлением заказа.');
      return;
    }

    if (items.length === 0) {
      setError('Корзина пуста.');
      return;
    }

    if (!delivery.delivery_name || !delivery.delivery_phone || !delivery.delivery_address) {
      setError('Заполните имя получателя, телефон и адрес доставки.');
      return;
    }

    if (delivery.delivery_phone.replace(/\D/g, '').length < 11) {
      setError('Введите телефон полностью.');
      return;
    }

    setSubmitting(true);

    try {
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));
      await createOrder({ items: orderItems, ...delivery });
      clearCart();
      setDelivery({
        delivery_name: '',
        delivery_phone: '',
        delivery_address: '',
        delivery_method: 'courier',
        payment_method: 'cash',
        note: '',
      });
      setMessage('Заказ успешно создан.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  function getStatusClass(status) {
    return `order-status-badge order-status-badge--${status}`;
  }

  function handleDeliveryChange(event) {
    const { id, value } = event.target;
    const nextValue = id === 'delivery_phone' ? formatPhone(value) : value;
    setDelivery({ ...delivery, [id]: nextValue });
  }

  return (
    <section className="container py-5">
      {!showOrdersOnly && (
        <>
          <div className="cart-header d-flex justify-content-between align-items-end gap-3 mb-4">
            <div>
              <h1 className="h2 mb-1">Корзина</h1>
              <p className="text-muted mb-0">Проверьте товары и оформите заказ.</p>
            </div>
            <Link className="btn btn-outline-success" to="/products">
              Продолжить покупки
            </Link>
          </div>

          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          {items.length === 0 ? (
            <div className="cart-empty">
              <h2 className="h4">Корзина пуста</h2>
              <p className="text-muted">Добавьте свежие товары из каталога и возвращайтесь к оформлению.</p>
              <Link className="btn btn-success" to="/products">
                Перейти в каталог
              </Link>
            </div>
          ) : (
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="d-flex flex-column gap-3">
                  {items.map((item) => (
                    <CartItem item={item} key={item.product.id} />
                  ))}
                </div>
              </div>
              <div className="col-lg-4">
                <aside className="order-summary border rounded-2 bg-white p-4">
                  <h2 className="h5">Оформление заказа</h2>
                  <div className="checkout-form">
                    <div className="mb-3">
                      <label className="form-label" htmlFor="delivery_name">
                        Получатель
                      </label>
                      <input
                        className="form-control"
                        id="delivery_name"
                        required
                        value={delivery.delivery_name}
                        onChange={handleDeliveryChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="delivery_phone">
                        Телефон
                      </label>
                      <input
                        className="form-control"
                        id="delivery_phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="+7 (999) 123-45-67"
                        required
                        value={delivery.delivery_phone}
                        onChange={handleDeliveryChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="delivery_address">
                        Адрес
                      </label>
                      <textarea
                        className="form-control"
                        id="delivery_address"
                        rows="3"
                        required
                        value={delivery.delivery_address}
                        onChange={handleDeliveryChange}
                      />
                    </div>
                    <div className="row g-2">
                      <div className="col-6">
                        <label className="form-label" htmlFor="delivery_method">
                          Доставка
                        </label>
                        <select
                          className="form-select"
                          id="delivery_method"
                          value={delivery.delivery_method}
                          onChange={(event) => setDelivery({ ...delivery, delivery_method: event.target.value })}
                        >
                          <option value="courier">Курьер</option>
                          <option value="pickup">Самовывоз</option>
                        </select>
                      </div>
                      <div className="col-6">
                        <label className="form-label" htmlFor="payment_method">
                          Оплата
                        </label>
                        <select
                          className="form-select"
                          id="payment_method"
                          value={delivery.payment_method}
                          onChange={(event) => setDelivery({ ...delivery, payment_method: event.target.value })}
                        >
                          <option value="cash">Наличными</option>
                          <option value="card">Картой при получении</option>
                        </select>
                      </div>
                    </div>
                    <div className="my-3">
                      <label className="form-label" htmlFor="note">
                        Комментарий
                      </label>
                      <input
                        className="form-control"
                        id="note"
                        value={delivery.note}
                        onChange={handleDeliveryChange}
                      />
                    </div>
                  </div>
                  <div className="d-flex justify-content-between my-3">
                    <span>Итого</span>
                    <strong>{total.toFixed(2)} ₽</strong>
                  </div>
                  <button
                    className="btn btn-success w-100"
                    type="button"
                    disabled={submitting}
                    onClick={handleCheckout}
                  >
                    {submitting ? 'Создаем...' : 'Оформить заказ'}
                  </button>
                  {!isAuthenticated && (
                    <p className="small text-muted mt-3 mb-0">
                      Для оформления заказа нужно <Link to="/login">войти</Link>.
                    </p>
                  )}
                </aside>
              </div>
            </div>
          )}
        </>
      )}

      {isAuthenticated && (
        <div className={showOrdersOnly ? '' : 'mt-5'}>
          <h2 className="h3 mb-3">Мои заказы</h2>
          {orders.length === 0 ? (
            <div className="alert alert-light border">Заказов пока нет.</div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {orders.map((order) => (
                <article className="border rounded-2 bg-white p-3" key={order.id}>
                  <div className="d-flex flex-wrap justify-content-between gap-2">
                    <strong>Заказ #{order.id}</strong>
                    <span className={getStatusClass(order.status)}>{statusLabels[order.status] || order.status}</span>
                    <span>{Number(order.total_price).toFixed(2)} ₽</span>
                  </div>
                  <div className="order-progress my-3">
                    {orderSteps.map((status) => (
                      <span
                        className={orderSteps.indexOf(status) <= orderSteps.indexOf(order.status) ? 'is-active' : ''}
                        key={status}
                      >
                        {statusLabels[status]}
                      </span>
                    ))}
                  </div>
                  <p className="text-muted small mt-2 mb-0">
                    {deliveryLabels[order.delivery_method] || order.delivery_method}: {order.delivery_address}.
                    Оплата: {paymentLabels[order.payment_method] || order.payment_method}
                  </p>
                  <ul className="mb-0 mt-2">
                    {order.items.map((item) => (
                      <li key={item.id}>
                        {item.product.name} × {item.quantity}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default Cart;
