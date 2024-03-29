export default async (sequelize, DataTypes) => {
    const banners = sequelize.define("banners", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        image_src: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        title: {
            type: DataTypes.STRING(1024),
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },

    }, {
        updatedAt: 'updated_at',
        createdAt: 'created_at'
      })

    return banners
}