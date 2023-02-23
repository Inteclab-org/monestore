 
 

import InlineKeyboards from "../../assets/inline_keyboard.js"
import Keyboards from "../../assets/keyboards.js"
import messages from "../../assets/messages.js"
import sequelize from '../../db/db.js'
import queryString from "query-string"

import { validURL } from "../../modules/regex_url.js"

import { fileDownloader } from "../../modules/get_download.js"
const {
    users,
    orders,
    order_items,
    transactions
} = sequelize.models

export default class Controllers {

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
            } = queryString.parseUrl(ctx.callbackQuery.data)

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
            } = queryString.parseUrl(ctx.callbackQuery.data)

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
        await ctx.reply((additional ? additional + "\n" : '') + messages[ctx.session.user.lang].menuMsg(ctx.session.user.id), {
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

        const order = await orders.findOne({
            where: {
                id: user.current_order_id
            },
            raw: true
        })

        if (order) {
            let statuses = [1,2,3]

            for (const s of statuses) {
                if(order.status != 5 && order.status == s){
                    await ctx.api.answerCallbackQuery(ctx.callbackQuery.id, {
                        text: messages[ctx.session.user.lang].statusMessages[s]+messages[ctx.session.user.lang].cannotOrderMsg,
                        show_alert: true,
                        parse_mode: "HTML"
                    })
                    return false
                }
            }
        }

        // if(user.current_order_id){
        //     await ctx.api.answerCallbackQuery(ctx.callbackQuery.id, {
        //         text: messages[ctx.session.user.lang].notDeliveredMsg,
        //         show_alert: true
        //     })
        //     return
        // }

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

        return true
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

        await ctx.editMessageText(messages[user.language_code].userInfoMsg(user.id, user.full_name, user.phone_number, language), {
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

    static async sendOrders(ctx, page, edit = false) {
        page = page || 0
        ctx.session.orders_page = page

        const limit = 5
        const offset = page * limit

        let user = await users.findOne({
            where: {
                telegram_id: ctx.msg.chat.id
            },
            raw: true
        })

        let ordersText = ""

        const count  = await orders.count()
        const allOrders = await orders.findAndCountAll({
            include: [{
                model: order_items,
                attributes: ["id"]
            }],
            where: {
                user_id: user.id
            },
            limit,
            offset: offset || 0,
            order: [
                ["created_at", "DESC"]
            ]
        })

        if (offset > count || offset < 0) {
            await ctx.answerCallbackQuery()
            return
        }

        const order_ids = []
        const pages = Math.ceil(count / limit)

        for (const o of allOrders.rows) {
            ordersText += messages[ctx.session.user.lang].orderInfoMsg(o) 
            order_ids.push(o.id)
        }

        if (edit) 
            await ctx.editMessageText(
                messages[ctx.session.user.lang].allOrdersMsg(ordersText), {
                    parse_mode: "HTML",
                    message_id: ctx.callbackQuery.message.message_id,
                    reply_markup: {
                        inline_keyboard: InlineKeyboards[ctx.session.user.lang].order_menu_switch(order_ids, pages, page, "orders")
                    }
                })
        else
            await ctx.reply(
                messages[ctx.session.user.lang].allOrdersMsg(ordersText), {
                    parse_mode: "HTML",
                    reply_markup: {
                        inline_keyboard: InlineKeyboards[ctx.session.user.lang].order_menu_switch(order_ids, pages, page, "orders")
                    }
                }) 

        await ctx.answerCallbackQuery()
    }

    static async sendOrderItems(ctx, order_id, page, edit = false) {
        page = page || 0
        const limit = 1
        const offset = page * limit
        const count = await order_items.count({
            where: {
                order_id
            }
        })
        const data = await order_items.findAll({
            where: {
                order_id,
            },
            limit,
            offset: offset || 0,
            order: [
                ["created_at", "DESC"]
            ]
        })
        
        if (offset >= count) {
            await ctx.answerCallbackQuery()
            return
        }
        
        const pages = Math.ceil(count / limit)

        if (edit) {
            await ctx.api.editMessageMedia(
                ctx.callbackQuery.message.chat.id, 
                ctx.callbackQuery.message.message_id, {
                    type: "photo",
                    media: `https://api.monestore.uz/uploads/${data[0].image_id ? "files/" + data[0].image_id : "placeholder/placeholder.jpg"}`
                })
            await ctx.api.editMessageCaption(
                ctx.callbackQuery.message.chat.id, 
                ctx.callbackQuery.message.message_id, {
                caption: messages[ctx.session.user.lang].orderItemInfoMsg(data[0]),
                parse_mode: "HTML",
                reply_markup: InlineKeyboards[ctx.session.user.lang].item_menu_switch(order_id, pages, page, "orders_list")
            })
        }else{
            await ctx.api.deleteMessage(ctx.callbackQuery.message.chat.id, ctx.callbackQuery.message.message_id)
            await ctx.replyWithPhoto(`https://api.monestore.uz/uploads/${data[0].image_id ? "files/" + data[0].image_id : "placeholder/placeholder.jpg"}`, {
                    caption: messages[ctx.session.user.lang].orderItemInfoMsg(data[0]) ,
                    parse_mode: "HTML",
                    reply_markup: InlineKeyboards[ctx.session.user.lang].item_menu_switch(order_id, pages, page, "orders_list")
            })
        }

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
            ordersText += messages[ctx.session.user.lang].orderInfoMsg(o) 
       }

        await ctx.editMessageText(
            messages[ctx.session.user.lang].currentOrderMsg(ordersText), {
                parse_mode: "HTML",
                message_id: ctx.callbackQuery.message.message_id,
                reply_markup: InlineKeyboards[ctx.session.user.lang].back("orders")
            })

        await ctx.answerCallbackQuery()
    }

    static async backToMenu(ctx) {
        const {
            query
        } = queryString.parseUrl(ctx.callbackQuery.data)
        switch (query.step) {
            case "menu":
                await ctx.editMessageText(messages[ctx.session.user.lang].menuMsg(ctx.session.user.id), {
                    parse_mode: "HTML",
                    message_id: ctx.callbackQuery.message.message_id,
                    reply_markup: InlineKeyboards[ctx.session.user.lang].menu
                })
                break;
        
            case "orders":
                await Controllers.openMyOrdersMenu(ctx)
                break;
                
            case "orders_list":
                await ctx.api.deleteMessage(ctx.callbackQuery.message.chat.id, ctx.callbackQuery.message.message_id)
                await Controllers.sendOrders(ctx, ctx.session.orders_page)
                break;
        
            case "payment":
                console.log(ctx.session.user);
                await ctx.editMessageText(messages[ctx.session.user.lang].waitCostMsg, {
                    parse_mode: "HTML",
                    message_id: ctx.callbackQuery.message.message_id,
                    reply_markup: {
                        inline_keyboard: InlineKeyboards[ctx.session.user.lang].set_cost.inline_keyboard
                    }
                })
                ctx.session.step = "payment"
                await Controllers.updateUserStep(ctx, ctx.session.step)
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
            } = queryString.parseUrl(ctx.callbackQuery.data)

            if (ctx.session.step == "verify") {
                await ctx.api.answerCallbackQuery(ctx.callbackQuery.id, {
                    text: messages[ctx.session.user.lang].isVerifyingMsg,
                    show_alert: true,
                    parse_mode: "HTML"
                })
                return
            }

            let type = "text",
                mType = "text"
            if (ctx.callbackQuery.message.photo) {
                type = "photo"
                mType = "caption"
            }

            let text = ctx.callbackQuery.message[mType] + `\n${messages[ctx.session.user.lang].size}: ${query.size.toUpperCase()}`
            let keyboard = InlineKeyboards[ctx.session.user.lang].amount_menu(query.item_id)
            console.log(query.item_id);
            if (ctx.session.order[query.item_id].size != undefined) {
                text = ctx.callbackQuery.message[mType].replace(`${messages[ctx.session.user.lang].size}: ${ctx.session.order[query.item_id].size.toUpperCase()}`, `${messages[ctx.session.user.lang].size}: ${query.size.toUpperCase()}`)
                text = text.replace("✏️", "✅")
                keyboard = InlineKeyboards[ctx.session.user.lang].edit_item_menu(query.item_id)
            }

            ctx.session.order[query.item_id].size = query.size

            await editMessage(ctx,
                ctx.callbackQuery.message.message_id,
                type,
                text,
                keyboard
            )

            if (query.item_id == ctx.session.editing_item.item_id) {
                ctx.session.editing_item.item_id = null
                ctx.session.editing_item.message_id = null
                ctx.session.editing_item.message_type = "text"
                ctx.session.editing_item.message_content = ""

                await cleanMessages(ctx)
            }

            await ctx.answerCallbackQuery()
            return true
        } catch (error) {
            console.log(error);
        }
    }

    static async setItemAmount(ctx) {
        try {
            const {
                query
            } = queryString.parseUrl(ctx.callbackQuery.data)

            if (ctx.session.step == "verify") {
                await ctx.api.answerCallbackQuery(ctx.callbackQuery.id, {
                    text: messages[ctx.session.user.lang].isVerifyingMsg,
                    show_alert: true,
                    parse_mode: "HTML"
                })
                return
            }

            let type = "text",
                mType = "text"
            if (ctx.callbackQuery.message.photo) {
                type = "photo",
                    mType = "caption"
            }

            let text = ctx.callbackQuery.message[mType] + `\n${messages[ctx.session.user.lang].amount}: ${query.value}\n\n✅`

            if (ctx.session.order[query.item_id].amount != undefined) {
                text = ctx.callbackQuery.message[mType].replace(`${messages[ctx.session.user.lang].amount}: ${ctx.session.order[query.item_id].amount}`, `${messages[ctx.session.user.lang].amount}: ${query.value}`)
                text = text.replace("✏️", "✅")
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

            return true

        } catch (error) {
            console.log(error);
        }
    }

    static async getManualSize(ctx) {
        try {
            const {
                query
            } = queryString.parseUrl(ctx.callbackQuery.data)

            if (ctx.session.step == "size") {
                await ctx.api.answerCallbackQuery(ctx.callbackQuery.id, {
                    text: messages[ctx.session.user.lang].finishManualSizeMsg(ctx.session.editing_item.item_id),
                    show_alert: true,
                    parse_mode: "HTML"
                })
                return
            }

            if (ctx.session.step == "verfiy") {
                await ctx.api.answerCallbackQuery(ctx.callbackQuery.id, {
                    text: messages[ctx.session.user.lang].isVerifyingMsg,
                    show_alert: true,
                    parse_mode: "HTML"
                })
                return
            }

            if (ctx.session.step != "order") {
                await ctx.api.answerCallbackQuery(ctx.callbackQuery.id, {
                    text: messages[ctx.session.user.lang].notOrderingMsg,
                    show_alert: true,
                    parse_mode: "HTML"
                })
                return
            }

            ctx.session.editing_item.item_id = query.item_id
            ctx.session.editing_item.message_id = ctx.callbackQuery.message.message_id
            ctx.session.editing_item.message_content = ctx.callbackQuery.message.caption ? ctx.callbackQuery.message.caption : ctx.callbackQuery.message.text;

            if (ctx.callbackQuery.message.photo) {
                ctx.session.editing_item.message_type = "photo"
            }

            let m = await ctx.reply(messages[ctx.session.user.lang].sizeMsg, {
                reply_to_message_id: ctx.callbackQuery.message.message_id
            })

            ctx.session.messages_to_delete.push(m.message_id)

            await ctx.answerCallbackQuery()
        } catch (error) {
            console.log(error);
        }
    }

    static async getManualAmount(ctx) {
        try {
            const {
                query
            } = queryString.parseUrl(ctx.callbackQuery.data)

            if (ctx.session.step == "amount") {
                await ctx.api.answerCallbackQuery(ctx.callbackQuery.id, {
                    text: messages[ctx.session.user.lang].finishManualAmountMsg(ctx.session.editing_item.item_id),
                    show_alert: true,
                    parse_mode: "HTML"
                })
                return
            }

            if (ctx.session.step == "verfiy") {
                await ctx.api.answerCallbackQuery(ctx.callbackQuery.id, {
                    text: messages[ctx.session.user.lang].isVerifyingMsg,
                    show_alert: true,
                    parse_mode: "HTML"
                })
                return
            }

            if (ctx.session.step != "order") {
                await ctx.api.answerCallbackQuery(ctx.callbackQuery.id, {
                    text: messages[ctx.session.user.lang].notOrderingMsg,
                    show_alert: true,
                    parse_mode: "HTML"
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
                parse_mode: "HTML",
                reply_to_message_id: ctx.callbackQuery.message.message_id
            })

            ctx.session.messages_to_delete.push(m.message_id)

            await ctx.answerCallbackQuery()
        } catch (error) {
            console.log(error);
        }
    }

    static async getManualCost(ctx) {
        try {
            const {
                query
            } = queryString.parseUrl(ctx.callbackQuery.data)

            if (ctx.session.step == "verfiy") {
                await ctx.api.answerCallbackQuery(ctx.callbackQuery.id, {
                    text: messages[ctx.session.user.lang].isVerifyingMsg,
                    show_alert: true,
                    parse_mode: "HTML"
                })
                return
            }

            if (ctx.session.step != "payment" && ctx.session.step != "cost") {
                await ctx.api.answerCallbackQuery(ctx.callbackQuery.id, {
                    text: messages[ctx.session.user.lang].notOrderingMsg+`\n${ctx.session.step}`,
                    show_alert: true,
                    parse_mode: "HTML"
                })
                return
            }

            const user = await users.findOne({
                where: {
                    id: ctx.session.user.id
                },
                raw: true
            })

            const order = await orders.findOne({
                where: {
                    id: user.current_order_id
                }
            })

            if (order.price) {
                const msg = order.payment_pending 
                    ? messages[ctx.session.user.lang].orderHasPriceMsg
                    : messages[ctx.session.user.lang].orderHasPriceMsg 
                        + messages[ctx.session.user.lang].notPaidYetMsg;

                await ctx.api.answerCallbackQuery(ctx.callbackQuery.id, {
                    text: msg,
                    show_alert: true
                })
                return
            }
            if (order.is_paid) {
                await ctx.api.answerCallbackQuery(ctx.callbackQuery.id, {
                    text: messages[ctx.session.user.lang].notOrderingMsg,
                    show_alert: true,
                    parse_mode: "HTML"
                })
                return
            }

            await ctx.editMessageText(messages[ctx.session.user.lang].costMsg, {
                parse_mode: "HTML",
                message_id: ctx.callbackQuery.message.message_id,
                reply_markup: {
                    inline_keyboard: InlineKeyboards[ctx.session.user.lang].back("payment").inline_keyboard
                }
            })

            await ctx.answerCallbackQuery()
        } catch (error) {
            console.log(error);
        }
    }

    static async setManualSize(ctx) {
        try {

            let text = ctx.session.editing_item.message_content + `\nO'lcham: ${ctx.msg.text.toUpperCase()}`
            let keyboard = InlineKeyboards[ctx.session.user.lang].amount_menu(ctx.session.editing_item.item_id)

            if (ctx.session.order[ctx.session.editing_item.item_id].amount != undefined) {
                text = ctx.session.editing_item.message_content.replace(`O'lcham: ${ctx.session.order[ctx.session.editing_item.item_id].size.toUpperCase()}`, `O'lcham: ${ctx.msg.text.toUpperCase()}`)
                text = text.replace("✏️", "✅")
                keyboard = InlineKeyboards[ctx.session.user.lang].edit_item_menu(ctx.session.editing_item.item_id)    
            }

            ctx.session.order[ctx.session.editing_item.item_id].size = ctx.msg.text

            await editMessage(
                ctx,
                ctx.session.editing_item.message_id,
                ctx.session.editing_item.message_type,
                text,
                keyboard
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

    static async setManualAmount(ctx) {
        try {
            if (isNaN(ctx.msg.text)) {
                let m = await ctx.reply(messages[ctx.session.user.lang].notNumberMsg, {
                    parse_mode: "HTML"
                })
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
            } = queryString.parseUrl(ctx.callbackQuery.data)

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
            const user = await users.findOne({
                where: {
                    telegram_id: ctx.session.user.tgid
                },
                raw: true
            })
            const order = await orders.findOne({
                where: {
                    id: user.current_order_id
                },
                raw: true
            })

            if (order) {
                await orders.update({
                    status: 0
                },{
                    where: {
                        id: order.id
                    }
                })
            }

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
                        image_id: element.image_id ? element.image_id + ".jpg" : null,
                        order_id: order.id
                    })
                    if (element.image_id) {
                        let file = await ctx.api.getFile(element.image_id)
                        fileDownloader(file, element.image_id)
                    }
                }
            }

            ctx.session.order = {}

            // buni o'zgartirish kerak!
            await ctx.reply(`${messages[ctx.session.user.lang].orderSavedMsg}`, {
                parse_mode: "HTML",
                reply_markup: {
                    resize_keyboard: true,
                    keyboard: Keyboards[ctx.session.user.lang].cancel_order.build()
                }
            })
            await ctx.reply(`${messages[ctx.session.user.lang].waitCostMsg}`, {
                parse_mode: "HTML",
                reply_markup: InlineKeyboards[ctx.session.user.lang].set_cost
            })
        } catch (error) {
            console.log(error);
        }
    }

    static async setCost(ctx){
        try {
            if (isNaN(ctx.msg.text)) {
                let m = await ctx.reply(messages[ctx.session.user.lang].notNumberCostMsg, {
                    parse_mode: "HTML"
                })
                ctx.session.messages_to_delete.push(m.message_id)
                ctx.session.messages_to_delete.push(ctx.msg.message_id)
                return false
            }

            const user = await users.findOne({
                where: {
                    id: ctx.session.user.id
                },
                raw: true
            })

            const order = await orders.update({
                price: Number(ctx.msg.text),
                status: 2
            },{
                where: {
                    id: user.current_order_id
                },
                returning: true
            })

            await transactions.update({
                price: Number(ctx.msg.text)
            },{
                where: {
                    order_id: user.current_order_id
                }
            })

            await ctx.reply(messages[user.language_code].costSetMsg(user.current_order_id, order[1][0].dataValues.price), {
                parse_mode: "HTML"
            })

            await cleanMessages(ctx)
            return true
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

    static async getPaymentImage(ctx) {
        try {

            const user = await users.findOne({
                where: {
                    id: ctx.session.user.id
                },
                raw: true
            })

            const order = await orders.findOne({
                where: {
                    id: user.current_order_id
                }
            })

            if(order.is_paid){
                ctx.session.step = "menu"
                await Controllers.updateUserStep(ctx, ctx.session.step)
                await sendMenu(ctx)
                return false
            }

            if (order && !order.price) {
                await ctx.reply(messages[ctx.session.user.lang].noCostMsg, {
                    parse_mode: "HTML"
                })
                return false
            }

            if (order && order.payment_pending) {
                await ctx.reply(messages[ctx.session.user.lang].paymentNotCheckedMsg, {
                    parse_mode: "HTML"
                })
                return false
            }

            if (!ctx.msg.photo) {
                await ctx.reply(messages[ctx.session.user.lang].imageRequiredMsg, {
                    parse_mode: "HTML"
                })
                return false
            }

            const file = await ctx.getFile()
            const file_id = file.file_id
            await fileDownloader(file, file_id)
            
            const updated_order = await orders.update({
                payment_image_id: file_id + ".jpg",
                payment_pending: true,
                status: 3
            }, {
                where: {
                    id: user.current_order_id
                },
                returning: true
            })

            const transaction = await transactions.create({
                order_id: updated_order[1][0].dataValues.id,
                image_id: file_id + ".jpg",
                price: updated_order[1][0].dataValues.price
            })
            
            await ctx.reply(messages[ctx.session.user.lang].waitVerificationMsg, {
                parse_mode: "HTML"
            })

        } catch (error) {
            console.log(error);
        }
    }

    static async deleteItem(ctx) {
        try {
            const {
                query
            } = queryString.parseUrl(ctx.callbackQuery.data)

            delete ctx.session.order[query.item_id]

            await ctx.api.deleteMessage(ctx.msg.chat.id, ctx.callbackQuery.message.message_id)
        } catch (error) {
            console.log(error);
        }
    }

    static async cancelOrder(ctx) {
        try {
            const user = await users.findOne({
                where: {
                    telegram_id: ctx.msg.chat.id
                },
                raw: true
            })
            const order = await orders.update({
                status: 0
            },{
                where: {
                    id: user.current_order_id
                }
            })

            await users.update({
                current_order_id: null
            },{
                where: {
                    id: user.id
                }
            })

            await ctx.reply(messages[ctx.session.user.lang].orderCancelledMsg, {
                parse_mode: "HTML",
                reply_markup: {
                    remove_keyboard: true
                }
            })
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