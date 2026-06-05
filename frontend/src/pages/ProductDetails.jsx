import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { getProduct } from '../services/productService.js';

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

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    getProduct(id)
      .then(setProduct)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [id]);

  function handleAddToCart() {
    addToCart(product, Number(quantity));
    setAdded(true);
  }

  if (loading) {
    return (
      <section className="container py-5">
        <div className="alert alert-info">Загружаем товар...</div>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="container py-5">
        <div className="alert alert-danger">{error || 'Товар не найден'}</div>
      </section>
    );
  }

  const unitLabel = formatUnit(product.unit);

  return (
    <section className="container py-5">
      <Link className="btn btn-outline-secondary btn-sm mb-4" to="/products">
        Назад в каталог
      </Link>
      <div className="row g-4 align-items-start">
        <div className="col-lg-6">
          <img className="details-image" src={product.image_url} alt={product.name} />
        </div>
        <div className="col-lg-6">
          <div className="d-flex flex-wrap gap-2 mb-3">
            <span className="badge text-bg-success">{product.category?.name}</span>
            {product.is_featured && <span className="badge text-bg-warning">Хит</span>}
          </div>
          <h1 className="display-6 fw-bold">{product.name}</h1>
          <p className="lead text-muted">{product.description}</p>
          <p className="h3 text-success">
            {Number(product.price).toFixed(2)} ₽ <span className="fs-6 text-muted">за {unitLabel}</span>
          </p>
          <div className="details-facts my-4">
            <div>
              <span>Категория</span>
              <strong>{product.category?.name}</strong>
            </div>
            <div>
              <span>Доставка</span>
              <strong>Сегодня или завтра</strong>
            </div>
          </div>
          <div className="details-extra bg-white border rounded-2 p-3">
            <p className="mb-0"><strong>Состав:</strong> {product.ingredients}</p>
          </div>
          <div className="d-flex flex-wrap gap-2 align-items-center mt-4">
            <input
              className="form-control details-quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              aria-label="Количество"
            />
            <button className="btn btn-success" type="button" onClick={handleAddToCart}>
              В корзину
            </button>
          </div>
          {added && <div className="alert alert-success mt-3">Товар добавлен в корзину.</div>}
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;
