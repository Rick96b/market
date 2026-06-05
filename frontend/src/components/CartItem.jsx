import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

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

function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();
  const subtotal = Number(item.product.price) * item.quantity;
  const unitLabel = formatUnit(item.product.unit);

  return (
    <div className="cart-row border rounded-2 p-3 bg-white">
      <img className="cart-row__image" src={item.product.image_url} alt={item.product.name} />
      <div className="cart-row__body">
        <Link className="fw-semibold text-decoration-none text-dark" to={`/products/${item.product.id}`}>
          {item.product.name}
        </Link>
        <div className="text-muted small">
          {Number(item.product.price).toFixed(2)} ₽ за {unitLabel}
        </div>
      </div>
      <input
        className="form-control cart-row__quantity"
        type="number"
        min="1"
        value={item.quantity}
        onChange={(event) => updateQuantity(item.product.id, event.target.value)}
        aria-label={`Количество для ${item.product.name}`}
      />
      <strong className="cart-row__price">{subtotal.toFixed(2)} ₽</strong>
      <button
        className="btn btn-outline-danger btn-sm"
        type="button"
        onClick={() => removeFromCart(item.product.id)}
      >
        Удалить
      </button>
    </div>
  );
}

export default CartItem;
