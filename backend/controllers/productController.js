const { Op } = require('sequelize');
const { Category, Product } = require('../models');

const productFields = [
  'name',
  'description',
  'price',
  'image_url',
  'category_id',
  'unit',
  'is_featured',
  'calories',
  'protein',
  'fat',
  'carbs',
  'ingredients',
];

function getProductValues(body) {
  const values = {};

  for (const field of productFields) {
    if (body[field] !== undefined) {
      values[field] = body[field];
    }
  }

  if (values.price !== undefined) values.price = Number(values.price);
  if (values.category_id !== undefined) values.category_id = Number(values.category_id);
  if (values.calories !== undefined) values.calories = Number(values.calories);
  if (values.protein !== undefined) values.protein = Number(values.protein);
  if (values.fat !== undefined) values.fat = Number(values.fat);
  if (values.carbs !== undefined) values.carbs = Number(values.carbs);
  if (values.is_featured !== undefined) values.is_featured = values.is_featured === true || values.is_featured === 'true';

  return values;
}

function validateProductFields(body, requireAll = true) {
  const {
    name,
    description,
    price,
    image_url,
    category_id,
    unit,
    calories,
    protein,
    fat,
    carbs,
    ingredients,
  } = body;
  const errors = [];

  if (requireAll || name !== undefined) {
    if (!name || name.trim().length < 2) errors.push('Название товара обязательно');
  }

  if (requireAll || description !== undefined) {
    if (!description || description.trim().length < 10) {
      errors.push('Описание должно содержать минимум 10 символов');
    }
  }

  if (requireAll || price !== undefined) {
    if (price === undefined || Number(price) <= 0) errors.push('Цена должна быть больше 0');
  }

  if (requireAll || image_url !== undefined) {
    if (!image_url || image_url.trim().length < 5) errors.push('URL изображения обязателен');
  }

  if (requireAll || category_id !== undefined) {
    if (!category_id || Number.isNaN(Number(category_id))) errors.push('Категория обязательна');
  }

  if (requireAll || unit !== undefined) {
    if (!unit || unit.trim().length < 1) errors.push('Единица измерения обязательна');
  }

  if (requireAll || calories !== undefined) {
    if (calories === undefined || Number(calories) < 0) errors.push('Калории не могут быть отрицательными');
  }

  for (const [fieldName, value] of [
    ['Белки', protein],
    ['Жиры', fat],
    ['Углеводы', carbs],
  ]) {
    if (requireAll || value !== undefined) {
      if (value === undefined || Number(value) < 0) errors.push(`${fieldName} не могут быть отрицательными`);
    }
  }

  if (requireAll || ingredients !== undefined) {
    if (!ingredients || ingredients.trim().length < 2) errors.push('Состав обязателен');
  }

  return errors;
}

async function getProducts(req, res) {
  try {
    const { categoryId, search, minPrice, maxPrice, sort, featured } = req.query;
    const where = {};

    if (categoryId) {
      where.category_id = categoryId;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = Number(minPrice);
      if (maxPrice) where.price[Op.lte] = Number(maxPrice);
    }

    if (featured === 'true') {
      where.is_featured = true;
    }

    const order = {
      price_asc: [['price', 'ASC']],
      price_desc: [['price', 'DESC']],
      name_asc: [['name', 'ASC']],
      newest: [['createdAt', 'DESC']],
    }[sort] || [['is_featured', 'DESC'], ['createdAt', 'DESC']];

    const products = await Product.findAll({
      where,
      include: [{ model: Category, as: 'category' }],
      order,
    });

    return res.json(products);
  } catch (error) {
    return res.status(500).json({ error: 'Не удалось загрузить товары' });
  }
}

async function getProductById(req, res) {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category, as: 'category' }],
    });

    if (!product) {
      return res.status(404).json({ error: 'Товар не найден' });
    }

    return res.json(product);
  } catch (error) {
    return res.status(500).json({ error: 'Не удалось загрузить товар' });
  }
}

async function createProduct(req, res) {
  try {
    const errors = validateProductFields(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(', ') });
    }

    const category = await Category.findByPk(req.body.category_id);
    if (!category) {
      return res.status(400).json({ error: 'Категория не существует' });
    }

    const product = await Product.create(getProductValues(req.body));
    const productWithCategory = await Product.findByPk(product.id, {
      include: [{ model: Category, as: 'category' }],
    });

    return res.status(201).json(productWithCategory);
  } catch (error) {
    return res.status(500).json({ error: 'Не удалось создать товар' });
  }
}

async function updateProduct(req, res) {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Товар не найден' });
    }

    const errors = validateProductFields(req.body, false);
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(', ') });
    }

    if (req.body.category_id) {
      const category = await Category.findByPk(req.body.category_id);
      if (!category) {
        return res.status(400).json({ error: 'Категория не существует' });
      }
    }

    const values = getProductValues(req.body);

    await product.update(values);
    const productWithCategory = await Product.findByPk(product.id, {
      include: [{ model: Category, as: 'category' }],
    });

    return res.json(productWithCategory);
  } catch (error) {
    return res.status(500).json({ error: 'Не удалось обновить товар' });
  }
}

async function deleteProduct(req, res) {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Товар не найден' });
    }

    await product.destroy();
    return res.json({ message: 'Товар удален' });
  } catch (error) {
    return res.status(500).json({ error: 'Не удалось удалить товар' });
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
