const { InlineKeyboard } = require("grammy");

const InlineKeyboards = {
    select_language: 
        new InlineKeyboard()
        .text("Uzbek", "set_language?value=uz")
        .text("Russian", "set_language?value=ru"),
    uz: {
        menu: 
            new InlineKeyboard()
            .text("Buyurtma berish", "new_order")
            .row()
            .text("Ma'lumot", "settings")
            .text("Buyurtmalar", "my_orders"),

        order_first_step_menu: 
            new InlineKeyboard()
            .url("Mahsulotlar", "https://google.com/Uy-va-texnika-jixozlari-03-11"),

        sizes_menu: (item_id) => 
            new InlineKeyboard()
            .text("XXL", `set_size?size=xxl&item_id=${item_id}`)
            .text("XL", `set_size?size=xl&item_id=${item_id}`)
            .text("LX", `set_size?size=lx&item_id=${item_id}`)
            .text("S", `set_size?size=s&item_id=${item_id}`)
            .text("L", `set_size?size=l&item_id=${item_id}`)
            .text("X", `set_size?size=x&item_id=${item_id}`),

        amount_menu: (item_id) => 
            new InlineKeyboard()
            .text("1", `set_amount?value=1&item_id=${item_id}`)
            .text("2", `set_amount?value=2&item_id=${item_id}`)
            .text("3", `set_amount?value=3&item_id=${item_id}`)
            .text("4", `set_amount?value=4&item_id=${item_id}`)
            .text("5", `set_amount?value=5&item_id=${item_id}`)
            .row()
            .text("6", `set_amount?value=6&item_id=${item_id}`)
            .text("7", `set_amount?value=7&item_id=${item_id}`)
            .text("8", `set_amount?value=8&item_id=${item_id}`)
            .text("9", `set_amount?value=9&item_id=${item_id}`)
            .text("10", `set_amount?value=10&item_id=${item_id}`)
            .row()
            .text("Boshqa miqdor", `manual_amount?item_id=${item_id}`),

        edit_item_menu: (item_id) =>
            new InlineKeyboard()
            .text("O'lchamni o'zgartirish", `change_size?item_id=${item_id}`)
            .text("Miqdorni o'zgartirish", `change_amount?item_id=${item_id}`),

        back: (value) => new InlineKeyboard().text("Orqaga", `back?step=${value}`),
    },
    ru: {
        menu: 
            new InlineKeyboard()
            .text("Buyurtma berish", "new_order")
            .row()
            .text("Ma'lumot", "settings")
            .text("Buyurtmalar", "my_orders"),

        order_first_step_menu: 
            new InlineKeyboard()
            .url("Mahsulotlar", "https://google.com/Uy-va-texnika-jixozlari-03-11"),

        sizes_menu: (item_id) => 
            new InlineKeyboard()
            .text("XXL", `set_size?size=xxl&item_id=${item_id}`)
            .text("XL", `set_size?size=xl&item_id=${item_id}`)
            .text("LX", `set_size?size=lx&item_id=${item_id}`)
            .text("S", `set_size?size=s&item_id=${item_id}`)
            .text("L", `set_size?size=l&item_id=${item_id}`)
            .text("X", `set_size?size=x&item_id=${item_id}`),

        amount_menu: (item_id) => 
            new InlineKeyboard()
            .text("1", `set_amount?value=1&item_id=${item_id}`)
            .text("2", `set_amount?value=2&item_id=${item_id}`)
            .text("3", `set_amount?value=3&item_id=${item_id}`)
            .text("4", `set_amount?value=4&item_id=${item_id}`)
            .text("5", `set_amount?value=5&item_id=${item_id}`)
            .row()
            .text("6", `set_amount?value=6&item_id=${item_id}`)
            .text("7", `set_amount?value=7&item_id=${item_id}`)
            .text("8", `set_amount?value=8&item_id=${item_id}`)
            .text("9", `set_amount?value=9&item_id=${item_id}`)
            .text("10", `set_amount?value=10&item_id=${item_id}`)
            .row()
            .text("Boshqa miqdor", `manual_amount`),

        edit_item_menu:
            new InlineKeyboard()
            .text("O'lchamni o'zgartirish", `change_size`)
            .text("Miqdorni o'zgartirish", `change_amount`),

        back: (value) => new InlineKeyboard().text("Orqaga", `back?step=${value}`),
    }
}

module.exports = InlineKeyboards;