const { sequelize, Order, OrderItem, Product } = require('../models');
const { logError } = require('../utils/logger');

const ORDER_STATUSES = ['new', 'confirmed', 'packing', 'shipped', 'delivered', 'cancelled'];

async function rollbackTransaction(transaction, scope) {
  try {
    await transaction.rollback();
  } catch (error) {
    logError(`${scope}.rollback`, error);
  }
}

async function createOrder(req, res) {
  let transaction;

  try {
    const {
      items,
      delivery_name,
      delivery_phone,
      delivery_address,
      delivery_method,
      payment_method,
      note,
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Добавьте товары в заказ' });
    }

    if (!delivery_name || !delivery_phone || !delivery_address) {
      return res.status(400).json({ error: 'Имя, телефон и адрес доставки обязательны' });
    }

    transaction = await sequelize.transaction();

    const productIds = items.map((item) => item.productId);
    const products = await Product.findAll({
      where: { id: productIds },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (products.length !== productIds.length) {
      await rollbackTransaction(transaction, 'createOrder');
      return res.status(400).json({ error: 'Один или несколько товаров не найдены' });
    }

    let totalPrice = 0;
    const orderItems = items.map((item) => {
      const product = products.find((currentProduct) => currentProduct.id === Number(item.productId));
      const quantity = Number(item.quantity);

      if (!quantity || quantity < 1) {
        throw new Error('Количество должно быть больше 0');
      }

      const price = Number(product.price);
      totalPrice += price * quantity;

      return {
        product_id: product.id,
        quantity,
        price,
      };
    });

    const order = await Order.create(
      {
        user_id: req.user.id,
        total_price: totalPrice.toFixed(2),
        status: 'new',
        delivery_name,
        delivery_phone,
        delivery_address,
        delivery_method: delivery_method || 'courier',
        payment_method: payment_method || 'cash',
        note: note || '',
      },
      { transaction }
    );

    await OrderItem.bulkCreate(
      orderItems.map((item) => ({
        ...item,
        order_id: order.id,
      })),
      { transaction }
    );

    const orderWithItems = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }],
      transaction,
    });

    await transaction.commit();
    return res.status(201).json(orderWithItems);
  } catch (error) {
    if (transaction) {
      await rollbackTransaction(transaction, 'createOrder');
    }

    logError('createOrder', error);
    return res.status(400).json({ error: error.message || 'Не удалось создать заказ' });
  }
}

async function getMyOrders(req, res) {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }],
      order: [['createdAt', 'DESC']],
    });

    return res.json(orders);
  } catch (error) {
    logError('getMyOrders', error);
    return res.status(500).json({ error: 'Не удалось загрузить заказы' });
  }
}

async function getAllOrders(req, res) {
  try {
    const orders = await Order.findAll({
      include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }],
      order: [['createdAt', 'DESC']],
    });

    return res.json(orders);
  } catch (error) {
    logError('getAllOrders', error);
    return res.status(500).json({ error: 'Не удалось загрузить заказы' });
  }
}

async function updateOrderStatus(req, res) {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const { status } = req.body;

    if (!ORDER_STATUSES.includes(status)) {
      await rollbackTransaction(transaction, 'updateOrderStatus');
      return res.status(400).json({ error: 'Некорректный статус заказа' });
    }

    const order = await Order.findByPk(req.params.id, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!order) {
      await rollbackTransaction(transaction, 'updateOrderStatus');
      return res.status(404).json({ error: 'Заказ не найден' });
    }

    await order.update({ status }, { transaction });

    const updatedOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }],
      transaction,
    });

    await transaction.commit();
    return res.json(updatedOrder);
  } catch (error) {
    if (transaction) {
      await rollbackTransaction(transaction, 'updateOrderStatus');
    }

    logError('updateOrderStatus', error);
    return res.status(400).json({ error: error.message || 'Не удалось обновить статус заказа' });
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  ORDER_STATUSES,
};
