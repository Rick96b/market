export const categoryAssets = {
  Фрукты: {
    image:
      'https://images.unsplash.com/photo-1619566636858-adf3ef4641b2?auto=format&fit=crop&w=900&q=80',
    description: 'Сезонные яблоки, авокадо и другие продукты для завтраков и перекусов.',
  },
  Овощи: {
    image:
      'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=900&q=80',
    description: 'Свежие овощи для салатов, супов, гарниров и домашней кухни.',
  },
  'Молочные продукты': {
    image:
      'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=900&q=80',
    description: 'Молоко и натуральные продукты от локальных поставщиков.',
  },
  Выпечка: {
    image:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
    description: 'Хлеб и выпечка на каждый день с понятным составом.',
  },
};

export const fallbackCategoryAsset = {
  image:
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80',
  description: 'Подборка свежих органических продуктов для ежедневных покупок.',
};

export function getCategoryAsset(categoryName) {
  return categoryAssets[categoryName] || fallbackCategoryAsset;
}
