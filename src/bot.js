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
    deleteItem
} = require('./controllers/bot/controllers')
const messages = require('./assets/messages')

const {
    users
} = sequelize.models

const bot = new Bot(configs.TG_TOKEN);

async function tgBot(){
    bot.use(session({
        initial: () => ({
            step: "idle",
            user: {
                name: null,
                lang: "uz",
                phone: null,
            },
            messages_to_delete: [],
            order: {},
            editing_item: {
                item_id: null,
                message_id: null,
                message_type: "text",
                message_content: "",
            }
        })
    }))
    
    bot.command("start", async (ctx) => {
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
                role: role
            })
            ctx.session.step = "language"
            await selectLanguage(ctx)
            return
        } 
        else if (user && (!user.full_name || !user.phone_number)) {
    
            // if(!user.language_code){
            //     ctx.session.step = "language"
            //     await selectLanguage(ctx)
            //     return
            // }
            if (!user.full_name) {
                ctx.session.step = "name"
                await askName(ctx)
                return
            }
            if (!user.phone_number) {
                ctx.session.step = "phone"
                await askPhone(ctx)
                return
            }
        }
    
        ctx.session.user = {
            name: user.full_name,
            lang: user.language_code,
            phone: user.phone_number,
        }
    
        ctx.session.step = "menu"
        await sendMenu(ctx)
    })
    
    const router = new Router((ctx) => ctx.session.step)
    
    bot.hears("Bekor qilish", async (ctx) => {
        await cancelOrderProccess(ctx)
        ctx.session.step = "menu"
        await sendMenu(ctx)
        await updateUserStep(ctx, ctx.session.step)
    })
    bot.hears("Tasdiqlash", async (ctx) => {
        let v = await endOrderProccess(ctx)
        if (!v) return
        ctx.session.step = "verify"
        updateUserStep(ctx, ctx.session.step)
    })
    bot.hears("Ha", async (ctx) => {
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
    bot.hears("Yo'q", async (ctx) => {
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
    
    router.route("name", async (ctx) => {
        await setName(ctx)
        await askPhone(ctx)
        ctx.session.step = "phone"
        await updateUserStep(ctx, ctx.session.step)
    })
    
    router.route("phone", async (ctx) => {
        let p = await setPhone(ctx)
        if (!p) return
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
    
    bot.on("callback_query:data", async (ctx) => {
    
        const {
            url: command,
            query
        } = require('query-string').parseUrl(ctx.callbackQuery.data)
    
        switch (command) {
            case "set_language":
                await setLanguage(ctx)
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
                await openMyOrdersMenu(ctx)
                break;
            case "current_order":
                await showCurrentOrder(ctx)
                break;
            case "all_orders":
                await showAllOrders(ctx)
                break;
            case "settings":
                await openSettingsMenu(ctx)
                break;
            case "back":
                await backToMenu(ctx)
                ctx.session.step = "menu"
                await updateUserStep(ctx, ctx.session.step)
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