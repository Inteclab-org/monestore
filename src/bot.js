const {
    Bot,
    Context,
    Keyboard,
    session,
    SessionFlavor,
    GrammyError,
    HttpError,
} = require('grammy')
const {
    Router
} = require('@grammyjs/router')
const configs = require('./config')
const sequelize = require('./db/db')
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
    sendCurrentOrder
} = require('./controllers/bot/controllers')
const messages = require('./assets/messages')
const InlineKeyboards = require('./assets/inline_keyboard')

const {
    users
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
        },
        // { command: "help", description: "Show help text" },
        // { command: "settings", description: "Open settings" },
    ]);

    bot.command("start", async (ctx, next) => {
        const chat_id = ctx.msg.chat.id

        console.log(chat_id);

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
        await sendMenu(ctx)
    })

    const router = new Router((ctx) => ctx.session.step)

    bot.hears(["Bekor qilish", "RU Bekor qilish"], async (ctx) => {
        await cancelOrderProccess(ctx)
        ctx.session.step = "menu"
        await sendMenu(ctx)
        await updateUserStep(ctx, ctx.session.step)
    })
    bot.hears(["Tasdiqlash", "RU Tasdiqlash"], async (ctx) => {
        let v = await endOrderProccess(ctx)
        if (!v) return
        ctx.session.step = "verify"
        updateUserStep(ctx, ctx.session.step)
    })
    bot.hears(["Ha", "RU Ha"], async (ctx) => {
        switch (ctx.session.step) {
            case "verify":
                await saveOrder(ctx)
                ctx.session.step = "payment"
                await updateUserStep(ctx, ctx.session.step)
                break;
            default:
                break;
        }
    })
    bot.hears(["Yo'q", "RU Yo'q"], async (ctx) => {
        switch (ctx.session.step) {
            case "verify":
                await continueOrderProccess(ctx)
                ctx.session.step = "order"
                await updateUserStep(ctx, ctx.session.step)
                break;
            default:
                break;
        }
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

    router.route("payment", async (ctx) => {
        let a = await getPaymentImage(ctx)
        if (!a) return
        ctx.session.step = "menu"
        await updateUserStep(ctx, ctx.session.step)
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
    })

    bot.on("callback_query:data", async (ctx) => {

        const {
            url: command,
            query
        } = require('query-string').parseUrl(ctx.callbackQuery.data)

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
                ctx.session.step = "name"
                await updateUserStep(ctx, ctx.session.step)
                break;
            case "new_order":
                await openOrderMenu(ctx)
                ctx.session.step = "order"
                await updateUserStep(ctx, ctx.session.step)
                break;
            case "my_orders":
                await openMyOrdersMenu(ctx, 0)
                break;
            case "next":
                await sendOrders(ctx, query.offset)
                break;
            case "prev":
                await sendOrders(ctx, query.offset)
                break;
            case "current_order":
                await sendCurrentOrder(ctx)
                break;
            case "all_orders":
                await sendOrders(ctx, 0)
                break;
            case "settings":
                await openSettingsMenu(ctx)
                break;
            case "change_user_info":
                await changeCredentials(ctx)
                break;
            case "back":
                await backToMenu(ctx)
                // ctx.session.step = "menu"
                // await updateUserStep(ctx, ctx.session.step)
                break;

            case "set_size":
                await setItemSize(ctx)
                break
            case "set_amount":
                await setItemAmount(ctx)
                break
            case "manual_amount":
                await getManualAmount(ctx)
                ctx.session.step = "amount"
                await updateUserStep(ctx, ctx.session.step)
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

module.exports = tgBot