module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'OrderItem',
    {
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
        },
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      tableName: 'order_items',
      timestamps: true,
    }
  );
};
