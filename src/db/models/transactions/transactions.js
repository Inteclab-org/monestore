module.exports = async (sequelize, DataTypes) => {
    const transactions = sequelize.define("transactions", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        order_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "orders",
                key: "id"
            }
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
        },
        image_id: {
            type: DataTypes.STRING(100),
        },
        valid: {
            type: DataTypes.BOOLEAN,
        },
        text: {
            type: DataTypes.STRING(148),
        }
    }, {
        updatedAt: 'updated_at',
        createdAt: 'created_at'
      })

      return transactions
}