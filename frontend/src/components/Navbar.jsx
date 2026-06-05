import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import ContactModal from './ContactModal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

function Navbar() {
  const { count } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [contactOpen, setContactOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg app-navbar sticky-top">
        <div className="container">
          <Link className="navbar-brand app-brand" to="/">
            <img className="app-brand__mark" src="/images/organic-market-mark.png" alt="" />
            <span>Органик Маркет</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-controls="mainNavbar"
            aria-expanded="false"
            aria-label="Открыть меню"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav app-nav-links me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  Главная
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/products">
                  Каталог
                </NavLink>
              </li>
              <li className="nav-item">
                <button className="nav-link app-nav-button" type="button" onClick={() => setContactOpen(true)}>
                  Связаться
                </button>
              </li>
            </ul>

            <div className="app-nav-actions">
              <NavLink className="btn btn-outline-success btn-sm cart-link" to="/cart">
                Корзина <span>{count}</span>
              </NavLink>
              {user ? (
                <>
                  <span className="small text-muted">Привет, {user.name}</span>
                  <NavLink className="btn btn-outline-secondary btn-sm" to="/orders">
                    Мои заказы
                  </NavLink>
                  <button className="btn btn-success btn-sm" type="button" onClick={handleLogout}>
                    Выйти
                  </button>
                </>
              ) : (
                <>
                  <NavLink className="btn btn-outline-secondary btn-sm" to="/login">
                    Войти
                  </NavLink>
                  <NavLink className="btn btn-success btn-sm" to="/register">
                    Регистрация
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}

export default Navbar;
