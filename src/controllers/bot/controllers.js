const {
    InlineKeyboard
} = require("grammy")
const fs = require("fs/promises")
const InlineKeyboards = require("../../assets/inline_keyboard")
const Keyboards = require("../../assets/keyboards")
const messages = require("../../assets/messages")
const sequelize = require('../../db/db')
const {
    validURL
} = require("../../modules/regex_url")
const {
    Sequelize
} = require("sequelize")
const {
    users,
    orders,
    order_items
} = sequelize.models

module.exports = class Controllers {

    static async updateUserStep(ctx, step) {
        try {
            let user = await users.update({
                step: step
            }, {
                where: {
                    telegram_id: ctx.msg.chat.id
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    static async sendAlert(ctx, text) {
        await ctx.reply(text, {
            parse_mode: "HTML"
        })
    }

    static async changeCredentials(ctx) {
        try {
            const {
                query
            } = require("query-string").parseUrl(ctx.callbackQuery.data)

            switch (query.step) {
                case "name":
                    await editMessage(
                        ctx, ctx.callbackQuery.message.message_id,
                        "text", messages[ctx.session.user.lang].inputNameMsg, {
                            inline_keyboard: []
                        }
                    )
                    break;
                case "phone":
                    await editMessage(
                        ctx, ctx.callbackQuery.message.message_id,
                        "text", messages[ctx.session.user.lang].telMsg, {
                            inline_keyboard: []
                        }
                    )
                    break;
                case "lang":
                    await editMessage(
                        ctx, ctx.callbackQuery.message.message_id,
                        "text", messages.startMsg, {
                            inline_keyboard: InlineKeyboards.select_language.inline_keyboard
                        }
                    )
                    break;

                default:
                    break;
            }

            ctx.session.step = `edit_user_info:${query.step}`
            await Controllers.updateUserStep(ctx, ctx.session.step)

            await ctx.answerCallbackQuery()

        } catch (error) {
            console.log(error);
        }
    }

    // LANGUAGE

    static async selectLanguage(ctx) {
        let x = await ctx.reply(messages.startMsg, {
            parse_mode: "HTML",
            reply_markup: InlineKeyboards.select_language,
        })
    }

    static async setLanguage(ctx) {

        try {
            const {
                query
            } = require('query-string').parseUrl(ctx.callbackQuery.data)

            ctx.session.user.lang = query.value
            let user = await users.update({
                language_code: query.value
            }, {
                where: {
                    telegram_id: ctx.msg.chat.id
                }
            })
            await ctx.answerCallbackQuery()
        } catch (error) {
            console.log(error);
        }
    }

    // NAME

    static async askName(ctx) {
        await ctx.deleteMessage()
        await ctx.reply(messages[ctx.session.user.lang].nameMsg, {
            parse_mode: "HTML"
        })
    }

    static async setName(ctx) {

        try {
            ctx.session.user.name = ctx.msg.text
            let user = await users.update({
                full_name: ctx.msg.text
            }, {
                where: {
                    telegram_id: ctx.msg.chat.id
                }
            })

            return user[0]
        } catch (error) {
            console.log(error);
        }
    }

    // PHONE

    static async askPhone(ctx) {

        let x = await ctx.reply(messages[ctx.session.user.lang].telMsg, {
            parse_mode: "HTML",
            reply_markup: {
                resize_keyboard: true,
                keyboard: Keyboards[ctx.session.user.lang].share_phone.build()
            }
        })

    }

    static async setPhone(ctx) {

        try {

            if (ctx.msg.text && !(/^\+\998[389][012345789][0-9]{7}$/).test(ctx.msg.text)) {
                let x = await ctx.reply(messages[ctx.session.user.lang].invalidNumberMsg, {
                    parse_mode: "HTML",
                })
                console.log(test);
                // ctx.session.messages_to_delete.push(ctx.message.message_id)
                // ctx.session.messages_to_delete.push(x.message_id)
                return false
            }

            ctx.session.user.phone = ctx.msg.contact ? ctx.msg.contact.phone_number : ctx.msg.text

            let user = await users.update({
                phone_number: ctx.session.user.phone
            }, {
                where: {
                    telegram_id: ctx.msg.chat.id
                }
            })

            return Boolean(user[0])
        } catch (error) {
            console.log(error);
        }

    }

    // -- END REGISTER --

    // MENU

    static async sendMenu(ctx, additional) {
        await ctx.reply((additional ? additional + "\n" : '') + messages[ctx.session.user.lang].menuMsg, {
            parse_mode: "HTML",
            reply_markup: InlineKeyboards[ctx.session.user.lang].menu
        })
    }

    static async openOrderMenu(ctx) {
        const user = await users.findOne({
            where: {
                telegram_id: ctx.callbackQuery.message.chat.id
            },
            raw: true
        })

        if(user.current_order_id){
            await ctx.api.answerCallbackQuery(ctx.callbackQuery.id, {
                text: messages[ctx.session.user.lang].notDeliveredMsg
            })
        }

        if (ctx.session.step == "order") {
            // await ctx.api.answerCallbackQuery(ctx.callbackQuery.id, {
            //     text: messages[ctx.session.user.lang].orderingMsg,
            // })
            // return
            if (ctx.session.last_sent_link_message) {
                await ctx.api.deleteMessage(ctx.callbackQuery.message.chat.id, ctx.session.last_sent_link_message)
            }
        }

        let x = await ctx.reply(messages[ctx.session.user.lang].orderFirstStep, {
            parse_mode: "HTML",
            message_id: ctx.callbackQuery.message.message_id,
            reply_markup: {
                resize_keyboard: true,
                keyboard: Keyboards[ctx.session.user.lang].verify_order.build()
            }
        })
        ctx.session.last_sent_link_message = x.message_id
        await ctx.answerCallbackQuery()
    }

    static async openSettingsMenu(ctx) {

        let user = await users.findOne({
            where: {
                telegram_id: ctx.msg.chat.id
            },
            raw: true
        })

        let language = user.language_code

        if (language == "uz") language = "Uzbek"
        if (language == "ru") language = "Russian"

        await ctx.editMessageText(
            `Sozlamalar:\n\n<i>Ismingiz:</i>  <b>${user.full_name}</b>
            \n<i>Telefon raqamingiz:</i>  <b>${user.phone_number}</b>
            \n<i>Tanlangan til:</i>  <b>${language}</b>`, {
                parse_mode: "HTML",
                message_id: ctx.callbackQuery.message.message_id,
                reply_markup: InlineKeyboards[ctx.session.user.lang].user_info_menu("menu")
            })

        await ctx.answerCallbackQuery()
    }

    static async openMyOrdersMenu(ctx) {

        await ctx.editMessageText(messages[ctx.session.user.lang].chooseSectionMsg, {
            parse_mode: "HTML",
            message_id: ctx.callbackQuery.message.message_id,
            reply_markup: InlineKeyboards[ctx.session.user.lang].order_sections_menu("menu")
        })

        await ctx.answerCallbackQuery()
    }

    static async sendOrders(ctx, offset) {

        if (offset < 0) {
            await ctx.answerCallbackQuery()
            return
        }

        let user = await users.findOne({
            where: {
                telegram_id: ctx.msg.chat.id
            },
            raw: true
        })

        let ordersText = ""

        const allOrders = await orders.findAndCountAll({
            include: [{
                model: order_items,
                attributes: ["id"]
            }],
            where: {
                user_id: user.id
            },
            limit: 1,
            offset: offset || 0,
            order: [
                ["created_at", "DESC"]
            ]
        })

        console.log(offset);

        if (offset >= allOrders.count) {
            await ctx.answerCallbackQuery()
            return
        }

        for (const o of allOrders.rows) {
            let isPaid = o.is_paid ? "qilingan✅" : "qilinmagan❌"
            let price = o.price ? o.price + " so'm" : "belgilanishi kutilmoqda 🕢"
            ordersText += 
            `🆔: ${o.id}\n\n🛍<i>Mahsulotlar soni</i>: <b>${o.order_items.length}</b> ta\n💲<i>Narx</i>: <b>${price}</b>\n💵<i>To'lov</i> <b>${isPaid}</b>`
        }

        await ctx.editMessageText(
            `Buyurtmalar: \n\n ${ordersText}`, {
                parse_mode: "HTML",
                message_id: ctx.callbackQuery.message.message_id,
                reply_markup: InlineKeyboards.menu_switch(offset, "orders")
            })

        await ctx.answerCallbackQuery()
    }

    static async sendCurrentOrder(ctx) {

        let user = await users.findOne({
            where: {
                telegram_id: ctx.msg.chat.id
            },
            raw: true
        })

        let ordersText = ""

        const o = await orders.findOne({
            include: [{
                model: order_items,
                attributes: ["id"]
            }],
            where: {
                id: user.current_order_id,
                user_id: user.id,
            }
        })

       if (o) {
            let isPaid = o.is_paid ? "qilingan ✅" : "qilinmagan ❌"
            let price = o.price ? o.price + " so'm" : "belgilanishi kutilmoqda 🕢"
            ordersText += `🆔: ${o.id}\n\n🛍<i>Mahsulotlar soni</i>: <b>${o.order_items.length}</b> ta\n💲<i>Narx</i>: <b>${price}</b>\n💵<i>To'lov</i> <b>${isPaid}</b>`
       }

        await ctx.editMessageText(
            `Hozirgi buyurtma: \n\n ${ordersText}`, {
                parse_mode: "HTML",
                message_id: ctx.callbackQuery.message.message_id,
                reply_markup: InlineKeyboards[ctx.session.user.lang].back("orders")
            })

        await ctx.answerCallbackQuery()
    }

    static async backToMenu(ctx) {
        const {
            query
        } = require("query-string").parseUrl(ctx.callbackQuery.data)
        switch (query.step) {
            case "menu":
                await ctx.editMessageText(messages[ctx.session.user.lang].menuMsg, {
                    parse_mode: "HTML",
                    message_id: ctx.callbackQuery.message.message_id,
                    reply_markup: InlineKeyboards[ctx.session.user.lang].menu
                })
                break;
        
            case "orders":
                Controllers.openMyOrdersMenu(ctx)
                break;
        
            default:
                break;
        }

        await ctx.answerCallbackQuery()
    }


    // ORDERS

    static async createOrderItems(ctx) {
        try {

            if ((!ctx.msg.photo && !ctx.msg.text) || (ctx.msg.text && !validURL(ctx.msg.text))) {
                await ctx.reply(messages[ctx.session.user.lang].invalidMessageMsg, {
                    parse_mode: "HTML"
                })
                return false
            }

            await ctx.deleteMessage()
            let type = "text"
            if (ctx.msg.photo) {
                type = "photo"
            }

            let order_length = Object.keys(ctx.session.order).length + 1

            ctx.session.order[order_length] = {}

            if (type == "photo") {

                const file = await ctx.getFile()
                const file_id = file.file_id

                ctx.session.order[order_length].image_id = file_id
                ctx.session.order[order_length].link = null

                let m = await ctx.replyWithPhoto(file_id, {
                    caption: `${order_length}`,
                    reply_markup: InlineKeyboards[ctx.session.user.lang].sizes_menu(order_length)
                })

            } else if (type == "text") {

                ctx.session.order[order_length].image_id = null
                ctx.session.order[order_length].link = ctx.msg.text

                let m = await ctx.reply(`${order_length}\n\n` + ctx.msg.text, {
                    reply_markup: InlineKeyboards[ctx.session.user.lang].sizes_menu(order_length)
                })

            }

            return true

        } catch (error) {
            console.log(error);
        }
    }

    static async setItemSize(ctx) {
        try {
            const {
                query
            } = require('query-string').parseUrl(ctx.callbackQuery.data)

            if (ctx.session.step == "verify") {
                await ctx.api.answerCallbackQuery(ctx.callbackQuery.id, {
                    text: messages[ctx.session.user.lang].isVerifyingMsg,
                    show_alert: true
                })
                return
            }

            // if(ctx.session.step != "order"){
            //     console.log(ctx.session.step);
            //     await ctx.api.answerCallbackQuery(ctx.callbackQuery.id, {
            //         text: messages[ctx.session.user.lang].notOrderingMsg,
            //         show_alert: true
            //     })
            //     return
            // }

            let type = "text",
                mType = "text"
            if (ctx.callbackQuery.message.photo) {
                type = "photo"
                mType = "caption"
            }

            let text = ctx.callbackQuery.message[mType] + `\nO'lcham: ${query.size.toUpperCase()}`
            let keyboard = InlineKeyboards[ctx.session.user.lang].amount_menu(query.item_id)

            if (ctx.session.order[query.item_id].size != undefined) {
                text = ctx.callbackQuery.message[mType].replace(`O'lcham: ${ctx.session.order[query.item_id].size.toUpperCase()}`, `O'lcham: ${query.size.toUpperCase()}`)
                text = text.replace("✏️", "✅")
                keyboard = InlineKeyboards[ctx.session.user.lang].edit_item_menu(query.item_id)
            }

            await editMessage(ctx,
                ctx.callbackQuery.message.message_id,
                type,
                text,
                keyboard
            )

            ctx.session.order[query.item_id].size = query.size

            await ctx.answerCallbackQuery()

        } catch (error) {
            console.log(error);
        }
    }

    static async setItemAmount(ctx) {
        try {
            const {
                query
            } = require('query-string').parseUrl(ctx.callbackQuery.data)

            if (ctx.session.step == "verify") {
                await ctx.api.answerCallbackQuery(ctx.callbackQuery.id, {
                    text: messages[ctx.session.user.lang].isVerifyingMsg,
                    show_alert: true
                })
                return
            }

            // if(ctx.session.step != "order"  && ctx.session.step != "amount"){
            //     await ctx.api.answerCallbackQuery(ctx.callbackQuery.id, {
            //         text: messages[ctx.session.user.lang].notOrderingMsg,
            //         show_alert: true
            //     })
            //     return
            // }

            let type = "text",
                mType = "text"
            if (ctx.callbackQuery.message.photo) {
                type = "photo",
                    mType = "caption"
            }

            let text = ctx.callbackQuery.message[mType] + `\nMiqdor: ${query.value}\n\n✅`

            if (ctx.session.order[query.item_id].amount != undefined) {
                text = ctx.callbackQuery.message[mType].replace(`Miqdor: ${ctx.session.order[query.item_id].amount}`, `Miqdor: ${query.value}`)
                text = text.replace("✏️", "✅")
                console.log(text);
            }

            ctx.session.order[query.item_id].amount = query.value

            await editMessage(ctx,
                ctx.callbackQuery.message.message_id,
                type,
                text,
                InlineKeyboards[ctx.session.user.lang].edit_item_menu(query.item_id))


            if (query.item_id == ctx.session.editing_item.item_id) {
                ctx.session.editing_item.item_id = null
                ctx.session.editing_item.message_id = null
                ctx.session.editing_item.message_type = "text"
                ctx.session.editing_item.message_content = ""

                await cleanMessages(ctx)
            }

            await ctx.answerCallbackQuery()

        } catch (error) {
            console.log(error);
        }
    }

    static async getManualAmount(ctx) {
        try {
            const {
                query
            } = require('query-string').parseUrl(ctx.callbackQuery.data)

            if (ctx.session.step == "amount") {
                await ctx.api.answerCallbackQuery(ctx.callbackQuery.id, {
                    text: messages[ctx.session.user.lang].finishManualAmountMsg(ctx.session.editing_item.item_id),
                    show_alert: true
                })
                return
            }

            if (ctx.session.step == "verfiy") {
                await ctx.api.answerCallbackQuery(ctx.callbackQuery.id, {
                    text: messages[ctx.session.user.lang].isVerifyingMsg,
                    show_alert: true
                })
                return
            }

            if (ctx.session.step != "order") {
                await ctx.api.answerCallbackQuery(ctx.callbackQuery.id, {
                    text: messages[ctx.session.user.lang].notOrderingMsg,
                    show_alert: true
                })
                return
            }

            ctx.session.editing_item.item_id = query.item_id
            ctx.session.editing_item.message_id = ctx.callbackQuery.message.message_id
            ctx.session.editing_item.message_content = ctx.callbackQuery.message.caption ? ctx.callbackQuery.message.caption : ctx.callbackQuery.message.text;

            if (ctx.callbackQuery.message.photo) {
                ctx.session.editing_item.message_type = "photo"
            }

            let m = await ctx.reply(messages[ctx.session.user.lang].amountMsg, {
                reply_to_message_id: ctx.callbackQuery.message.message_id
            })

            ctx.session.messages_to_delete.push(m.message_id)

            await ctx.answerCallbackQuery()
        } catch (error) {
            console.log(error);
        }
    }

    static async setManualAmount(ctx) {
        try {
            if (isNaN(ctx.msg.text)) {
                let m = await ctx.reply(messages[ctx.session.user.lang].notNumberMsg)
                ctx.session.messages_to_delete.push(m.message_id)
                ctx.session.messages_to_delete.push(ctx.msg.message_id)
                return false
            }

            let text = ctx.session.editing_item.message_content + `\nMiqdor: ${ctx.msg.text}\n\n✅`

            if (ctx.session.order[ctx.session.editing_item.item_id].amount != undefined) {
                text = ctx.session.editing_item.message_content.replace(`Miqdor: ${ctx.session.order[ctx.session.editing_item.item_id].amount}`, `Miqdor: ${ctx.msg.text}`)
                text = text.replace("✏️", "✅")
            }

            ctx.session.order[ctx.session.editing_item.item_id].amount = ctx.msg.text

            await editMessage(
                ctx,
                ctx.session.editing_item.message_id,
                ctx.session.editing_item.message_type,
                text,
                InlineKeyboards[ctx.session.user.lang].edit_item_menu(ctx.session.editing_item.item_id)
            )

            ctx.session.messages_to_delete.push(ctx.msg.message_id)
            ctx.session.editing_item.item_id = null
            ctx.session.editing_item.message_id = null
            ctx.session.editing_item.message_type = "text"
            ctx.session.editing_item.message_content = ""

            await cleanMessages(ctx)
            return true
        } catch (error) {
            console.log(error);
        }
    }

    static async changeToEditMenu(ctx, menu) {
        try {
            const {
                query
            } = require('query-string').parseUrl(ctx.callbackQuery.data)

            let type = "text",
                mType = "text"
            if (ctx.callbackQuery.message.photo) {
                type = "photo",
                    mType = "caption"
            }

            let text = ctx.callbackQuery.message[mType].replace("✅", "✏️")

            await editMessage(
                ctx,
                ctx.callbackQuery.message.message_id,
                type,
                text,
                InlineKeyboards[ctx.session.user.lang][menu](query.item_id)
            )

            await ctx.answerCallbackQuery()

        } catch (error) {
            console.log(error);
        }
    }

    static async cancelOrderProccess(ctx) {
        try {
            ctx.session.order = {}
            await cleanMessages(ctx)

            await ctx.reply(messages[ctx.session.user.lang].orderProccessCancelledMsg, {
                parse_mode: "HTML",
                reply_markup: {
                    remove_keyboard: true
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    static async endOrderProccess(ctx) {
        try {
            let ordersObj = ctx.session.order

            if (Object.keys(ordersObj).length == 0) {
                await ctx.reply(messages[ctx.session.user.lang].noItemsMsg, {
                    parse_mode: "HTML"
                })
                return false
            }

            for (const key in ordersObj) {
                if (ordersObj.hasOwnProperty(key)) {
                    const element = ordersObj[key];

                    if (Object.keys(element).length != 4) {
                        await ctx.reply(messages[ctx.session.user.lang].orderNotFinishedMsg, {
                            parse_mode: "HTML"
                        })
                        return false
                    }

                    for (const k in element) {
                        if (element.hasOwnProperty(k)) {
                            const e = element[k];
                            if (!e && e != null) {
                                await ctx.reply(messages[ctx.session.user.lang].orderNotFinishedMsg, {
                                    parse_mode: "HTML"
                                })
                                return false
                            }
                        }
                    }
                }
            }

            await ctx.reply(messages[ctx.session.user.lang].areYouSureMsg, {
                parse_mode: "HTML",
                reply_markup: {
                    resize_keyboard: true,
                    keyboard: Keyboards[ctx.session.user.lang].yes_no.build()
                }
            })

            return true
        } catch (error) {
            console.log(error);
        }
    }

    static async saveOrder(ctx) {
        try {
            let ordersObj = ctx.session.order

            const user = await users.findOne({
                where: {
                    telegram_id: ctx.msg.chat.id
                },
                raw: true
            })

            const order = await orders.create({
                user_id: user.id,
                is_verified: true,
            })

            await users.update({
                current_order_id: order.id
            }, {
                where: {
                    id: user.id
                }
            })

            for (const key in ordersObj) {
                if (ordersObj.hasOwnProperty(key)) {
                    const element = ordersObj[key];
                    const order_item = await order_items.create({
                        ...element,
                        order_id: order.id
                    })
                }
            }

            ctx.session.order = {}
            ctx.session.current_order_id = order.id

            // buni o'zgartirish kerak!
            await ctx.reply(`${messages[ctx.session.user.lang].verifiedMsg}`, {
                parse_mode: "HTML",
                reply_markup: {
                    remove_keyboard: true
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    static async continueOrderProccess(ctx) {
        await ctx.reply(`${messages[ctx.session.user.lang].verifyStoppedMsg} 
        ${ messages[ctx.session.user.lang].continueOrderMsg}`, {
            parse_mode: "HTML",
            reply_markup: {
                resize_keyboard: true,
                keyboard: Keyboards[ctx.session.user.lang].verify_order.build()
            }
        })
    }

    static async cancelOrderProccess(ctx) {
        try {
            ctx.session.order = {}
            await cleanMessages(ctx)

            await ctx.reply(messages[ctx.session.user.lang].orderProccessCancelledMsg, {
                parse_mode: "HTML",
                reply_markup: {
                    remove_keyboard: true
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    static async getPaymentImage(ctx) {
        try {
            if (!ctx.msg.photo) {
                await ctx.reply("Rasm jo'natishingiz kerak!", {
                    parse_mode: "HTML"
                })
                return false
            }

            const order = await orders.findOne({
                where: {
                    id: ctx.session.current_order_id
                }
            })

            if (order && order.payment_pending) {
                await ctx.reply("Avvalgi to'lov hali adminlar tomonidan ko'rib chiqilmagan. Iltimos, javobni kuting.", {
                    parse_mode: "HTML"
                })
                return false
            }

            const file = await ctx.getFile()
            const file_id = file.file_id

            const updated_order = await orders.update({
                payment_image_id: file_id,
                payment_pending: true,
                status: 3
            }, {
                where: {
                    id: ctx.session.current_order_id
                }
            })

            if (!updated_order[0]) return false

            await ctx.reply("To'lov tasdiqlanishini kuting...", {
                parse_mode: "HTML"
            })

            // setTimeout(async () => {
            //     await orders.update({
            //         payment_pending: false,
            //         is_paid: true,
            //         status: 3
            //     }, {
            //         where: {
            //             id: ctx.session.current_order_id
            //         }
            //     })
            //     await ctx.reply("To'lov tasdiqlandi, haridingiz uchun tashakkur!", {
            //         parse_mode: "HTML"
            //     })
            // }, 2000)
        } catch (error) {
            console.log(error);
        }
    }

    static async deleteItem(ctx) {
        try {
            const {
                query
            } = require('query-string').parseUrl(ctx.callbackQuery.data)

            delete ctx.session.order[query.item_id]

            await ctx.api.deleteMessage(ctx.msg.chat.id, ctx.callbackQuery.message.message_id)
        } catch (error) {
            console.log(error);
        }
    }


}

async function editMessage(ctx, message_id, message_type, text, reply_markup) {
    if (message_type == "text") {
        await ctx.editMessageText(text, {
            message_id: message_id,
            parse_mode: "HTML",
            reply_markup: reply_markup
        })
    } else if (message_type == "photo") {
        await ctx.api.editMessageCaption(ctx.msg.chat.id, message_id, {
            caption: text,
            parse_mode: "HTML",
            reply_markup: reply_markup
        })
    }
}

async function cleanMessages(ctx) {
    for (let msg of ctx.session.messages_to_delete) {
        await ctx.api.deleteMessage(ctx.msg.chat.id, msg)
    }

    ctx.session.messages_to_delete = []
}