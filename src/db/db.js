 
 

import { Sequelize, DataTypes } from 'sequelize'
import connections from './connections.js'
import configs from '../config/index.js'

import Users from './models/users/users.js'         
import Orders from './models/orders/orders.js'
import OrderItems from './models/orders/order_items.js'
import AdminUsers from './models/users/admin_users.js'
import Transactions from './models/transactions/transactions.js'
import Banners from './models/landing/banners/banners.js'


const modelDefiners = [
    Users,
    OrderItems,
    Orders,
    AdminUsers,
    Transactions,
    Banners
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

export default sequelize;
