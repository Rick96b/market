import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import CategoryFilter from '../components/CategoryFilter.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { getCategoryAsset } from '../data/categoryAssets.js';
import { getCategories, getProducts } from '../services/productService.js';

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categoryId = searchParams.get('categoryId') || '';
  const showListing = Boolean(categoryId) || searchParams.get('view') === 'all';
  const selectedCategory = useMemo(
    () => categories.find((category) => String(category.id) === categoryId),
    [categories, categoryId]
  );

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
    getProducts({ sort: 'newest' }).then(setCategoryProducts).catch(() => setCategoryProducts([]));
  }, []);

  useEffect(() => {
    if (!showListing) {
      setProducts([]);
      setLoading(false);
      setError('');
      return;
    }

    setLoading(true);
    setError('');
    getProducts({ categoryId, search, minPrice, maxPrice, sort })
      .then(setProducts)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [categoryId, search, minPrice, maxPrice, sort, showListing]);

  function handleCategoryChange(nextCategoryId) {
    if (nextCategoryId) {
      setSearchParams({ categoryId: nextCategoryId });
      return;
    }

    setSearchParams({ view: 'all' });
  }

  function resetFilters() {
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
  }

  return (
    <section className="catalog-page">
      <div className="container py-5">
        <div className="catalog-hero mb-4">
          <div>
            <p className="text-uppercase text-success fw-semibold mb-2">Каталог магазина</p>
            <h1 className="h2 mb-2">Выберите категорию продуктов</h1>
            <p className="text-muted mb-0">
              Овощи, фрукты, молочные продукты и выпечка собраны в отдельные разделы.
            </p>
          </div>
          <Link className="btn btn-success" to="/products?view=all" onClick={resetFilters}>
            Смотреть все товары
          </Link>
        </div>

        <div className="category-showcase mb-5">
          {categories.map((category) => {
            const asset = getCategoryAsset(category.name);
            const productCount = categoryProducts.filter((product) => product.category_id === category.id).length;

            return (
              <Link
                className={`category-tile ${categoryId === String(category.id) ? 'category-tile--active' : ''}`}
                to={`/products?categoryId=${category.id}`}
                key={category.id}
                onClick={resetFilters}
              >
                <img src={asset.image} alt={category.name} />
                <span className="category-tile__shade" />
                <span className="category-tile__content">
                  <strong>{category.name}</strong>
                  <span>{asset.description}</span>
                  <small>{productCount} позиций</small>
                </span>
              </Link>
            );
          })}
        </div>

        {!showListing && (
          <div className="catalog-prompt">
            <div>
              <h2 className="h4">Свежие продукты по разделам</h2>
              <p className="text-muted mb-0">
                Выберите интересующий раздел или откройте весь ассортимент магазина.
              </p>
            </div>
            <Link className="btn btn-outline-success" to="/products?view=all">
              Открыть общий список
            </Link>
          </div>
        )}

        {showListing && (
          <>
            <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
              <div>
                <p className="text-uppercase text-success fw-semibold mb-2">
                  {selectedCategory ? 'Товары категории' : 'Все товары'}
                </p>
                <h2 className="h3 mb-1">{selectedCategory?.name || 'Все товары магазина'}</h2>
                <p className="text-muted mb-0">
                  {selectedCategory
                    ? getCategoryAsset(selectedCategory.name).description
                    : 'Полный список продуктов со всех разделов магазина.'}
                </p>
              </div>
              <form className="product-search" role="search" onSubmit={(event) => event.preventDefault()}>
                <input
                  className="form-control"
                  type="search"
                  placeholder="Поиск по товару"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </form>
            </div>

            <div className="catalog-controls border rounded-2 bg-white p-3 mb-4">
              <div className="mb-3">
                <CategoryFilter categories={categories} selectedCategory={categoryId} onChange={handleCategoryChange} />
              </div>
              <div className="row g-3 align-items-end">
                <div className="col-sm-6 col-lg-2">
                  <label className="form-label" htmlFor="minPrice">
                    Цена от
                  </label>
                  <input
                    className="form-control"
                    id="minPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={minPrice}
                    onChange={(event) => setMinPrice(event.target.value)}
                  />
                </div>
                <div className="col-sm-6 col-lg-2">
                  <label className="form-label" htmlFor="maxPrice">
                    Цена до
                  </label>
                  <input
                    className="form-control"
                    id="maxPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={maxPrice}
                    onChange={(event) => setMaxPrice(event.target.value)}
                  />
                </div>
                <div className="col-lg-3">
                  <label className="form-label" htmlFor="sort">
                    Сортировка
                  </label>
                  <select className="form-select" id="sort" value={sort} onChange={(event) => setSort(event.target.value)}>
                    <option value="newest">Сначала новые</option>
                    <option value="price_asc">Сначала дешевле</option>
                    <option value="price_desc">Сначала дороже</option>
                    <option value="name_asc">По названию</option>
                  </select>
                </div>
                <div className="col-lg-2 text-lg-end">
                  <span className="badge text-bg-light border">Найдено: {products.length}</span>
                </div>
              </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {loading && <div className="alert alert-info">Загружаем товары...</div>}

            {!loading && products.length === 0 && (
              <div className="alert alert-warning">Товары не найдены. Попробуйте другую категорию или запрос.</div>
            )}

            <div className="row g-4">
              {products.map((product) => (
                <div className="col-md-6 col-xl-4" key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default Products;
