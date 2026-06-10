const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const contactRoutes = require('./routes/contactRoutes');
const seedData = require('./seeders/seedData');
const { logError } = require('./utils/logger');

dotenv.config();

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Backend is running' });
});

async function healthCheck(req, res) {
  try {
    await sequelize.query('SELECT 1');
    return res.json({ status: 'ok', database: 'ok' });
  } catch (error) {
    logError('healthCheck.database', error);
    return res.status(503).json({ status: 'error', database: 'unavailable' });
  }
}

app.get('/health', healthCheck);
app.get('/api/health', healthCheck);

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((error, req, res, next) => {
  logError(`${req.method} ${req.originalUrl}`, error);

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Некорректный JSON в теле запроса' });
  }

  return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

const port = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    await seedData();
    app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
    });
  } catch (error) {
    logError('startup', error);
    process.exit(1);
  }
}

start();
