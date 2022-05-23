module.exports = async (sequelize, DataTypes) => {
    const orders = sequelize.define("orders", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
              model: "users",
              key: "id"
            }
        },
        text: {
            type: DataTypes.TEXT(),
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
        },
        payment_image_id: {
            type: DataTypes.STRING(100),
        },
        is_paid: {
            type: DataTypes.BOOLEAN,
        },
        is_verified: {
            type: DataTypes.BOOLEAN,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },

    })
}