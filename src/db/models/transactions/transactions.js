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
        valid: {
            type: DataTypes.BOOLEAN,
        }
    }, {
        updatedAt: 'updated_at',
        createdAt: 'created_at'
      })

      return transactions
}