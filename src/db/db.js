const { Sequelize, DataTypes } = require('sequelize')
const connections = require('./connections')
const configs = require('../config')


const modelDefiners = [
    require('./models/users/users'),
    require('./models/orders/orders'),
    require('./models/orders/order_items'),
    require('./models/users/admin_users')
]

const sequelize = new Sequelize(configs.DB_CONNECTION_URL, {
    logging: false,
    define: {
        freezeTableName: true
    }
})

for (const m of modelDefiners) {
    m(sequelize, DataTypes)
}

connections(sequelize)

module.exports = sequelize;
