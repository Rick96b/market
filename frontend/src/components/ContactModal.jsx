import { useState } from 'react';
import { createPortal } from 'react-dom';
import useBodyScrollLock from '../hooks/useBodyScrollLock.js';
import { sendContactRequest } from '../services/contactService.js';

const emptyValues = {
  name: '',
  email: '',
  message: '',
};

function ContactModal({ open, onClose }) {
  const [values, setValues] = useState(emptyValues);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  useBodyScrollLock(open);

  if (!open) return null;

  function handleChange(event) {
    setValues({ ...values, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('');
    setError('');

    if (values.message.trim().length < 10) {
      setError('Сообщение должно содержать минимум 10 символов.');
      return;
    }

    setSubmitting(true);

    try {
      await sendContactRequest(values);
      setValues(emptyValues);
      setStatus('Сообщение отправлено.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return createPortal(
    <div className="feedback-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="feedback-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="feedback-modal-content">
          <div className="feedback-modal-header">
            <div>
              <p className="text-uppercase text-success fw-semibold mb-1">Обратная связь</p>
              <h2 className="h4 mb-0" id="feedback-modal-title">
                Напишите нам
              </h2>
            </div>
            <button className="btn-close" type="button" aria-label="Закрыть" onClick={onClose} />
          </div>

          <form className="feedback-modal-body" onSubmit={handleSubmit}>
            {status && <div className="alert alert-success">{status}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="mb-3">
              <label className="form-label" htmlFor="feedback-name">
                Имя
              </label>
              <input
                className="form-control"
                id="feedback-name"
                name="name"
                type="text"
                required
                minLength="2"
                value={values.name}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="feedback-email">
                Электронная почта
              </label>
              <input
                className="form-control"
                id="feedback-email"
                name="email"
                type="email"
                required
                value={values.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="form-label" htmlFor="feedback-message">
                Сообщение
              </label>
              <textarea
                className="form-control"
                id="feedback-message"
                name="message"
                rows="5"
                required
                minLength="10"
                value={values.message}
                onChange={handleChange}
              />
            </div>

            <div className="feedback-modal-footer">
              <button className="btn btn-outline-secondary" type="button" onClick={onClose}>
                Закрыть
              </button>
              <button className="btn btn-success" type="submit" disabled={submitting}>
                {submitting ? 'Отправляем...' : 'Отправить'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ContactModal;
