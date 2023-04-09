import {
    Bot,
    session,
    GrammyError,
    HttpError,
} from 'grammy'
import {Router} from '@grammyjs/router'
import configs from './config/index.js'
import sequelize from './db/db.js'
import Controlers from './controllers/bot/controllers.js'
const {
    selectLanguage,
    setLanguage,
    askName,
    setName,
    askPhone,
    setPhone,
    sendMenu,
    updateUserStep,
    openOrderMenu,
    openSettingsMenu,
    backToMenu,
    createOrderItems,
    sendAlert,
    cancelOrderProccess,
    setItemSize,
    getManualAmount,
    setManualAmount,
    setItemAmount,
    changeToEditMenu,
    endOrderProccess,
    saveOrder,
    continueOrderProccess,
    getPaymentImage,
    deleteItem,
    changeCredentials,
    openMyOrdersMenu,
    sendOrders,
    sendCurrentOrder,
    cancelOrder,
    getManualSize,
    setManualSize,
    setCost,
    getManualCost,
    sendOrderItems,
    sendPagesMenu,
    sendOrderPaymentImage,
    sendOrderSectionsMenu
} = Controlers
import messages from './assets/messages.js'
import InlineKeyboards from './assets/inline_keyboard.js'
import queryString from "query-string"

const {
    users,
    orders,
    order_items,
    transactions
} = sequelize.models

const bot = new Bot(configs.TG_TOKEN);

