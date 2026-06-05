module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Order',
    {
      total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'new',
      },
      delivery_name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
      },
      delivery_phone: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
      },
      delivery_address: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
      },
      delivery_method: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'courier',
      },
      payment_method: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'cash',
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'orders',
      timestamps: true,
    }
  );
};
