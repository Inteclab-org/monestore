 
 
import { InlineKeyboard } from "grammy";

const InlineKeyboards = {
    select_language: new InlineKeyboard()
        .text("🇺🇿 Uzbek", "set_language?value=uz")
        .text("🇷🇺 Russian", "set_language?value=ru"),

    uz: {
        menu: new InlineKeyboard()
            .text("🗒 Buyurtma berish", "new_order")
            .row()
            .text("⚙️ Sozlamalar", "settings")
            .text("📦 Buyurtmalar", "my_orders"),

        set_cost: new InlineKeyboard()
            .text("Narx belgilash", "set_cost"),

        item_menu_switch: (order_id, pages, page, step) => new InlineKeyboard()
            .text("◀️", `prev_item?order_id=${order_id}&page=${Number(page) - 1}`)
            .text(`${Number(page) + 1}/${pages}`, "void")
            .text("▶️", `next_item?order_id=${order_id}&page=${Number(page) + 1}`)
            .row()
            .text("Orqaga ↩️", `back?order_id=${order_id}&step=${step}`),

        order_menu_switch: (order_ids, pages, page, step) => {
            const menu = [
                [{
                    text: "◀️",
                    callback_data: `prev?page=${Number(page) - 1}` 
                },{
                    text: `${Number(page) + 1}/${pages}`,
                    callback_data: `orders_pages?pages=${pages}`
                },{
                    text: "▶️",
                    callback_data: `next?page=${Number(page) + 1}` 
                }],[{
                    text: "Orqaga ↩️", 
                    callback_data: `back?step=${step}`
                }]
            ]
            if (order_ids.length) {
                const ids = []
                for (const id of order_ids) {
                    ids.push({
                        text: `${id}`, 
                        callback_data: `order_menu?order_id=${id}`
                    })
                }
                menu.unshift(ids)
            }
            return menu
        },

        pages: (pages, step) => {
            const pgs = []
            for (let a = 0; a < pages; a++) {
                pgs.push(a)
            }
            const menu = []
            let row = []

            const buttons_count_in_row = 4

            if (pgs.length) {
                for (var i = 0; i < pgs.length; i+=buttons_count_in_row) {
                    row = [{
                        text: `${Number(pgs[i]) + 1}`, 
                        callback_data: `page_selected?page=${pgs[i]}`
                    }]

                    for (var x = i+1; x < i+buttons_count_in_row; x++) {
                        if (pgs[x]) {
                            row.push({
                                text: `${Number(pgs[x]) + 1}`, 
                                callback_data: `page_selected?page=${pgs[x]}`
                            })
                        }
                    }
                    console.log(i, x);
                    menu.push(row)
                }
            }
            menu.push([{
                text: "Orqaga ↩️", 
                callback_data: `back?step=${step}`
            }])
            return menu
        },

        order_first_step_menu: new InlineKeyboard()
            .url("🧾 Mahsulotlar", "https://google.com/Uy-va-texnika-jixozlari-03-11"),

        sizes_menu: (item_id) =>
            new InlineKeyboard()
            .text("XXL", `set_size?size=xxl&item_id=${item_id}`)
            .text("XL", `set_size?size=xl&item_id=${item_id}`)
            .text("LX", `set_size?size=lx&item_id=${item_id}`)
            .row()
            .text("S", `set_size?size=s&item_id=${item_id}`)
            .text("L", `set_size?size=l&item_id=${item_id}`)
            .text("X", `set_size?size=x&item_id=${item_id}`)
            .row()
            .text("Boshqa o'lcham kiritish", `manual_size?item_id=${item_id}`),

        amount_menu: (item_id) =>
            new InlineKeyboard()
            .text("1 ta", `set_amount?value=1&item_id=${item_id}`)
            .text("2 ta", `set_amount?value=2&item_id=${item_id}`)
            .text("3 ta", `set_amount?value=3&item_id=${item_id}`)
            .row()
            .text("4 ta", `set_amount?value=4&item_id=${item_id}`)
            .text("5 ta", `set_amount?value=5&item_id=${item_id}`)
            .text("6 ta", `set_amount?value=6&item_id=${item_id}`)
            .row()
            .text("7 ta", `set_amount?value=7&item_id=${item_id}`)
            .text("8 ta", `set_amount?value=8&item_id=${item_id}`)
            .text("9 ta", `set_amount?value=9&item_id=${item_id}`)
            .row()
            .text("Boshqa miqdor kiritish", `manual_amount?item_id=${item_id}`),

        edit_item_menu: (item_id) =>
            new InlineKeyboard()
            .text("✏️ O'lchamni o'zgartirish", `change_size?item_id=${item_id}`)
            .text("✏️ Miqdorni o'zgartirish", `change_amount?item_id=${item_id}`)
            .row()
            .text("🗑 O'chirish", `delete_item?item_id=${item_id}`),

        user_info_menu: (step) =>
            new InlineKeyboard()
            .text("👤 Ismni o'zgartirish", `change_user_info?step=name`)
            .text("📱 Raqamni o'zgartirish", `change_user_info?step=phone`)
            .row()
            .text("🇺🇿🇷🇺 Tilni o'zgartirish", `change_user_info?step=lang`)
            .row()
            .text("Orqaga ↩️", `back?step=${step}`),
        order_sections_menu: (step) =>
            new InlineKeyboard()
            .text("🔵 Barchasi", `all_orders`)
            .text("🟢 Hozirgi", `current_order`)
            .row()
            .text("Orqaga ↩️", `back?step=${step}`),

        order_menu: (order_id) => new InlineKeyboard()
            .text("Chek rasmi", `order_payment_image?order_id=${order_id}`)
            .text("Mahsulotlar", `order_items?order_id=${order_id}`)
            .row()
            .text("Orqaga ↩️", `back?step=orders_list_edit`),

        current_order_menu: (order_id) => new InlineKeyboard()
            .text("Chek rasmi", `order_payment_image?order_id=${order_id}`)
            .text("Mahsulotlar", `current_order_items?order_id=${order_id}`)
            .row()
            .text("Orqaga ↩️", `back?step=orders`),

        payment_image_back: (order_id) => new InlineKeyboard().text("Orqaga ↩️", `back?step=order_menu&order_id=${order_id}`),
        back: (value) => new InlineKeyboard().text("Orqaga ↩️", `back?step=${value}`),
    },
    ru: {
        menu: new InlineKeyboard()
            .text("🗒 Hовый заказ", "new_order")
            .row()
            .text("⚙️ Настройки", "settings")
            .text("📦 Заказы", "my_orders"),

        set_cost: new InlineKeyboard()
            .text("Указать цену", "set_cost"),

        item_menu_switch: (order_id, pages, page, step) => new InlineKeyboard()
            .text("◀️", `prev_item?order_id=${order_id}&page=${Number(page) - 1}`)
            .text(`${Number(page) + 1}/${pages}`, "void")
            .text("▶️", `next_item?order_id=${order_id}&page=${Number(page) + 1}`)
            .row()
            .text("Назад ↩️", `back?order_id=${order_id}&step=${step}`),

        order_menu_switch: (order_ids, pages, page, step) => {
            const menu = [
                [{
                    text: "◀️",
                    callback_data: `prev?page=${Number(page) - 1}` 
                },{
                    text: `${Number(page) + 1}/${pages}`,
                    callback_data: `orders_pages?pages=${pages}`
                },{
                    text: "▶️",
                    callback_data: `next?page=${Number(page) + 1}` 
                }],[{
                    text: "Назад ↩️", 
                    callback_data: `back?step=${step}`
                }]
            ]
            console.log(order_ids);
            if (order_ids.length) {
                const ids = []
                for (const id of order_ids) {
                    ids.push({
                        text: `${id}`, 
                        callback_data: `order_menu?order_id=${id}`
                    })
                }
                menu.unshift(ids)
            }
            return menu
        },

        pages: (pages, step) => {
            const pgs = []
            for (let a = 0; a < pages; a++) {
                pgs.push(a)
            }
            const menu = []
            let row = []

            const buttons_count_in_row = 4

            if (pgs.length) {
                for (var i = 0; i < pgs.length; i+=buttons_count_in_row) {
                    row = [{
                        text: `${Number(pgs[i]) + 1}`, 
                        callback_data: `page_selected?page=${pgs[i]}`
                    }]

                    for (var x = i+1; x < i+buttons_count_in_row; x++) {
                        if (pgs[x]) {
                            row.push({
                                text: `${Number(pgs[x]) + 1}`, 
                                callback_data: `page_selected?page=${pgs[x]}`
                            })
                        }
                    }
                    console.log(i, x);
                    menu.push(row)
                }
            }
            menu.push([{
                text: "Назад ↩️", 
                callback_data: `back?step=${step}`
            }])
            return menu
        },

        order_first_step_menu: new InlineKeyboard()
            .url("🧾 Товары", "https://google.com/Uy-va-texnika-jixozlari-03-11"),

        sizes_menu: (item_id) =>
            new InlineKeyboard()
            .text("XXL", `set_size?size=xxl&item_id=${item_id}`)
            .text("XL", `set_size?size=xl&item_id=${item_id}`)
            .text("LX", `set_size?size=lx&item_id=${item_id}`)
            .row()
            .text("S", `set_size?size=s&item_id=${item_id}`)
            .text("L", `set_size?size=l&item_id=${item_id}`)
            .text("X", `set_size?size=x&item_id=${item_id}`)
            .row()
            .text("Введит другое размер", `manual_size?item_id=${item_id}`),

        amount_menu: (item_id) =>
            new InlineKeyboard()
            .text("1 шт", `set_amount?value=1&item_id=${item_id}`)
            .text("2 шт", `set_amount?value=2&item_id=${item_id}`)
            .text("3 шт", `set_amount?value=3&item_id=${item_id}`)
            .row()
            .text("4 шт", `set_amount?value=4&item_id=${item_id}`)
            .text("5 шт", `set_amount?value=5&item_id=${item_id}`)
            .text("6 шт", `set_amount?value=6&item_id=${item_id}`)
            .row()
            .text("7 шт", `set_amount?value=7&item_id=${item_id}`)
            .text("8 шт", `set_amount?value=8&item_id=${item_id}`)
            .text("9 шт", `set_amount?value=9&item_id=${item_id}`)
            .row()
            .text("Введит другое количество", `manual_amount?item_id=${item_id}`),

        edit_item_menu: (item_id) =>
            new InlineKeyboard()
            .text("✏️ Изменить размер", `change_size?item_id=${item_id}`)
            .text("✏️ Изменить количество", `change_amount?item_id=${item_id}`)
            .row()
            .text("🗑 Удалить", `delete_item?item_id=${item_id}`),

        user_info_menu: (step) =>
            new InlineKeyboard()
            .text("👤 Изменить имя", `change_user_info?step=name`)
            .text("📱 Изменить номер телефона ", `change_user_info?step=phone`)
            .row()
            .text("🇺🇿🇷🇺 Изменить язык", `change_user_info?step=lang`)
            .row()
            .text("Назад ↩️", `back?step=${step}`),

        order_sections_menu: (step) =>
            new InlineKeyboard()
            .text("🔵 Bсе", `all_orders`)
            .text("🟢 Текущий", `current_order`)
            .row()
            .text("Назад ↩️", `back?step=${step}`),

        order_menu: (order_id) => new InlineKeyboard()
            .text("Изображение оплаты", `order_payment_image?order_id=${order_id}`)
            .text("Продукты", `order_items?order_id=${order_id}`)
            .row()
            .text("Назад ↩️", `back?step=orders_list_edit`),

        current_order_menu: (order_id) => new InlineKeyboard()
            .text("Изображение оплаты", `order_payment_image?order_id=${order_id}`)
            .text("Продукты", `current_order_items?order_id=${order_id}`)
            .row()
            .text("Назад ↩️", `back?step=orders`),

        payment_image_back: (order_id) => new InlineKeyboard().text("Назад ↩️", `back?step=order_menu&order_id=${order_id}`),

        back: (value) => new InlineKeyboard().text("Назад ↩️", `back?step=${value}`),
    }
}

export default InlineKeyboards;