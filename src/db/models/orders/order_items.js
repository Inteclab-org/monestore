export default async (sequelize, DataTypes) => {
    const order_items = sequelize.define("order_items", {
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
        link: {
            type: DataTypes.TEXT(),
        },
        image_id: {
            type: DataTypes.STRING(100),
        },
        amount: {
            type: DataTypes.INTEGER,
        },
        size: {
            type: DataTypes.STRING(5),
        }
    }, {
        updatedAt: 'updated_at',
        createdAt: 'created_at'
      })

    return order_items
}