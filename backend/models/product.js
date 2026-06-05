module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Product',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      unit: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'kg',
      },
      is_featured: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      calories: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 100,
        validate: {
          min: 0,
        },
      },
      protein: {
        type: DataTypes.DECIMAL(5, 1),
        allowNull: false,
        defaultValue: 1,
        validate: {
          min: 0,
        },
      },
      fat: {
        type: DataTypes.DECIMAL(5, 1),
        allowNull: false,
        defaultValue: 1,
        validate: {
          min: 0,
        },
      },
      carbs: {
        type: DataTypes.DECIMAL(5, 1),
        allowNull: false,
        defaultValue: 10,
        validate: {
          min: 0,
        },
      },
      ingredients: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: 'Organic product',
      },
    },
    {
      tableName: 'products',
      timestamps: true,
    }
  );
};
