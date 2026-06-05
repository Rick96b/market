import { useEffect, useState } from 'react';
import { Link, Navigate, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getAllOrders, updateOrderStatus } from '../services/orderService.js';
import {
  createCategory,
  createProduct,
  deleteProduct,
  getCategories,
  getProducts,
  updateProduct,
} from '../services/productService.js';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  image_url: '',
  category_id: '',
  unit: 'kg',
  is_featured: false,
  calories: '100',
  protein: '1',
  fat: '1',
  carbs: '10',
  ingredients: 'Органический продукт',
};

const orderStatuses = ['new', 'confirmed', 'packing', 'shipped', 'delivered', 'cancelled'];

const statusLabels = {
  new: 'Новый',
  confirmed: 'Подтвержден',
  packing: 'Собирается',
  shipped: 'В пути',
  delivered: 'Доставлен',
  cancelled: 'Отменен',
};

const unitLabels = {
  kg: 'кг',
  piece: 'шт.',
  box: 'коробка',
  liter: 'л',
  loaf: 'буханка',
};

const deliveryLabels = {
  courier: 'Курьер',
  pickup: 'Самовывоз',
};

const paymentLabels = {
  cash: 'Наличными',
  card: 'Картой при получении',
};

const adminSections = ['overview', 'products', 'categories', 'orders'];

