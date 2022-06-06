const messages = {
  startMsg: "Kerakli tilni tanlang \n Choose your language",
  uz: {
    nameMsg: "<b>Ro'yxatdan o'tish uchun ismigizni va familiyangizni kiriting:</b>",
    inputNameMsg: "<b>Ismingizni kiriting:</b>",
    telMsg: "<b>Telefon raqamingizni</b> yuboring:\n\nNamuna: <i>+998901234567</i>",
    anotherTelMsg: "Qo'shimcha telefon raqam yuboring\n\nNamuna: +998901234567",
    incTelMsg: "Iltimos raqamni to'gri kiriting!",
    regSuccessMsg: "Ro'yhatdan muvaffaqiyatli o'tdingiz!",
    orderFirstStep: "Quyidagi link orqali kerakli mahsulotni rasmini (skrinshot) yoki linkini oling va botga yuboring. \n\n 👉https://telegra.ph/Aksessuarlar-03-07",
    menuMsg: "Asosiy menyu",
    amountMsg: "Miqdorni jo'nating:",
    sizeMsg: "O'lchamni jo'nating:",
    chooseCountMsg: "Iltimos, nechtaligini tanglang!",
    invalidNumberMsg: "Raqam noto'g'ri kiritilgan!",
    finishManualAmountMsg: (id) => `Avval ${id}-mahsulotning miqdorini kiriting yoki tanlang!`,
    finishManualSizeMsg: (id) => `Avval ${id}-mahsulotning o'lchamini kiriting yoki tanlang!`,
    invalidMessageMsg: "Link yoki rasm jo'natishingiz kerak!",
    orderNotFinishedMsg: "Buyurtma to'liq yakunlanmagan!",
    checkDataMsg: "Barcha ma'lumotlar to'g'riligiga ishonch hosil qiling!",
    areYouSureMsg: "Buyurtmani tasdiqlaysizmi?",
    notRepliedMsg: "Xabar javob sifatida jo'natilmadi!",
    notNumberMsg: "Iltimos, miqdor sifatida son jo'nating!",
    orderProccessCancelledMsg: "Buyurtma berish bekor qilindi!",
    isVerifyingMsg: "Agar ma'lumot xato bo'lsa unga o'zgartirish kiritish uchun tasdiqlashga Yo'q javobini bering!",
    orderingMsg: "Siz buyurtma berish jarayonidasiz!",
    notOrderingMsg: "Buyurtma berish jarayoni to'xtatilgan! Yangi buyurtma berish uchun menyudan Buyurtma berish bo'limini tanlang.",
    orderSavedMsg: "Buyurtma muvaffaqiyatli saqlandi✅\nBuyurtmaga narx belgilanishini kuting.",
    verifyStoppedMsg: "Buyurtma tasdiqlanmadi❌.",
    noItemsMsg: "Mahsulot qo'shilmagan!",
    nameChagedMsg: (name) => `Ismingiz <b>${name}</b>ga o'zgartirildi✅`,
    phoneChagedMsg: (phone) => `Raqam <b>${phone}</b> ga o'zgartirildi✅`,
    langChagedMsg: (lang) => `Hozirgi til: <b>${lang}</b>✅`,
    chooseSectionMsg: `Kerakli bo'limni tanlang:`,
    notDeliveredMsg: `Oxirgi buyurtmangiz hali yakunlanmagan!`,
    notPaidMsg: `Oxirgi buyurtmaga hali to'lov qilinmagan!`,
    continueOrderMsg: "Buyurtmaga o'zgartirish kiritishingiz yoki yana mahsulotlar qo'shishingiz mumkin.",
    orderInstructions: "Mahsulotlarni yuborib bo'lgach buyurtmani ro'yxatdan o'tkazish uchun <b>Tasdiqlash</b> tugmasini bosing!\n<b>Bekor qilish</b> tugmasi esa jarayonni to'xtatadi!",
    imageRequiredMsg: "Rasm jo'natishingiz kerak!",
    paymentNotCheckedMsg: "Avvalgi to'lov hali adminlar tomonidan ko'rib chiqilmagan. Iltimos, javobni kuting.",
    waitVerificationMsg: "To'lov tasdiqlanishini kuting...",
    orderCancelledMsg: "Buyurtmangiz bekor qilindi.",
    cannotOrderMsg: "Hozircha yangi buyurtma bera olmaysiz.",
    pleaseWaitMsg: "Iltimos, kuting.",
    paymentVerifiedMsg: `To'lov tasdiqlandi✅`,
    paymentNotVerifiedMsg: `To'lov tasdiqlanmadi❌`,
    noCostMsg: `Buyurtmaga hali narx belgilanmadi❌`,
    costSetMsg: (order_id, cost, text) => `${order_id}-buyurtmangizning umumiy narxi <b>${cost}</b> so'm etib belgilandi. \nQo'shimcha izoh: ${text ? `<b>${text}</b>` : "mavjud emas"}. \nTo'lovni tasdiqlovchi rasmni jo'nating.`,
    statusMessages: {
      "1": "Oxirgi buyurtmangizga hali narx belgilanmadi!",
      "2": "Oxirgi buyurtmangizga to'lov qilinmagan. Iltimos, to'lovni tasdiqlovchi rasmni jo'naiting!",
      "3": "Oxirgi buyurtmangizga qilingan to'lov hali tasdiqlanmadi!",
      "4": "Oxirgi buyurtmangiz hali yetkazib berilmadi!",
    }
  },
  ru: {
    nameMsg: "<b>Введите свое имя и фамилию для регистрации:</b>",
    inputNameMsg: "<b>Введите имя:</b>",
    telMsg: "Отправьте свой <b>номер телефона</b>: \n\nОбразец: <i>+998901234567</i>",
    anotherTelMsg: "Отправить дополнительный номер телефона \n\nОбразец: +998901234567",
    incTelMsg: "Пожалуйста, введите номер правильно!",
    regSuccessMsg: "Вы успешно зарегистрировались!",
    orderFirstStep: "Сделайте фото (скриншот) или ссылку на нужный товар по ссылке ниже и отправьте боту. \n\n 👉https://telegra.ph/Aksessuarlar-03-07",
    menuMsg: "Главное меню",
    amountMsg: "Введите количество:",
    sizeMsg: "Введите размер:",
    chooseCountMsg: "Пожалуйста, выберите количество!",
    invalidNumberMsg: "Номер введен неправильно!",
    finishManualAmountMsg: (id) => `Сначала введите или выберите количество товара! ID: ${id}`,
    finishManualSizeMsg: (id) => `Сначала введите или выберите количество товара! ID: ${id}`,
    orderCancelledMsg: "Ваш заказ был отменен!",
    invalidMessageMsg: "Вы должны отправить ссылку или изображение!",
    orderNotFinishedMsg: "Заказ неполный!",
    checkDataMsg: "Убедитесь, что вся информация верна!",
    areYouSureMsg: "Вы подтверждаете заказ?",
    notRepliedMsg: "Сообщение не было отправлено в ответ!",
    notNumberMsg: "Пожалуйста, пришлите номер!",
    orderProccessCancelledMsg: "Заказ отменен!",
    isVerifyingMsg: "Если информация неверна, ответьте Нет, чтобы подтвердить внесение изменений!",
    orderingMsg: "Вы находитесь в процессе оформления заказа!",
    notOrderingMsg: "Прием заказов приостановлен! Чтобы оформить новый заказ, выберите в меню раздел Заказ.",
    orderSavedMsg: "Заказ успешно сохранен✅ \nДождитесь установления цены на заказ.",
    verifyStoppedMsg: "Заказ не был подтвержден❌",
    noItemsMsg: "Товары не добавлены!",
    nameChagedMsg: (name) => `Ваше имя изменился на <b>${name}</b>✅`,
    phoneChagedMsg: (phone) => `Номер телефона изменился на <b>${phone}</b>✅`,
    langChagedMsg: (lang) => `Текущий язык: <b>${lang}</b>✅`,
    chooseSectionMsg: `Выберите нужный раздел:`,
    notDeliveredMsg: `Ваш последний заказ еще не выполнен!`,
    notPaidMsg: `Последний заказ еще не оплачен!`,
    continueOrderMsg: "Вы можете внести изменения в заказ или добавить больше товаров.",
    orderInstructions: "После отправки продуктов, нажмите кнопку <b>Подтвердить</b>, чтобы зарегистрировать свой заказ! \nКнопка <b>Отмена</b> остановит процесс!",
    imageRequiredMsg: "Вы должны отправить изображение!",
    paymentNotCheckedMsg: "Предыдущий платеж еще не был рассмотрен администраторами. Пожалуйста, дождитесь ответа.",
    waitVerificationMsg: "Дождитесь подтверждения платежа...",
    cannotOrderMsg: "Вы еще не можете разместить новый заказ.",
    pleaseWaitMsg: "Пожалуйста подождите.",
    paymentVerifiedMsg: `Платеж подтвержден✅`,
    paymentNotVerifiedMsg: `Платеж не подтвержден❌`,
    noCostMsg: `Цена заказа еще не установлена❌`,
    costSetMsg: (order_id, cost, text) => `ID: ${order_id}. Общая стоимость вашего заказа составляет <b>${cost}</b> сум. \nДополнительный комментарий: ${text? `<b>${text}</b>`: "не существует"}. \nОтправьте изображение, подтверждающее оплату.`,
    statusMessages: {
      "1": "Цена для вашего последнего заказа еще не установлена!",
      "2": "Ваш последний заказ не оплачен. Пожалуйста, пришлите фото, подтверждающее оплату!",
      "3": "Оплата вашего последнего заказа еще не подтверждена!",
      "4": "Ваш последний заказ еще не доставлен!",
    }
  }
}

module.exports = messages