import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import useBodyScrollLock from '../hooks/useBodyScrollLock.js';

const unitLabels = {
  kg: 'кг',
  piece: 'шт.',
  box: 'коробку',
  liter: 'л',
  loaf: 'буханку',
};

function formatUnit(unit) {
  return unitLabels[unit] || unit || 'ед.';
}

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [modalOpen, setModalOpen] = useState(false);
  const unitLabel = formatUnit(product.unit);
  useBodyScrollLock(modalOpen);

  const modal = modalOpen
    ? createPortal(
        <div className="product-modal-backdrop" role="presentation" onClick={() => setModalOpen(false)}>
          <div
            className="product-modal-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`product-${product.id}-title`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="product-modal-content">
              <div className="product-modal-header">
                <div>
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    <span className="badge text-bg-success">{product.category?.name}</span>
                    {product.is_featured && <span className="badge text-bg-warning">Хит</span>}
                  </div>
                  <h2 className="h4 mb-0" id={`product-${product.id}-title`}>
                    {product.name}
                  </h2>
                </div>
                <button className="btn-close" type="button" aria-label="Закрыть" onClick={() => setModalOpen(false)} />
              </div>

              <div className="product-modal-body">
                <img className="product-modal__image" src={product.image_url} alt={product.name} />
                <p className="text-muted mb-3">{product.description}</p>

                <div className="nutrition-grid mb-3" aria-label="КБЖУ на 100 грамм">
                  <div>
                    <span>Калории</span>
                    <strong>{product.calories} ккал</strong>
                  </div>
                  <div>
                    <span>Белки</span>
                    <strong>{Number(product.protein || 0).toFixed(1)} г</strong>
                  </div>
                  <div>
                    <span>Жиры</span>
                    <strong>{Number(product.fat || 0).toFixed(1)} г</strong>
                  </div>
                  <div>
                    <span>Углеводы</span>
                    <strong>{Number(product.carbs || 0).toFixed(1)} г</strong>
                  </div>
                </div>

                <div className="product-modal__facts">
                  <p>
                    <strong>Состав:</strong> {product.ingredients}
                  </p>
                </div>
              </div>

              <div className="product-modal-footer">
                <div>
                  <strong className="h4 text-success mb-0">{Number(product.price).toFixed(2)} ₽</strong>
                  <span className="text-muted small ms-2"> за {unitLabel}</span>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  <Link className="btn btn-outline-secondary" to={`/products/${product.id}`} onClick={() => setModalOpen(false)}>
                    Страница товара
                  </Link>
                  <button className="btn btn-success" type="button" onClick={() => addToCart(product)}>
                    В корзину
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <article className="card product-card h-100">
        <div className="product-card__media">
          <img src={product.image_url} className="card-img-top product-card__image" alt={product.name} />
          {product.is_featured && <span className="product-card__badge">Хит</span>}
        </div>
        <div className="card-body d-flex flex-column">
          <div className="d-flex justify-content-between gap-2 align-items-start">
            <h2 className="h5 card-title mb-1">{product.name}</h2>
            <span className="badge text-bg-light border">{product.category?.name}</span>
          </div>
          <p className="card-text text-muted product-card__text">{product.description}</p>
          <span className="text-muted small mb-3">Цена за {unitLabel}</span>
          <div className="mt-auto d-flex align-items-center justify-content-between gap-2">
            <strong className="text-success">{Number(product.price).toFixed(2)} ₽</strong>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-secondary btn-sm" type="button" onClick={() => setModalOpen(true)}>
                Подробнее
              </button>
              <button
                className="btn btn-success btn-sm"
                type="button"
                onClick={() => addToCart(product)}
              >
                В корзину
              </button>
            </div>
          </div>
        </div>
      </article>

      {modal}
    </>
  );
}

export default ProductCard;