async function tgBot() {
    bot.use(session({
        initial: () => ({
            step: "idle",
            user: {
                id: null,
                tgid: null,
                name: null,
                lang: "uz",
                phone: null,
            },
            messages_to_delete: [],
            last_sent_link_message: null,
            orders_page: 0,
            payment_image_received: false,
            order: {},
            editing_item: {
                item_id: null,
                message_id: null,
                message_type: "text",
                message_content: "",
            }
        })
    }))

    await bot.api.setMyCommands([{
            command: "start",
            description: "Start the bot"
        }
    ]);

    // bot.command("menu", async (ctx) => {
    //     const chat_id = ctx.msg.chat.id
    //     let user = await users.findOne({
    //         where: {
    //             telegram_id: chat_id
    //         },
    //         raw: true
    //     })

    //     if (user.step == "order") {
    //         await ctx.reply(messages[user.language_code].orderingMsg)
    //     }

    //     if(user){
    //         await sendMenu(ctx)
    //     }else{
    //         await ctx.reply("Siz ro'yxatdan o'tmagansiz!\nYou are not registered!")
    //     }
    // })

    bot.command("start", async (ctx, next) => {
        const chat_id = ctx.msg.chat.id

        let user = await users.findOne({
            where: {
                telegram_id: chat_id
            },
            raw: true
        })

        if (!user) {
            const role = chat_id === configs.ADMIN_ID ? 2 : 1
            user = await users.create({
                telegram_id: chat_id,
                role: role,
                step: "language"
            })
            ctx.session.user.tgid = chat_id
            ctx.session.user.id = user.id
            ctx.session.step = "language"
            await selectLanguage(ctx)
            return
        } else if (user) {

            if(!user.language_code){
                ctx.session.step = "language"
                await selectLanguage(ctx)
                return
            }
            if (!user.full_name) {
                ctx.session.step = "name"
                await askName(ctx)
                await updateUserStep(ctx, ctx.session.step)
                return
            }
            if (!user.phone_number) {
                ctx.session.step = "phone"
                await askPhone(ctx)
                await updateUserStep(ctx, ctx.session.step)
                return
            }
        }

        ctx.session.user = {
            tgid: chat_id,
            id: user.id,
            name: user.full_name,
            lang: user.language_code,
            phone: user.phone_number,
        }

        ctx.session.step = user.step

        if (user.step == "menu") {
            await sendMenu(ctx)
        }
        else if (user.step == "order") {
            await ctx.reply(messages[user.language_code].orderingMsg)
        }
        else {
            next()
        }
    })

    bot.on("message", async (ctx, next) => {
        const chat_id = ctx.msg.chat.id

        let user = await users.findOne({
            where: {
                telegram_id: chat_id
            },
            raw: true
        })

        if (!user) {
            await ctx.reply("/start")
            return
        }

        ctx.session.user = {
            tgid: chat_id,
            id: user.id,
            name: user.full_name,
            lang: user.language_code,
            phone: user.phone_number,
        }

        ctx.session.step = user.step
        next()
    })

    const router = new Router((ctx) => ctx.session.step)

    bot.hears(["Bekor qilish", "Отмена"], async (ctx, next) => {
        switch (ctx.session.step) {
            case "order":
            case "payment":
                await cancelOrderProccess(ctx)
                ctx.session.step = "menu"
                await sendMenu(ctx)
                await updateUserStep(ctx, ctx.session.step)
                break;
        
            default:
                next()
                break;
        }
    })
    bot.hears(["Tasdiqlash", "Подтвердить"], async (ctx, next) => {
        switch (ctx.session.step) {
            case "order":
                let v = await endOrderProccess(ctx)
                if (!v) return
                ctx.session.step = "verify"
                await updateUserStep(ctx, ctx.session.step)
                break;
        
            default:
                next()
                break;
        }
    })
    bot.hears(["Ha", "Да"], async (ctx, next) => {
        switch (ctx.session.step) {
            case "verify":
                await saveOrder(ctx)
                ctx.session.step = "payment"
                await updateUserStep(ctx, ctx.session.step)
                break;
            default:
                next()
                break;
        }
    })
    bot.hears(["Yo'q", "Нет"], async (ctx, next) => {
        switch (ctx.session.step) {
            case "verify":
                await continueOrderProccess(ctx)
                ctx.session.step = "order"
                await updateUserStep(ctx, ctx.session.step)
                break;
            default:
                next()
                break;
        }
    })
    bot.hears(["Buyurtmani bekor qilish", "Отменить заказ"], async (ctx) => {
        await cancelOrder(ctx)
        await sendMenu(ctx)
        ctx.session.step = "menu",
        await updateUserStep(ctx, ctx.session.step)
    })

    router.route("language", async (ctx) => {
        await ctx.deleteMessage()
    })

    router.route("name", async (ctx) => {
        await setName(ctx)
        await askPhone(ctx)
        ctx.session.step = "phone"
        await updateUserStep(ctx, ctx.session.step)
    })

    router.route("phone", async (ctx) => {
        console.log(ctx);
        let p = await setPhone(ctx)
        if (!p) return
        await ctx.reply(messages[ctx.session.user.lang].regSuccessMsg, {
            parse_mode: "HTML",
            reply_markup: {
                remove_keyboard: true
            }
        })
        await sendMenu(ctx)
        ctx.session.step = "menu"
        await updateUserStep(ctx, ctx.session.step)
    })

    router.route("menu", async (ctx) => {
        await sendMenu(ctx)
    })

    router.route("order", async (ctx) => {
        let o = await createOrderItems(ctx)
        if (!o) return
    })

    router.route("amount", async (ctx) => {
        let a = await setManualAmount(ctx)
        if (!a) return
        ctx.session.step = "order"
        await updateUserStep(ctx, ctx.session.step)
    })

    router.route("size", async (ctx) => {
        let a = await setManualSize(ctx)
        if (!a) return
        ctx.session.step = "order"
        await updateUserStep(ctx, ctx.session.step)
    })

    router.route("cost", async (ctx) => {
        let a = await setCost(ctx)
        if (!a) return
        ctx.session.step = "payment"
        await updateUserStep(ctx, ctx.session.step)
    })

    router.route("payment", async (ctx) => {
        let a = await getPaymentImage(ctx)
    })

    router.route(`edit_user_info:name`, async (ctx) => {
        let a = await setName(ctx)
        if (!a) return
        await ctx.reply(messages[ctx.session.user.lang].nameChagedMsg(ctx.session.user.name),{
            parse_mode: "HTML",
            reply_markup: InlineKeyboards[ctx.session.user.lang].back("menu")
        })
        ctx.session.step = "menu"
        await updateUserStep(ctx, ctx.session.step)
    })

    router.route(`edit_user_info:phone`, async (ctx) => {
        let a = await setPhone(ctx)
        if (!a) return
        await ctx.reply(messages[ctx.session.user.lang].phoneChagedMsg(ctx.session.user.phone), {
            parse_mode: "HTML",
            reply_markup: InlineKeyboards[ctx.session.user.lang].back("menu")
        })
        ctx.session.step = "menu"
        await updateUserStep(ctx, ctx.session.step)
        // ctx.api.editMessageMedia(de,ede,{type: ""})
    })

    bot.on("callback_query:data", async (ctx) => {

        const { url: command, query } = queryString.parseUrl(ctx.callbackQuery.data)

        console.log(command, query)

        switch (command) {
            case "set_language":
                await setLanguage(ctx)
                if (ctx.session.step == "edit_user_info:lang") {
                    await ctx.api.editMessageText(
                        ctx.callbackQuery.message.chat.id, ctx.callbackQuery.message.message_id,
                        messages[ctx.session.user.lang].langChagedMsg(ctx.session.user.lang),
                    {
                        parse_mode: "HTML",
                        reply_markup: InlineKeyboards[ctx.session.user.lang].back("menu")
                    })
                    ctx.session.step = "menu"
                    await updateUserStep(ctx, ctx.session.step)
                    return
                }
                await askName(ctx)
                break;
            case "new_order":
                await openOrderMenu(ctx)
                break;
            case "my_orders":
                await openMyOrdersMenu(ctx)
                break;
            case "next":
                await sendOrders(ctx, query.page, true)
                break;
            case "prev":
                await sendOrders(ctx, query.page, true)
                break;
            case "next_item":
                await sendOrderItems(ctx, query.order_id, query.page, true)
                break;
            case "prev_item":
                await sendOrderItems(ctx, query.order_id, query.page, true)
                break;
            case "current_order":
                await sendCurrentOrder(ctx)
                break;
            case "all_orders":
                await sendOrders(ctx, null, true)
                break;
            case "order_items":
                await sendOrderItems(ctx, query.order_id, null, "order_menu")
                break;
            case "current_order_items":
                await sendOrderItems(ctx, query.order_id, null, "current_order_menu")
                break;
            case "order_payment_image":
                await sendOrderPaymentImage(ctx, query.order_id)
                break;
            case "order_menu":
                await sendOrderSectionsMenu(ctx, query.order_id, "order_menu", true)
                break;
            case "current_order_menu":
                await sendOrderSectionsMenu(ctx, query.order_id, "current_order_menu", true)
                break;
            case "orders_pages":
                await sendPagesMenu(ctx, query.pages, true)
                break;
            case "page_selected":
                await sendOrders(ctx, query.page, true)
                break;
            case "settings":
                await openSettingsMenu(ctx)
                break;
            case "change_user_info":
                await changeCredentials(ctx)
                break;
            case "back":
                await backToMenu(ctx)
                break;
            case "set_size":
                await setItemSize(ctx)
                break
            case "set_amount":
                await setItemAmount(ctx)
                break
            case "set_cost":
                await getManualCost(ctx)
                break
            case "manual_amount":
                await getManualAmount(ctx)
                break
            case "manual_size":
                await getManualSize(ctx)
                break
            case "change_size":
                await changeToEditMenu(ctx, "sizes_menu")
                break
            case "change_amount":
                await changeToEditMenu(ctx, "amount_menu")
                break
            case "delete_item":
                await deleteItem(ctx)
                break

            default:
                await ctx.answerCallbackQuery()
                break;
        }
    })

    bot.catch((err) => {
        const ctx = err.ctx;
        console.error(`Error while handling update ${ctx.update.update_id}:`);
        const e = err.error;
        if (e instanceof GrammyError) {
            console.error("Error in request:", e.description);
        } else if (e instanceof HttpError) {
            console.error("Could not contact Telegram:", e);
        } else {
            console.error("Unknown error:", e);
        }
    });

    bot.use(router)
    bot.start()
}

async function sendCost(user, order_id, cost, text){
    await bot.api.sendMessage(user.telegram_id, messages[user.language_code].costSetMsg(order_id, cost, text), {
        parse_mode: "HTML"
    })
}

async function sendVerification(user, valid){
    let text = valid ? messages[user.language_code].paymentVerifiedMsg : messages[user.language_code].paymentNotVerifiedMsg

    await bot.api.sendMessage(user.telegram_id, text, {
        parse_mode: "HTML",
        reply_markup: {
            remove_keyboard: valid
        }
    })
    if (valid) {
        await bot.api.sendMessage(user.telegram_id, messages[user.language_code].menuMsg(user.id), {
            parse_mode: "HTML",
            reply_markup: InlineKeyboards[user.language_code].menu
        })
    }
 
}

export {
    tgBot,
    sendCost,
    sendVerification
}