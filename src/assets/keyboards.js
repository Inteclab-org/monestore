const { Keyboard } = require("grammy");


const Keyboards = {
    uz: {
        share_phone: new Keyboard().requestContact("Telefon raqamni jo'natish"),
        verify_order: new Keyboard().text("Bekor qilish").text("Tasdiqlash"),
        yes_no: new Keyboard().text("Yo'q").text("Ha"),
    },
    ru: {
        share_phone: new Keyboard().requestContact("RU Telefon raqamni jo'natish"),
        verify_order: new Keyboard().text("RU Bekor qilish").text("RU Tasdiqlash"),
        yes_no: new Keyboard().text("RU Yo'q").text("RU Ha"),
    }
}

module.exports = Keyboards