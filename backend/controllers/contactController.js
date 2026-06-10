const { ContactRequest } = require('../models');
const { sendContactEmail } = require('../services/mailService');
const { logError } = require('../utils/logger');

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function createContactRequest(req, res) {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Имя, email и сообщение обязательны' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Некорректный email' });
    }

    if (message.trim().length < 10) {
      return res.status(400).json({ error: 'Сообщение должно содержать минимум 10 символов' });
    }

    const contactRequest = await ContactRequest.create({ name, email, message });
    await sendContactEmail(contactRequest);

    return res.status(201).json({
      ...contactRequest.toJSON(),
      emailSent: true,
    });
  } catch (error) {
    logError('createContactRequest', error);
    return res.status(500).json({ error: 'Не удалось отправить заявку' });
  }
}

async function getContactRequests(req, res) {
  try {
    const contactRequests = await ContactRequest.findAll({ order: [['createdAt', 'DESC']] });
    return res.json(contactRequests);
  } catch (error) {
    logError('getContactRequests', error);
    return res.status(500).json({ error: 'Не удалось загрузить заявки' });
  }
}

module.exports = {
  createContactRequest,
  getContactRequests,
};
