module.exports = (sequelize) => {
    const { users, admin_users, orders, order_items, transactions } = sequelize.models

    users.hasMany(orders, { foreignKey: "user_id" });
    orders.belongsTo(users, { foreignKey: "user_id", allowNull: false });

    users.hasMany(admin_users, { foreignKey: "user_id" });
    admin_users.belongsTo(users, { foreignKey: "user_id", allowNull: false });

    orders.hasMany(order_items, { foreignKey: "order_id" });
    order_items.belongsTo(orders, { foreignKey: "order_id", allowNull: false });

    orders.hasMany(transactions, { foreignKey: "order_id" });
    transactions.belongsTo(orders, { foreignKey: "order_id", allowNull: false });
}