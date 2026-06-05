import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    setValues({ ...values, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (values.name.trim().length < 2) {
      setError('Имя должно содержать минимум 2 символа.');
      return;
    }

    if (values.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов.');
      return;
    }

    setSubmitting(true);
    try {
      await register(values);
      navigate('/products');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="container py-5 auth-page">
      <div className="auth-panel border rounded-2 bg-white p-4">
        <h1 className="h3 mb-3">Регистрация</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" htmlFor="name">
              Имя
            </label>
            <input
              className="form-control"
              id="name"
              name="name"
              type="text"
              required
              minLength="2"
              value={values.name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="email">
              Электронная почта
            </label>
            <input
              className="form-control"
              id="email"
              name="email"
              type="email"
              required
              value={values.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="password">
              Пароль
            </label>
            <input
              className="form-control"
              id="password"
              name="password"
              type="password"
              required
              minLength="6"
              value={values.password}
              onChange={handleChange}
            />
          </div>
          <button className="btn btn-success w-100" type="submit" disabled={submitting}>
            {submitting ? 'Создаем...' : 'Создать аккаунт'}
          </button>
        </form>
        <p className="text-muted mt-3 mb-0">
          Уже зарегистрированы? <Link to="/login">Войдите</Link>.
        </p>
      </div>
    </section>
  );
}

export default Register;
