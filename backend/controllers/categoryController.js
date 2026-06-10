const { Category } = require('../models');
const { logError } = require('../utils/logger');

async function getCategories(req, res) {
  try {
    const categories = await Category.findAll({ order: [['name', 'ASC']] });
    return res.json(categories);
  } catch (error) {
    logError('getCategories', error);
    return res.status(500).json({ error: 'Не удалось загрузить категории' });
  }
}

async function createCategory(req, res) {
  try {
    const name = req.body.name ? req.body.name.trim() : '';

    if (name.length < 2) {
      return res.status(400).json({ error: 'Название категории должно содержать минимум 2 символа' });
    }

    const [category, created] = await Category.findOrCreate({
      where: { name },
      defaults: { name },
    });

    if (!created) {
      return res.status(400).json({ error: 'Такая категория уже существует' });
    }

    return res.status(201).json(category);
  } catch (error) {
    logError('createCategory', error);
    return res.status(500).json({ error: 'Не удалось создать категорию' });
  }
}

module.exports = {
  getCategories,
  createCategory,
};
