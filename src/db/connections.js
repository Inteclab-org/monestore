module.exports = (sequelize) => {
    const { users, orders, order_items } = sequelize.models

    users.hasMany(orders, { foreignKey: "user_id" });
    orders.belongsTo(users, { foreignKey: "user_id", allowNull: false });

    orders.hasMany(order_items, { foreignKey: "order_id" });
    order_items.belongsTo(orders, { foreignKey: "order_id", allowNull: false });
}