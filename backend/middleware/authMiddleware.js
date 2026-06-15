const jwt = require('jsonwebtoken');
const { User } = require('../models');

async function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Требуется токен авторизации' });
  }

  const token = header.split(' ')[1];
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET || 'development_secret');
  } catch (error) {
    return res.status(401).json({ error: 'Токен недействителен или истек' });
  }

  try {
    const user = await User.findByPk(payload.id);
    if (!user) {
      return res.status(401).json({ error: 'Пользователь не найден' });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(500).json({ error: 'Не удалось проверить пользователя' });
  }
}

module.exports = authMiddleware;
