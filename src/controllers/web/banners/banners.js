const { Op } = require("sequelize")
const { sendCost, sendVerification } = require("../../../bot")
const sequelize = require("../../../db/db")
const { uploadFile } = require("../../../modules/file_upload")
const { users, banners, order_items, transactions } = sequelize.models

class OrdersController{
    static async GetAll(req, res, next) {
        try {
            const is_active = req.query.active ? req.query.active : true 
            const activeBanners = await banners.findAll({
                where: {
                    is_active
                }
            })

            res.status(200).json({
                ok: true,
                data: {
                    banners: activeBanners
                }
            })
        } catch (error) {
            next(error)
        }
    }

    static async Create(req, res, next) {
        try {
            if (!req.files) {
                throw new res.error(400, "Files required!")
            }

            const upload = await uploadFile(req.files)
            const image_src = upload.filenames[0]

            const banner = await banners.create({
                ...req.body,
                image_src
            })

            res.status(201).json({
                ok: true,
                message: "Banner created",
                data: {
                    banner
                }
            })
        } catch (error) {
            next(error)
        }
    }

    static async Update(req, res, next) {
        try {
            const banner = await banners.findOne({
                where: {
                    id: req.params.id
                },
                raw: true
            })

            if (!banner) {
                throw new res.error(404, "Banner not found")
            }

            let image_src = banner.image_src

            if (req.files) {
                const upload = await uploadFile(req.files)
                image_src = upload.filenames[0]
            }

            const update = await banners.update({
                ...req.body,
                image_src
            },{
                where: {
                    id: req.params.id
                }
            })

            res.status(200).json({
                ok: true,
                message: "Banner updated"
            })
        } catch (error) {
            next(error)
        }
    }
    
} 

module.exports = OrdersController