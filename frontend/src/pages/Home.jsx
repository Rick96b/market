import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ContactModal from '../components/ContactModal.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { getCategoryAsset } from '../data/categoryAssets.js';
import { getCategories, getProducts } from '../services/productService.js';

function AboutIcon({ type }) {
  const icons = {
    sprout: (
      <>
        <path d="M12 20V9" />
        <path d="M12 9c-4.2 0-6.5-2-7-5 4.4.2 6.7 2.2 7 5Z" />
        <path d="M12 9c4.2 0 6.5-2 7-5-4.4.2-6.7 2.2-7 5Z" />
      </>
    ),
    truck: (
      <>
        <path d="M3 7h10v9H3z" />
        <path d="M13 10h4l3 3v3h-7z" />
        <path d="M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
        <path d="M17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      </>
    ),
    clipboard: (
      <>
        <path d="M8 5h8" />
        <path d="M9 3h6v4H9z" />
        <path d="M6 5H5v17h14V5h-1" />
        <path d="M8 12h8" />
        <path d="M8 16h5" />
      </>
    ),
    basket: (
      <>
        <path d="M5 10h14l-2 10H7L5 10Z" />
        <path d="M9 10 12 4l3 6" />
        <path d="M9 14h6" />
        <path d="M8 17h8" />
      </>
    ),
    farm: (
      <>
        <path d="M4 20V9l8-5 8 5v11" />
        <path d="M8 20v-6h8v6" />
        <path d="M10 11h4" />
      </>
    ),
    nutrition: (
      <>
        <path d="M6 4h12v18H6z" />
        <path d="M9 8h6" />
        <path d="M9 12h6" />
        <path d="M9 16h3" />
      </>
    ),
    order: (
      <>
        <path d="M6 8h12v12H6z" />
        <path d="M9 8a3 3 0 0 1 6 0" />
        <path d="m10 14 2 2 4-5" />
      </>
    ),
    pin: (
      <>
        <path d="M12 22s6-5.3 6-11a6 6 0 1 0-12 0c0 5.7 6 11 6 11Z" />
        <path d="M12 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-3.5 8-11V5l-8-3-8 3v6c0 7.5 8 11 8 11Z" />
        <path d="m9 12 2 2 4-5" />
      </>
    ),
    clock: (
      <>
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  };

  return (
    <svg className="about-icon-svg" viewBox="0 0 24 24" aria-hidden="true">
      {icons[type]}
    </svg>
  );
}

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    Promise.all([getProducts({ featured: true, sort: 'newest' }), getCategories()])
      .then(([productData, categoryData]) => {
        setProducts(productData.slice(0, 3));
        setCategories(categoryData.slice(0, 4));
      })
      .catch(() => {
        setProducts([]);
        setCategories([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="home-hero">
        <div className="container home-hero__content">
          <div className="col-lg-8 col-xl-7">
            <p className="text-uppercase fw-semibold text-success mb-2">Интернет-магазин органических продуктов</p>
            <h1 className="display-4 fw-bold mb-3">Свежие продукты для кухни каждый день</h1>
            <p className="lead mb-4">
              Фермерские овощи, фрукты, молочные продукты и свежая выпечка с понятным составом,
              удобным каталогом и быстрой доставкой по городу.
            </p>
            <div className="d-flex gap-2 flex-wrap">
              <Link className="btn btn-success btn-lg" to="/products">
                Перейти в каталог
              </Link>
              <button className="btn btn-outline-dark btn-lg" type="button" onClick={() => setContactOpen(true)}>
                Связаться с нами
              </button>
            </div>
            <div className="hero-stats mt-4">
              <div>
                <strong>Ежедневно</strong>
                <span>поставки каждый день</span>
              </div>
              <div>
                <strong>Локально</strong>
                <span>фермерские поставщики</span>
              </div>
              <div>
                <strong>Под контролем</strong>
                <span>корзина и статусы заказов</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-market-strip">
        <div className="container">
          <div className="home-market-strip__inner">
            <div>
              <span>Склад</span>
              <strong>заказы собираются после оплаты</strong>
            </div>
            <div>
              <span>Каталог</span>
              <strong>категории, поиск и сортировка</strong>
            </div>
            <div>
              <span>Заказы</span>
              <strong>статусы меняются по мере сборки</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="section-heading">
          <div>
            <p className="text-uppercase text-success fw-semibold mb-2">Разделы магазина</p>
            <h2 className="h3 mb-1">Покупки начинаются с категории</h2>
          </div>
          <Link className="btn btn-outline-success" to="/products">
            Открыть каталог
          </Link>
        </div>

        <div className="home-category-grid">
          {categories.map((category) => {
            const asset = getCategoryAsset(category.name);

            return (
              <Link className="home-category-card" to={`/products?categoryId=${category.id}`} key={category.id}>
                <img src={asset.image} alt={category.name} />
                <span>
                  <strong>{category.name}</strong>
                  <small>{asset.description}</small>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="home-about">
        <div className="container">
          <div className="home-about__top">
            <div className="home-about__media">
              <img
                src="https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=1200&q=80"
                alt="Свежие овощи на фермерском рынке"
              />
              <div className="home-about__photo-note">
                <span className="home-about__photo-icon">
                  <AboutIcon type="sprout" />
                </span>
                <div>
                  <strong>Свежие продукты с локальных ферм</strong>
                  <span>Без лишних звеньев и посредников</span>
                </div>
              </div>
            </div>

            <div className="home-about__content">
              <p className="text-uppercase text-success fw-semibold mb-2">О магазине</p>
              <h2>Органик Маркет собирает продукты для обычной домашней кухни</h2>
              <p className="home-about__lead">
                В каталоге собраны базовые продукты на каждый день: овощи, фрукты, молоко, хлеб и
                сезонные позиции. У каждого товара есть цена, описание, состав и КБЖУ в подробной
                карточке.
              </p>

              <div className="home-about__steps">
                <article className="home-about__step">
                  <div className="home-about__step-head">
                    <span>1</span>
                    <AboutIcon type="truck" />
                  </div>
                  <h3>Поставка</h3>
                  <p>Работаем с проверенными локальными фермами и пекарнями.</p>
                </article>
                <article className="home-about__step">
                  <div className="home-about__step-head">
                    <span>2</span>
                    <AboutIcon type="clipboard" />
                  </div>
                  <h3>Проверка состава</h3>
                  <p>Проверяем описание, состав и данные для карточки товара.</p>
                </article>
                <article className="home-about__step">
                  <div className="home-about__step-head">
                    <span>3</span>
                    <AboutIcon type="basket" />
                  </div>
                  <h3>Сборка заказа</h3>
                  <p>Аккуратно собираем заказ и готовим его к передаче.</p>
                </article>
              </div>

              <div className="home-about__summary">
                <span className="home-about__summary-icon">
                  <AboutIcon type="sprout" />
                </span>
                <strong>150+ локальных поставщиков</strong>
                <span className="home-about__summary-text">Карточки с КБЖУ для осознанного выбора</span>
              </div>
            </div>
          </div>
        </div>

        <div className="home-about__bottom">
          <div className="container">
            <div className="home-about__benefits">
              <article className="home-about__benefit">
                <span className="home-about__benefit-icon">
                  <AboutIcon type="farm" />
                </span>
                <div>
                  <h3>Поставщики рядом</h3>
                  <p>Товары привозятся небольшими партиями от локальных ферм и пекарен.</p>
                </div>
                <div className="home-about__benefit-meta">
                  <span>
                    <AboutIcon type="pin" /> Рядом с вами
                  </span>
                  <span>Без долгих перевозок</span>
                </div>
              </article>

              <article className="home-about__benefit">
                <span className="home-about__benefit-icon">
                  <AboutIcon type="nutrition" />
                </span>
                <div>
                  <h3>Прозрачная карточка</h3>
                  <p>В подробной карточке указаны состав, КБЖУ и понятное описание товара.</p>
                </div>
                <div className="home-about__benefit-meta">
                  <span>
                    <AboutIcon type="shield" /> Честная информация
                  </span>
                  <span>КБЖУ и состав</span>
                </div>
              </article>

              <article className="home-about__benefit">
                <span className="home-about__benefit-icon">
                  <AboutIcon type="order" />
                </span>
                <div>
                  <h3>Понятный заказ</h3>
                  <p>После оформления заказ проходит понятные этапы от подтверждения до доставки.</p>
                </div>
                <div className="home-about__benefit-meta">
                  <span>
                    <AboutIcon type="clock" /> Статус на каждом этапе
                  </span>
                  <span>Доставка вовремя</span>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="section-heading">
          <div>
            <h2 className="h3 mb-1">Популярные товары</h2>
            <p className="text-muted mb-0">Позиции, которые чаще всего добавляют в корзину.</p>
          </div>
          <Link className="btn btn-outline-success" to="/products">
            Смотреть все
          </Link>
        </div>

        {loading ? (
          <div className="alert alert-info">Загружаем товары...</div>
        ) : (
          <div className="row g-4">
            {products.map((product) => (
              <div className="col-md-6 col-lg-4 product-fade" key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="home-delivery">
        <div className="container">
          <div className="home-delivery__inner">
            <div>
              <p className="text-uppercase fw-semibold mb-2">Доставка и самовывоз</p>
              <h2 className="h3 mb-2">Заказ можно получить курьером или забрать самостоятельно</h2>
              <p className="mb-0">
                После оформления заказ проходит понятные этапы: новый, подтвержден, собирается,
                в пути или доставлен.
              </p>
            </div>
            <button className="btn btn-light btn-lg" type="button" onClick={() => setContactOpen(true)}>
              Задать вопрос
            </button>
          </div>
        </div>
      </section>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}

export default Home;