function AdminPanel() {
  const location = useLocation();
  const { user, loading: authLoading, login, logout } = useAuth();
  const sectionFromPath = location.pathname.split('/')[2] || 'overview';
  const section = adminSections.includes(sectionFromPath) ? sectionFromPath : '';

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [categoryMessage, setCategoryMessage] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [orderMessage, setOrderMessage] = useState('');
  const [orderError, setOrderError] = useState('');
  const [adminLoginForm, setAdminLoginForm] = useState({ email: '', password: '' });
  const [adminLoginError, setAdminLoginError] = useState('');
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);

  function loadData() {
    getCategories().then(setCategories).catch(() => setCategories([]));
    getProducts().then(setProducts).catch(() => setProducts([]));
    getAllOrders().then(setOrders).catch(() => setOrders([]));
  }

  useEffect(() => {
    if (user?.role === 'admin') {
      loadData();
    }
  }, [user]);

  if (!section) {
    return <Navigate to="/admin" replace />;
  }

  function handleAdminLoginChange(event) {
    setAdminLoginForm({ ...adminLoginForm, [event.target.name]: event.target.value });
  }

  async function handleAdminLogin(event) {
    event.preventDefault();
    setAdminLoginError('');
    setAdminLoginLoading(true);

    try {
      const loggedUser = await login(adminLoginForm);

      if (loggedUser.role !== 'admin') {
        logout();
        setAdminLoginError('У этого пользователя нет прав администратора.');
      }
    } catch (requestError) {
      setAdminLoginError(requestError.message);
    } finally {
      setAdminLoginLoading(false);
    }
  }

  function renderAdminAuth() {
    const wrongUser = user && user.role !== 'admin';

    return (
      <section className="admin-auth">
        <form className="admin-auth__card" onSubmit={handleAdminLogin}>
          <img className="app-brand__mark" src="/images/organic-market-mark.png" alt="" />
          <div>
            <p className="text-uppercase text-success fw-semibold mb-2">Админ-панель</p>
            <h1 className="h3 mb-2">Вход для администратора</h1>
            <p className="text-muted mb-0">Введите данные учетной записи с ролью администратора.</p>
          </div>

          {wrongUser && <div className="alert alert-warning">Текущий пользователь не является администратором.</div>}
          {adminLoginError && <div className="alert alert-danger">{adminLoginError}</div>}

          <div>
            <label className="form-label" htmlFor="admin_email">
              Email
            </label>
            <input
              className="form-control"
              id="admin_email"
              name="email"
              type="email"
              required
              value={adminLoginForm.email}
              onChange={handleAdminLoginChange}
            />
          </div>

          <div>
            <label className="form-label" htmlFor="admin_password">
              Пароль
            </label>
            <input
              className="form-control"
              id="admin_password"
              name="password"
              type="password"
              required
              minLength="6"
              value={adminLoginForm.password}
              onChange={handleAdminLoginChange}
            />
          </div>

          <button className="btn btn-success w-100" type="submit" disabled={adminLoginLoading}>
            {adminLoginLoading ? 'Проверяем...' : 'Войти в админку'}
          </button>

          {wrongUser && (
            <button className="btn btn-outline-secondary w-100" type="button" onClick={logout}>
              Выйти из текущего аккаунта
            </button>
          )}
        </form>
      </section>
    );
  }

  if (authLoading) {
    return (
      <section className="container py-5">
        <div className="alert alert-info mb-0">Проверяем авторизацию...</div>
      </section>
    );
  }

  if (user?.role !== 'admin') {
    return renderAdminAuth();
  }

  function handleChange(event) {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm({ ...form, [event.target.name]: value });
  }

  function startEdit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image_url,
      category_id: product.category_id,
      unit: product.unit || 'kg',
      is_featured: Boolean(product.is_featured),
      calories: product.calories || '100',
      protein: product.protein || '1',
      fat: product.fat || '1',
      carbs: product.carbs || '10',
      ingredients: product.ingredients || 'Органический продукт',
    });
    setMessage('');
    setError('');
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setError('');

    if (form.description.trim().length < 10) {
      setError('Описание должно содержать минимум 10 символов.');
      return;
    }

    if (Number(form.price) <= 0) {
      setError('Цена должна быть больше 0.');
      return;
    }

    if (Number(form.calories) < 0 || Number(form.protein) < 0 || Number(form.fat) < 0 || Number(form.carbs) < 0) {
      setError('Значения КБЖУ не могут быть отрицательными.');
      return;
    }

    try {
      if (editingId) {
        await updateProduct(editingId, form);
        setMessage('Товар обновлен.');
      } else {
        await createProduct(form);
        setMessage('Товар создан.');
      }

      resetForm();
      loadData();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleDelete(productId) {
    setMessage('');
    setError('');

    try {
      await deleteProduct(productId);
      setMessage('Товар удален.');
      loadData();
      if (editingId === productId) resetForm();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleCategorySubmit(event) {
    event.preventDefault();
    setCategoryMessage('');
    setCategoryError('');

    if (categoryName.trim().length < 2) {
      setCategoryError('Название категории должно содержать минимум 2 символа.');
      return;
    }

    try {
      await createCategory({ name: categoryName });
      setCategoryName('');
      setCategoryMessage('Категория создана.');
      loadData();
    } catch (requestError) {
      setCategoryError(requestError.message);
    }
  }

  async function handleOrderStatusChange(orderId, status) {
    setOrderMessage('');
    setOrderError('');

    try {
      await updateOrderStatus(orderId, status);
      setOrderMessage(`Статус заказа #${orderId} обновлен.`);
      loadData();
    } catch (requestError) {
      setOrderError(requestError.message);
    }
  }

  function renderProductForm() {
    return (
      <form className="admin-panel border rounded-2 bg-white p-4" onSubmit={handleSubmit}>
        <h2 className="h4 mb-3">{editingId ? 'Редактировать товар' : 'Создать товар'}</h2>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <label className="form-label" htmlFor="name">
            Название
          </label>
          <input
            className="form-control"
            id="name"
            name="name"
            type="text"
            required
            minLength="2"
            value={form.name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="description">
            Описание
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows="4"
            required
            minLength="10"
            value={form.description}
            onChange={handleChange}
          />
        </div>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="price">
              Цена
            </label>
            <input
              className="form-control"
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0.01"
              required
              value={form.price}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="unit">
              Единица
            </label>
            <select
              className="form-select"
              id="unit"
              name="unit"
              required
              value={form.unit}
              onChange={handleChange}
            >
              {Object.entries(unitLabels).map(([value, label]) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="category_id">
              Категория
            </label>
            <select
              className="form-select"
              id="category_id"
              name="category_id"
              required
              value={form.category_id}
              onChange={handleChange}
            >
              <option value="">Выберите...</option>
              {categories.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="my-3">
          <label className="form-label" htmlFor="image_url">
            URL изображения
          </label>
          <input
            className="form-control"
            id="image_url"
            name="image_url"
            type="url"
            required
            value={form.image_url}
            onChange={handleChange}
          />
        </div>
        <div className="admin-form-section">
          <h3 className="h6 text-muted mb-3">КБЖУ на 100 г</h3>
          <div className="row g-3">
            <div className="col-6">
              <label className="form-label" htmlFor="calories">
                Калории
              </label>
              <input
                className="form-control"
                id="calories"
                name="calories"
                type="number"
                min="0"
                required
                value={form.calories}
                onChange={handleChange}
              />
            </div>
            <div className="col-6">
              <label className="form-label" htmlFor="protein">
                Белки
              </label>
              <input
                className="form-control"
                id="protein"
                name="protein"
                type="number"
                step="0.1"
                min="0"
                required
                value={form.protein}
                onChange={handleChange}
              />
            </div>
            <div className="col-6">
              <label className="form-label" htmlFor="fat">
                Жиры
              </label>
              <input
                className="form-control"
                id="fat"
                name="fat"
                type="number"
                step="0.1"
                min="0"
                required
                value={form.fat}
                onChange={handleChange}
              />
            </div>
            <div className="col-6">
              <label className="form-label" htmlFor="carbs">
                Углеводы
              </label>
              <input
                className="form-control"
                id="carbs"
                name="carbs"
                type="number"
                step="0.1"
                min="0"
                required
                value={form.carbs}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mt-3">
            <label className="form-label" htmlFor="ingredients">
              Состав
            </label>
            <textarea
              className="form-control"
              id="ingredients"
              name="ingredients"
              rows="2"
              required
              value={form.ingredients}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-check form-switch mb-3">
          <input
            className="form-check-input"
            id="is_featured"
            name="is_featured"
            type="checkbox"
            checked={form.is_featured}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="is_featured">
            Показывать на главной
          </label>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-success" type="submit">
            {editingId ? 'Сохранить' : 'Создать'}
          </button>
          {editingId && (
            <button className="btn btn-outline-secondary" type="button" onClick={resetForm}>
              Отмена
            </button>
          )}
        </div>
      </form>
    );
  }

  function renderProductsTable() {
    return (
      <div className="admin-panel table-responsive border rounded-2 bg-white">
        <table className="table align-middle mb-0">
          <thead>
            <tr>
              <th>Товар</th>
              <th>Категория</th>
              <th>Цена</th>
              <th className="text-end">Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="admin-product-cell">
                    <img src={product.image_url} alt={product.name} />
                    <span>{product.name}</span>
                  </div>
                </td>
                <td>{product.category?.name}</td>
                <td>{Number(product.price).toFixed(2)} ₽ / {unitLabels[product.unit] || product.unit}</td>
                <td className="text-end">
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      type="button"
                      onClick={() => startEdit(product)}
                    >
                      Изменить
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      type="button"
                      onClick={() => handleDelete(product.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="4" className="text-muted">
                  Товаров пока нет.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  function renderProductsPage() {
    return (
      <>
        <div className="admin-section-heading">
          <div>
            <p className="text-uppercase text-success fw-semibold mb-2">Товары</p>
            <h1 className="h2 mb-1">Каталог товаров</h1>
            <p className="text-muted mb-0">Создавайте товары, редактируйте цену и подробности для карточки товара.</p>
          </div>
        </div>
        <div className="row g-4">
          <div className="col-xl-5">{renderProductForm()}</div>
          <div className="col-xl-7">{renderProductsTable()}</div>
        </div>
      </>
    );
  }

  function renderCategoriesPage() {
    return (
      <>
        <div className="admin-section-heading">
          <div>
            <p className="text-uppercase text-success fw-semibold mb-2">Категории</p>
            <h1 className="h2 mb-1">Разделы каталога</h1>
            <p className="text-muted mb-0">Добавляйте категории, которые затем появятся в каталоге и форме товара.</p>
          </div>
        </div>
        <div className="row g-4">
          <div className="col-lg-5">
            <form className="admin-panel border rounded-2 bg-white p-4" onSubmit={handleCategorySubmit}>
              <h2 className="h4 mb-3">Создать категорию</h2>
              {categoryMessage && <div className="alert alert-success">{categoryMessage}</div>}
              {categoryError && <div className="alert alert-danger">{categoryError}</div>}
              <div className="mb-3">
                <label className="form-label" htmlFor="category_name">
                  Название категории
                </label>
                <input
                  className="form-control"
                  id="category_name"
                  name="category_name"
                  type="text"
                  required
                  minLength="2"
                  value={categoryName}
                  onChange={(event) => setCategoryName(event.target.value)}
                />
              </div>
              <button className="btn btn-success" type="submit">
                Создать категорию
              </button>
            </form>
          </div>
          <div className="col-lg-7">
            <div className="admin-panel border rounded-2 bg-white p-4">
              <h2 className="h4 mb-3">Существующие категории</h2>
              {categories.length === 0 ? (
                <p className="text-muted mb-0">Категорий пока нет.</p>
              ) : (
                <div className="admin-category-grid">
                  {categories.map((category) => (
                    <div className="admin-category-item" key={category.id}>
                      <strong>{category.name}</strong>
                      <span>
                        {products.filter((product) => product.category_id === category.id).length} товаров
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  function renderOrdersPage() {
    return (
      <>
        <div className="admin-section-heading">
          <div>
            <p className="text-uppercase text-success fw-semibold mb-2">Заказы</p>
            <h1 className="h2 mb-1">Отслеживание заказов</h1>
            <p className="text-muted mb-0">Следите за заказами клиентов и меняйте статусы выполнения.</p>
          </div>
          <div className="status-flow">
            {orderStatuses.map((status) => (
              <span key={status}>{statusLabels[status]}</span>
            ))}
          </div>
        </div>
        {orderMessage && <div className="alert alert-success">{orderMessage}</div>}
        {orderError && <div className="alert alert-danger">{orderError}</div>}
        <div className="admin-orders admin-panel border rounded-2 bg-white">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Заказ</th>
                  <th>Клиент</th>
                  <th>Товары</th>
                  <th>Итого</th>
                  <th>Статус</th>
                  <th>Доставка</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>#{order.id}</strong>
                      <div className="text-muted small">{new Date(order.createdAt).toLocaleString('ru-RU')}</div>
                    </td>
                    <td>
                      <strong>{order.delivery_name}</strong>
                      <div className="text-muted small">{order.delivery_phone}</div>
                    </td>
                    <td>
                      <ul className="admin-order-items">
                        {order.items.map((item) => (
                          <li key={item.id}>
                            {item.product.name} × {item.quantity}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>{Number(order.total_price).toFixed(2)} ₽</td>
                    <td>
                      <select
                        className={`form-select form-select-sm order-status order-status--${order.status}`}
                        value={order.status}
                        onChange={(event) => handleOrderStatusChange(order.id, event.target.value)}
                      >
                        {orderStatuses.map((status) => (
                          <option value={status} key={status}>
                            {statusLabels[status]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div>
                        {deliveryLabels[order.delivery_method] || order.delivery_method} / {paymentLabels[order.payment_method] || order.payment_method}
                      </div>
                      <div className="text-muted small">{order.delivery_address}</div>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-muted">
                      Заказов пока нет.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }

  function renderOverviewPage() {
    const latestOrders = orders.slice(0, 4);
    const latestProducts = products.slice(0, 4);

    return (
      <>
        <div className="admin-section-heading">
          <div>
            <p className="text-uppercase text-success fw-semibold mb-2">Админ-панель</p>
            <h1 className="h2 mb-1">Управление магазином</h1>
            <p className="text-muted mb-0">Краткая сводка по каталогу, категориям и заказам.</p>
          </div>
        </div>
        <div className="admin-dashboard-grid mb-4">
          <Link className="admin-dashboard-card" to="/admin/products">
            <span>Товары</span>
            <strong>{products.length}</strong>
          </Link>
          <Link className="admin-dashboard-card" to="/admin/categories">
            <span>Категории</span>
            <strong>{categories.length}</strong>
          </Link>
          <Link className="admin-dashboard-card" to="/admin/orders">
            <span>Заказы</span>
            <strong>{orders.length}</strong>
          </Link>
        </div>
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="admin-panel border rounded-2 bg-white p-4">
              <h2 className="h4 mb-3">Последние заказы</h2>
              {latestOrders.length === 0 ? (
                <p className="text-muted mb-0">Заказов пока нет.</p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {latestOrders.map((order) => (
                    <div className="admin-mini-row" key={order.id}>
                      <div>
                        <strong>Заказ #{order.id}</strong>
                        <span>{order.delivery_name}</span>
                      </div>
                      <span className={`order-status-badge order-status-badge--${order.status}`}>
                        {statusLabels[order.status]}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-6">
            <div className="admin-panel border rounded-2 bg-white p-4">
              <h2 className="h4 mb-3">Последние товары</h2>
              {latestProducts.length === 0 ? (
                <p className="text-muted mb-0">Товаров пока нет.</p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {latestProducts.map((product) => (
                    <div className="admin-mini-row" key={product.id}>
                      <div>
                        <strong>{product.name}</strong>
                        <span>{product.category?.name}</span>
                      </div>
                      <span>{Number(product.price).toFixed(2)} ₽</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <section className="admin-page">
      <div className="container py-5">
        <div className="admin-layout">
          <aside className="admin-sidebar">
            <Link className="admin-sidebar__brand" to="/admin">
              <img className="app-brand__mark" src="/images/organic-market-mark.png" alt="" />
              <span>Админка</span>
            </Link>
            <nav className="admin-sidebar__nav">
              <NavLink end to="/admin">
                Обзор
              </NavLink>
              <NavLink to="/admin/products">Товары</NavLink>
              <NavLink to="/admin/categories">Категории</NavLink>
              <NavLink to="/admin/orders">Заказы</NavLink>
            </nav>
            <div className="d-grid gap-2">
              <Link className="btn btn-outline-success" to="/products">
                Открыть магазин
              </Link>
              <button className="btn btn-outline-secondary" type="button" onClick={logout}>
                Выйти
              </button>
            </div>
          </aside>
          <div className="admin-content">
            {section === 'overview' && renderOverviewPage()}
            {section === 'products' && renderProductsPage()}
            {section === 'categories' && renderCategoriesPage()}
            {section === 'orders' && renderOrdersPage()}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminPanel;
