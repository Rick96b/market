const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const { Category, Product, User } = require('../models');

const categories = [
  { name: 'Фрукты', legacyName: 'Fruits' },
  { name: 'Овощи', legacyName: 'Vegetables' },
  { name: 'Молочные продукты', legacyName: 'Dairy' },
  { name: 'Выпечка', legacyName: 'Bakery' },
];

const products = [
  {
    name: 'Органические яблоки',
    legacyName: 'Organic Apples',
    description: 'Свежие сладкие яблоки с местной органической фермы.',
    price: 249,
    image_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=900&q=80',
    category: 'Фрукты',
    unit: 'kg',
    is_featured: true,
    calories: 52,
    protein: 0.3,
    fat: 0.2,
    carbs: 14,
    ingredients: 'Органические яблоки',
  },
  {
    name: 'Зеленые авокадо',
    legacyName: 'Green Avocados',
    description: 'Спелые мягкие авокадо для салатов, тостов и полезных перекусов.',
    price: 189,
    image_url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=900&q=80',
    category: 'Фрукты',
    unit: 'piece',
    is_featured: true,
    calories: 160,
    protein: 2,
    fat: 14.7,
    carbs: 8.5,
    ingredients: 'Свежий авокадо',
  },
  {
    name: 'Свежая морковь',
    legacyName: 'Fresh Carrots',
    description: 'Хрустящая морковь, выращенная без синтетических пестицидов.',
    price: 119,
    image_url: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=900&q=80',
    category: 'Овощи',
    unit: 'kg',
    is_featured: false,
    calories: 41,
    protein: 0.9,
    fat: 0.2,
    carbs: 10,
    ingredients: 'Органическая морковь',
  },
  {
    name: 'Томаты черри',
    legacyName: 'Cherry Tomatoes',
    description: 'Сочные томаты черри с ярким садовым вкусом.',
    price: 169,
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=900&q=80',
    category: 'Овощи',
    unit: 'box',
    is_featured: true,
    calories: 18,
    protein: 0.9,
    fat: 0.2,
    carbs: 3.9,
    ingredients: 'Томаты черри',
  },
  {
    name: 'Фермерское молоко',
    legacyName: 'Farm Milk',
    description: 'Свежее органическое молоко от коров на травяном откорме.',
    price: 95,
    image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=900&q=80',
    category: 'Молочные продукты',
    unit: 'liter',
    is_featured: false,
    calories: 62,
    protein: 3.2,
    fat: 3.4,
    carbs: 4.7,
    ingredients: 'Органическое коровье молоко',
  },
  {
    name: 'Цельнозерновой хлеб',
    legacyName: 'Whole Grain Bread',
    description: 'Мягкий хлеб на натуральной закваске с цельнозерновой мукой.',
    price: 140,
    image_url: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=900&q=80',
    category: 'Выпечка',
    unit: 'loaf',
    is_featured: true,
    calories: 247,
    protein: 9,
    fat: 3.5,
    carbs: 41,
    ingredients: 'Цельнозерновая мука, вода, закваска, соль, семечки',
  },
];

async function seedData() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@organic.local';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminName = process.env.ADMIN_NAME || 'Администратор';
  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
  const admin = await User.findOne({ where: { email: adminEmail } });

  if (!admin) {
    await User.create({
      name: adminName,
      email: adminEmail,
      password_hash: adminPasswordHash,
      role: 'admin',
    });
  } else {
    await admin.update({
      name: adminName,
      password_hash: adminPasswordHash,
      role: 'admin',
    });
  }

  const categoryMap = {};

  for (const categoryData of categories) {
    let category = await Category.findOne({
      where: {
        name: {
          [Op.in]: [categoryData.name, categoryData.legacyName],
        },
      },
    });

    if (!category) {
      category = await Category.create({ name: categoryData.name });
    } else if (category.name !== categoryData.name) {
      await category.update({ name: categoryData.name });
    }

    categoryMap[categoryData.name] = category;
  }

  for (const product of products) {
    const category = categoryMap[product.category];
    const productValues = {
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image_url,
      category_id: category.id,
      unit: product.unit,
      is_featured: product.is_featured,
      calories: product.calories,
      protein: product.protein,
      fat: product.fat,
      carbs: product.carbs,
      ingredients: product.ingredients,
    };

    let productRecord = await Product.findOne({
      where: {
        name: {
          [Op.in]: [product.name, product.legacyName],
        },
      },
    });

    if (!productRecord) {
      productRecord = await Product.create(productValues);
    } else {
      await productRecord.update(productValues);
    }
  }
}

module.exports = seedData;
