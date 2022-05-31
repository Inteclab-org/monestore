module.exports = (sequelize, DataTypes) => {
    const admin_users = sequelize.define('admin_users', {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4(),
          primaryKey: true,
          allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
              model: "users",
              key: "id"
            }
        },
        password: {
          type: DataTypes.STRING(64),
        }
      }, {
        updatedAt: 'updated_at',
        createdAt: 'created_at'
      });

    return admin_users;
}