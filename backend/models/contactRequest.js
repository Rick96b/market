module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'ContactRequest',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: 'contact_requests',
      timestamps: true,
    }
  );
};
