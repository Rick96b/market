const jwt = require('jsonwebtoken');
const { User } = require('../models');

async function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Требуется токен авторизации' });
  }

  try {
    const token = header.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'development_secret');
    const user = await User.findByPk(payload.id);

    if (!user) {
      return res.status(401).json({ error: 'Пользователь не найден' });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Токен недействителен или истек' });
  }
}

module.exports = authMiddleware;
