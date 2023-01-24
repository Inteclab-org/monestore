const messages = {
  startMsg: "Kerakli tilni tanlang \n Choose your language",
  uz: {
    nameMsg: "👤 <b>Ro'yxatdan o'tish uchun ismigizni va familiyangizni kiriting:</b>",
    inputNameMsg: "👤 <b>Ismingizni kiriting:</b>",
    telMsg: "☎️ <b>Telefon raqamingizni</b> yuboring:\n\nNamuna: <i>+998901234567</i>",
    anotherTelMsg: "Qo'shimcha telefon raqam yuboring\n\nNamuna: +998901234567",
    incTelMsg: "❗️ Iltimos raqamni to'gri kiriting!",
    regSuccessMsg: "✅ Ro'yhatdan muvaffaqiyatli o'tdingiz!",
    orderFirstStep: "Quyidagi link orqali kerakli mahsulotni rasmini (skrinshot) yoki linkini oling va botga yuboring. \n\n 👉https://telegra.ph/Aksessuarlar-03-07",
    menuMsg: (id) => `📖 Asosiy menyu\n\nSizning ID raqamingiz: ${id}`,
    amountMsg: "Miqdorni jo'nating:",
    sizeMsg: "O'lchamni jo'nating:",
    costMsg: "Narxni kiriting:",
    chooseCountMsg: "Iltimos, nechtaligini tanglang!",
    invalidNumberMsg: "Raqam noto'g'ri kiritilgan!",
    finishManualAmountMsg: (id) => `Avval ${id}-mahsulotning miqdorini kiriting yoki tanlang!`,
    finishManualSizeMsg: (id) => `Avval ${id}-mahsulotning o'lchamini kiriting yoki tanlang!`,
    invalidMessageMsg: "Link yoki rasm jo'natishingiz kerak!",
    sendOneImageMsg: "❗️ Faqat bir dona rasm jo'natishingiz kerak! \n\n❕ To'lovni tasdiqlovchi rasm sifatida birinchi rasm qabul qilindi!",
    orderNotFinishedMsg: "Buyurtma to'liq yakunlanmagan!",
    checkDataMsg: "Barcha ma'lumotlar to'g'riligiga ishonch hosil qiling!",
    areYouSureMsg: "Buyurtmani tasdiqlaysizmi?",
    notRepliedMsg: "Xabar javob sifatida jo'natilmadi!",
    notNumberMsg: "Iltimos, miqdor sifatida son jo'nating!",
    orderProccessCancelledMsg: "Buyurtma berish bekor qilindi!",
    isVerifyingMsg: "Agar ma'lumot xato bo'lsa unga o'zgartirish kiritish uchun tasdiqlashga Yo'q javobini bering!",
    orderingMsg: "Siz buyurtma berish jarayonidasiz!",
    notOrderingMsg: "Buyurtma berish jarayoni to'xtatilgan! Yangi buyurtma berish uchun menyudan <b>Buyurtma berish</b> bo'limini tanlang.",
    orderSavedMsg: "Buyurtma muvaffaqiyatli saqlandi✅",
    waitCostMsg: "Buyurtmaga narx belgilanishini kuting. \n<i>(agar narxni bilsangiz o'zingiz kiritishingiz mumkin)</i>",
    verifyStoppedMsg: "Buyurtma tasdiqlanmadi❌.",
    noItemsMsg: "Mahsulot qo'shilmagan!",
    nameChagedMsg: (name) => `Ismingiz <b>${name}</b>ga o'zgartirildi✅`,
    phoneChagedMsg: (phone) => `Raqam <b>${phone}</b> ga o'zgartirildi✅`,
    langChagedMsg: (lang) => `Hozirgi til: <b>${lang}</b>✅`,
    chooseSectionMsg: `Kerakli bo'limni tanlang:`,
    notDeliveredMsg: `Hozirgi buyurtmangiz hali yakunlanmagan!`,
    orderHasPriceMsg: `Buyurtmaga allaqachon narx belgilangan!`,
    notPaidMsg: `Hozirgi buyurtmaga hali to'lov qilinmagan!`,
    continueOrderMsg: "Buyurtmaga o'zgartirish kiritishingiz yoki yana mahsulotlar qo'shishingiz mumkin.",
    orderInstructions: "Mahsulotlarni yuborib bo'lgach buyurtmani ro'yxatdan o'tkazish uchun <b>Tasdiqlash</b> tugmasini bosing!\n<b>Bekor qilish</b> tugmasi esa jarayonni to'xtatadi!",
    imageRequiredMsg: "Rasm jo'natishingiz kerak!",
    paymentNotCheckedMsg: "To'lov hali adminlar tomonidan ko'rib chiqilmagan. Iltimos, javobni kuting.",
    waitVerificationMsg: "To'lov tasdiqlanishini kuting...",
    orderCancelledMsg: "Buyurtmangiz bekor qilindi.",
    cannotOrderMsg: "Hozircha yangi buyurtma bera olmaysiz.",
    pleaseWaitMsg: "Iltimos, kuting.",
    paymentVerifiedMsg: `To'lov tasdiqlandi✅\nOperatorlarimiz tez orada aloqaga chiqishadi.`,
    paymentNotVerifiedMsg: `To'lov tasdiqlanmadi❌\n\n❗️ To'lov to'g'ri amalga oshirilganiga ishonch hosil qiling va rasmni qayta jo'nating`,
    noCostMsg: `Buyurtmaga hali narx belgilanmadi❌`,
    costSetMsg: (order_id, cost, text) => `${order_id}-buyurtmangizning umumiy narxi <b>${cost}</b> so'm etib belgilandi. \nQo'shimcha izoh: ${text ? `<b>${text}</b>` : "<i>mavjud emas</i>"}. \nTo'lovni tasdiqlovchi rasmni jo'nating.`,
    statusMessages: {
      "1": "Hozirgi buyurtmangizga hali narx belgilanmadi!",
      "2": "Hozirgi buyurtmangizga to'lov qilinmagan. Iltimos, to'lovni tasdiqlovchi rasmni jo'naiting!",
      "3": "Hozirgi buyurtmangizga qilingan to'lov hali tasdiqlanmadi!"
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
    menuMsg: (id) => `Главное меню\n\nВаш идентификационный номер: ${id}`,
    amountMsg: "Введите количество:",
    sizeMsg: "Введите размер:",
    costMsg: "Введите цена:",
    chooseCountMsg: "Пожалуйста, выберите количество!",
    invalidNumberMsg: "Номер введен неправильно!",
    finishManualAmountMsg: (id) => `Сначала введите или выберите количество товара! ID: ${id}`,
    finishManualSizeMsg: (id) => `Сначала введите или выберите количество товара! ID: ${id}`,
    orderCancelledMsg: "Ваш заказ был отменен!",
    invalidMessageMsg: "Вы должны отправить ссылку или изображение!",
    sendOneImageMsg: "Пожалуйста, присылайте только одну изображение!",
    orderNotFinishedMsg: "Заказ неполный!",
    checkDataMsg: "Убедитесь, что вся информация верна!",
    areYouSureMsg: "Вы подтверждаете заказ?",
    notRepliedMsg: "Сообщение не было отправлено в ответ!",
    notNumberMsg: "Пожалуйста, пришлите номер!",
    orderProccessCancelledMsg: "Заказ отменен!",
    isVerifyingMsg: "Если информация неверна, ответьте Нет, чтобы подтвердить внесение изменений!",
    orderingMsg: "Вы находитесь в процессе оформления заказа!",
    notOrderingMsg: "Прием заказов приостановлен! Чтобы оформить новый заказ, выберите в меню раздел <b>Hовый заказ</b>.",
    orderSavedMsg: "Заказ успешно сохранен✅",
    waitCostMsg: "Дождитесь установления цены на заказ. \n<i>(если вы знаете цену, вы можете ввести ее самостоятельно)</i>",
    verifyStoppedMsg: "Заказ не был подтвержден❌",
    noItemsMsg: "Товары не добавлены!",
    nameChagedMsg: (name) => `Ваше имя изменился на <b>${name}</b>✅`,
    phoneChagedMsg: (phone) => `Номер телефона изменился на <b>${phone}</b>✅`,
    langChagedMsg: (lang) => `Текущий язык: <b>${lang}</b>✅`,
    chooseSectionMsg: `Выберите нужный раздел:`,
    notDeliveredMsg: `Ваш текущий заказ еще не выполнен!`,
    orderHasPriceMsg: `Заказ уже имеет цену!`,
    notPaidMsg: `Текущий заказ еще не оплачен!`,
    continueOrderMsg: "Вы можете внести изменения в заказ или добавить больше товаров.",
    orderInstructions: "После отправки продуктов, нажмите кнопку <b>Подтвердить</b>, чтобы зарегистрировать свой заказ! \nКнопка <b>Отмена</b> остановит процесс!",
    imageRequiredMsg: "Вы должны отправить изображение!",
    paymentNotCheckedMsg: "Платеж еще не был рассмотрен администраторами. Пожалуйста, дождитесь ответа.",
    waitVerificationMsg: "Дождитесь подтверждения платежа...",
    cannotOrderMsg: "Вы еще не можете разместить новый заказ.",
    pleaseWaitMsg: "Пожалуйста подождите.",
    paymentVerifiedMsg: `Платеж подтвержден✅`,
    paymentNotVerifiedMsg: `Платеж не подтвержден❌`,
    noCostMsg: `Цена заказа еще не установлена❌`,
    costSetMsg: (order_id, cost, text) => `ID: ${order_id}. Общая стоимость вашего заказа составляет <b>${cost}</b> сум. \nДополнительный комментарий: ${text? `<b>${text}</b>`: "<i>не существует</i>"}. \nОтправьте изображение, подтверждающее оплату.`,
    statusMessages: {
      "1": "Цена для вашего текущего заказа еще не установлена!",
      "2": "Ваш текущий заказ не оплачен. Пожалуйста, пришлите фото, подтверждающее оплату!",
      "3": "Оплата вашего текущего заказа еще не подтверждена!"
    }
  }
}

export default messages