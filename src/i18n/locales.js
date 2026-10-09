export const languages = [
	{ code: 'en', label: 'English', htmlLang: 'en', intl: 'en-US' },
	{ code: 'bn', label: 'বাংলা', htmlLang: 'bn', intl: 'bn-BD' },
	{ code: 'zh', label: '中文', htmlLang: 'zh-Hans', intl: 'zh-CN' },
	{ code: 'ru', label: 'Русский', htmlLang: 'ru', intl: 'ru-RU' },
	{ code: 'it', label: 'Italiano', htmlLang: 'it', intl: 'it-IT' },
	{ code: 'fr', label: 'Français', htmlLang: 'fr', intl: 'fr-FR' },
	{ code: 'hi', label: 'हिन्दी', htmlLang: 'hi', intl: 'hi-IN' },
];

const english = {
	site: { title: 'GuesthouseBD — Stays, rides & local guides' },
	nav: { all: 'All', stays: 'Stays', ride: 'Pick & drop', guides: 'Guides', explore: 'Explore categories', host: 'List your place', language: 'Choose language', account: 'Sign up or open your account', themeLight: 'Switch to light theme', themeDark: 'Switch to dark theme' },
	common: { previous: 'Previous', next: 'Next' },
	search: {
		where: 'Where to?', when: 'When?', who: 'Who?', destinations: 'Search destinations', addDates: 'Add dates', addGuests: 'Add guests', anywhere: 'Anywhere', search: 'Search', searchStays: 'Search stays', current: 'Current search', close: 'Close search', popular: 'Popular destinations', today: 'Today', tomorrow: 'Tomorrow', weekend: 'This weekend', oneNight: 'One night', twoNights: 'Two nights', previousMonth: 'Previous month', nextMonth: 'Next month', pickCheckIn: 'Choose a check-in date', pickCheckOut: 'Choose a check-out date', coming: 'Who’s coming?', adults: 'Adults', adultAge: 'Ages 13 or above', children: 'Children', childrenAge: 'Ages 2–12', infants: 'Infants', infantAge: 'Under 2', removeAdult: 'Remove an adult', addAdult: 'Add an adult', removeChild: 'Remove a child', addChild: 'Add a child', removeInfant: 'Remove an infant', addInfant: 'Add an infant', guest_one: '{{count}} guest', guest_other: '{{count}} guests', guest_few: '{{count}} guests', guest_many: '{{count}} guests',
	},
	stays: { eyebrow: 'Guesthouses to book & rent', popular: 'Most popular with our guests', description: 'Book by the night or rent for the season. Every guesthouse is checked by our team.', viewAll: 'View all', noMatch: 'No stays match this destination. Try another place.', inLocation: 'Stays in {{destination}}', night: 'night' },
	homes: { kerala: 'Villa in Kerala', calangute: 'Flat in Calangute', wayanad: 'Room in Wayanad', bali: 'Villa in Bali', poolGoa: 'Pool house in Goa', resortGoa: 'Resort suite' },
	services: { heading: 'Everything on the road, one booking', rideTitle: 'Travel pick & drop', rideDescription: 'Airport, station or doorstep. Book a driver and track your ride.', assistantTitle: 'Tour assistants', assistantDescription: 'Local helpers who carry the plan: bookings, tickets and translation.', guideTitle: 'Travel guides', guideDescription: 'Licensed guides who know the stories behind each place.' },
	people: { assistants: 'Tour assistants', guides: 'Travel guides', assistantRole: 'Tour assistant', guideRole: 'Travel guide', fromDay: 'From $30 / day', book: 'Book', all: 'All', female: 'Female', male: 'Male' },
	inside: { step: 'STEP', title: 'Inside for living', view: 'View stays' },
	payments: { title: 'Pay your way', description: 'Choose a default method. You can change it at checkout.', card: 'Card', cardDescription: 'Visa, Mastercard, RuPay', upi: 'UPI', upiDescription: 'Pay with any UPI app', netBanking: 'Net banking', netBankingDescription: 'Direct bank transfer', wallets: 'Wallets', walletsDescription: 'Apple Pay, Google Pay', arrival: 'Pay on arrival', arrivalDescription: 'Cash to host or driver' },
	join: { title: 'Create your account', description: 'Join with the app you already use.', email: 'Or use your email', continue: 'Continue', emailLabel: 'Email' },
	closing: { tag: 'Discover places worth travelling for', title: 'Your next stay awaits now', explore: 'Explore stays' },
	footer: { explore: 'Explore', guesthouses: 'Guesthouses', pickDrop: 'Pick & drop', guides: 'Guides', support: 'Support', help: 'Help centre', contact: 'Contact us', legal: 'Legal', terms: 'Terms', privacy: 'Privacy', newsletter: 'Enter email', subscribe: 'Subscribe' },
};

const bangla = {
	site: { title: 'GuesthouseBD — থাকা, যাতায়াত ও স্থানীয় গাইড' },
	nav: { all: 'সব', stays: 'থাকার জায়গা', ride: 'যাতায়াত', guides: 'গাইড', explore: 'বিভাগ দেখুন', host: 'আপনার জায়গা তালিকাভুক্ত করুন', language: 'ভাষা বাছুন', account: 'সাইন আপ বা অ্যাকাউন্ট খুলুন', themeLight: 'লাইট থিমে যান', themeDark: 'ডার্ক থিমে যান' },
	common: { previous: 'আগেরটি', next: 'পরেরটি' },
	search: { where: 'কোথায় যাবেন?', when: 'কখন?', who: 'কারা যাবেন?', destinations: 'গন্তব্য খুঁজুন', addDates: 'তারিখ যোগ করুন', addGuests: 'অতিথি যোগ করুন', anywhere: 'যেকোনো জায়গা', search: 'খুঁজুন', searchStays: 'থাকার জায়গা খুঁজুন', current: 'বর্তমান অনুসন্ধান', close: 'অনুসন্ধান বন্ধ করুন', popular: 'জনপ্রিয় গন্তব্য', today: 'আজ', tomorrow: 'আগামীকাল', weekend: 'এই সপ্তাহান্তে', oneNight: 'এক রাত', twoNights: 'দুই রাত', previousMonth: 'আগের মাস', nextMonth: 'পরের মাস', pickCheckIn: 'চেক-ইনের তারিখ বাছুন', pickCheckOut: 'চেক-আউটের তারিখ বাছুন', coming: 'কারা আসছেন?', adults: 'প্রাপ্তবয়স্ক', adultAge: '১৩ বছর বা তার বেশি', children: 'শিশু', childrenAge: '২–১২ বছর', infants: 'কোলের শিশু', infantAge: '২ বছরের কম', removeAdult: 'একজন প্রাপ্তবয়স্ক সরান', addAdult: 'একজন প্রাপ্তবয়স্ক যোগ করুন', removeChild: 'একটি শিশু সরান', addChild: 'একটি শিশু যোগ করুন', removeInfant: 'একটি কোলের শিশু সরান', addInfant: 'একটি কোলের শিশু যোগ করুন', guest_one: '{{count}} জন অতিথি', guest_other: '{{count}} জন অতিথি' },
	stays: { eyebrow: 'বুকিং ও ভাড়ার জন্য গেস্টহাউস', popular: 'অতিথিদের পছন্দের', description: 'রাতপ্রতি বুক করুন বা মৌসুমের জন্য ভাড়া নিন। প্রতিটি গেস্টহাউস আমাদের দল যাচাই করে।', viewAll: 'সব দেখুন', noMatch: 'এই গন্তব্যে থাকার জায়গা নেই। অন্য জায়গা চেষ্টা করুন।', inLocation: '{{destination}}-এ থাকার জায়গা', night: 'রাত' },
	homes: { kerala: 'কেরালার ভিলা', calangute: 'কালাঙ্গুটের ফ্ল্যাট', wayanad: 'ওয়ানাডের ঘর', bali: 'বালির ভিলা', poolGoa: 'গোয়ার পুল হাউস', resortGoa: 'রিসোর্ট স্যুইট' },
	services: { heading: 'যাতায়াত থেকে থাকা, এক বুকিংয়ে', rideTitle: 'যাতায়াত সেবা', rideDescription: 'বিমানবন্দর, স্টেশন বা আপনার দরজা থেকে। গাড়ি বুক করুন ও যাত্রা দেখুন।', assistantTitle: 'ট্যুর সহকারী', assistantDescription: 'স্থানীয় সহায়তায় বুকিং, টিকিট ও অনুবাদের কাজ সহজ করুন।', guideTitle: 'ভ্রমণ গাইড', guideDescription: 'প্রতিটি জায়গার গল্প জানা লাইসেন্সধারী গাইড।' },
	people: { assistants: 'ট্যুর সহকারী', guides: 'ভ্রমণ গাইড', assistantRole: 'ট্যুর সহকারী', guideRole: 'ভ্রমণ গাইড', fromDay: 'দিনে $30 থেকে', book: 'বুক করুন', all: 'সব', female: 'নারী', male: 'পুরুষ' },
	inside: { step: 'ধাপ', title: 'থাকার জায়গার ভেতরে', view: 'থাকার জায়গা দেখুন' },
	payments: { title: 'আপনার পছন্দের পেমেন্ট', description: 'ডিফল্ট পেমেন্ট পদ্ধতি বাছুন। চেকআউটে বদলাতে পারবেন।', card: 'কার্ড', cardDescription: 'Visa, Mastercard, RuPay', upi: 'UPI', upiDescription: 'যেকোনো UPI অ্যাপে পেমেন্ট', netBanking: 'নেট ব্যাংকিং', netBankingDescription: 'সরাসরি ব্যাংক ট্রান্সফার', wallets: 'ওয়ালেট', walletsDescription: 'Apple Pay, Google Pay', arrival: 'পৌঁছে পেমেন্ট', arrivalDescription: 'হোস্ট বা ড্রাইভারকে নগদ দিন' },
	join: { title: 'অ্যাকাউন্ট তৈরি করুন', description: 'আপনার ব্যবহৃত অ্যাপ দিয়ে যোগ দিন।', email: 'অথবা ইমেইল ব্যবহার করুন', continue: 'চালিয়ে যান', emailLabel: 'ইমেইল' },
	closing: { tag: 'ভ্রমণের মতো সুন্দর জায়গা খুঁজে নিন', title: 'আপনার পরের থাকা শুরু হোক', explore: 'থাকার জায়গা দেখুন' },
	footer: { explore: 'ঘুরে দেখুন', guesthouses: 'গেস্টহাউস', pickDrop: 'যাতায়াত', guides: 'গাইড', support: 'সহায়তা', help: 'সহায়তা কেন্দ্র', contact: 'যোগাযোগ', legal: 'আইনি তথ্য', terms: 'শর্তাবলি', privacy: 'গোপনীয়তা', newsletter: 'ইমেইল লিখুন', subscribe: 'সাবস্ক্রাইব' },
};

const chinese = {
	site: { title: 'GuesthouseBD — 住宿、接送与当地向导' },
	nav: { all: '全部', stays: '住宿', ride: '接送', guides: '导游', explore: '浏览类别', host: '发布您的房源', language: '选择语言', account: '注册或打开账户', themeLight: '切换到浅色主题', themeDark: '切换到深色主题' },
	common: { previous: '上一项', next: '下一项' },
	search: { where: '想去哪里？', when: '何时？', who: '几位？', destinations: '搜索目的地', addDates: '添加日期', addGuests: '添加客人', anywhere: '不限地点', search: '搜索', searchStays: '搜索住宿', current: '当前搜索', close: '关闭搜索', popular: '热门目的地', today: '今天', tomorrow: '明天', weekend: '本周末', oneNight: '一晚', twoNights: '两晚', previousMonth: '上个月', nextMonth: '下个月', pickCheckIn: '选择入住日期', pickCheckOut: '选择退房日期', coming: '谁会同行？', adults: '成人', adultAge: '13岁及以上', children: '儿童', childrenAge: '2至12岁', infants: '婴幼儿', infantAge: '2岁以下', removeAdult: '移除一位成人', addAdult: '添加一位成人', removeChild: '移除一位儿童', addChild: '添加一位儿童', removeInfant: '移除一位婴幼儿', addInfant: '添加一位婴幼儿', guest_one: '{{count}}位客人', guest_other: '{{count}}位客人' },
	stays: { eyebrow: '可预订和租住的旅馆', popular: '最受旅客欢迎', description: '可按晚预订或按季节租住。每家旅馆都经过团队审核。', viewAll: '查看全部', noMatch: '没有符合此目的地的住宿，请尝试其他地点。', inLocation: '{{destination}}的住宿', night: '晚' },
	homes: { kerala: '喀拉拉邦别墅', calangute: '卡兰古特公寓', wayanad: '瓦亚纳德客房', bali: '巴厘岛别墅', poolGoa: '果阿泳池别墅', resortGoa: '度假套房' },
	services: { heading: '出行住宿，一次预订', rideTitle: '接送服务', rideDescription: '机场、车站或家门口均可接送。预订司机并追踪行程。', assistantTitle: '旅行助理', assistantDescription: '由当地助手协助预订、购票和翻译。', guideTitle: '旅行导游', guideDescription: '持证导游带您了解每个地方的故事。' },
	people: { assistants: '旅行助理', guides: '旅行导游', assistantRole: '旅行助理', guideRole: '旅行导游', fromDay: '每天30美元起', book: '预订', all: '全部', female: '女性', male: '男性' },
	inside: { step: '步骤', title: '住进旅途之中', view: '查看住宿' },
	payments: { title: '选择付款方式', description: '选择默认付款方式，结账时仍可更改。', card: '银行卡', cardDescription: 'Visa、Mastercard、RuPay', upi: 'UPI', upiDescription: '使用任意UPI应用付款', netBanking: '网上银行', netBankingDescription: '银行直接转账', wallets: '电子钱包', walletsDescription: 'Apple Pay、Google Pay', arrival: '到店付款', arrivalDescription: '向房东或司机支付现金' },
	join: { title: '创建账户', description: '使用您常用的应用加入。', email: '或使用电子邮箱', continue: '继续', emailLabel: '电子邮箱' },
	closing: { tag: '发现值得前往的地方', title: '开启您的下一段住宿', explore: '探索住宿' },
	footer: { explore: '探索', guesthouses: '旅馆', pickDrop: '接送', guides: '导游', support: '支持', help: '帮助中心', contact: '联系我们', legal: '法律信息', terms: '条款', privacy: '隐私政策', newsletter: '输入邮箱', subscribe: '订阅' },
};

const russian = {
	site: { title: 'GuesthouseBD — жильё, трансфер и местные гиды' },
	nav: { all: 'Все', stays: 'Жильё', ride: 'Трансфер', guides: 'Гиды', explore: 'Категории', host: 'Разместить жильё', language: 'Выберите язык', account: 'Регистрация или вход в аккаунт', themeLight: 'Включить светлую тему', themeDark: 'Включить тёмную тему' },
	common: { previous: 'Назад', next: 'Далее' },
	search: { where: 'Куда?', when: 'Когда?', who: 'Кто едет?', destinations: 'Поиск направлений', addDates: 'Добавить даты', addGuests: 'Добавить гостей', anywhere: 'Где угодно', search: 'Найти', searchStays: 'Найти жильё', current: 'Текущий поиск', close: 'Закрыть поиск', popular: 'Популярные направления', today: 'Сегодня', tomorrow: 'Завтра', weekend: 'В эти выходные', oneNight: 'Одна ночь', twoNights: 'Две ночи', previousMonth: 'Предыдущий месяц', nextMonth: 'Следующий месяц', pickCheckIn: 'Выберите дату заезда', pickCheckOut: 'Выберите дату выезда', coming: 'Кто едет?', adults: 'Взрослые', adultAge: 'От 13 лет', children: 'Дети', childrenAge: 'От 2 до 12 лет', infants: 'Младенцы', infantAge: 'До 2 лет', removeAdult: 'Убрать взрослого', addAdult: 'Добавить взрослого', removeChild: 'Убрать ребёнка', addChild: 'Добавить ребёнка', removeInfant: 'Убрать младенца', addInfant: 'Добавить младенца', guest_one: '{{count}} гость', guest_few: '{{count}} гостя', guest_many: '{{count}} гостей', guest_other: '{{count}} гостя' },
	stays: { eyebrow: 'Гостевые дома для бронирования и аренды', popular: 'Популярное у гостей', description: 'Бронируйте на ночь или арендуйте на сезон. Наша команда проверяет каждый гостевой дом.', viewAll: 'Показать все', noMatch: 'Нет жилья в этом месте. Попробуйте другой вариант.', inLocation: 'Жильё: {{destination}}', night: 'ночь' },
	homes: { kerala: 'Вилла в Керале', calangute: 'Квартира в Калангуте', wayanad: 'Комната в Ваянаде', bali: 'Вилла на Бали', poolGoa: 'Дом с бассейном в Гоа', resortGoa: 'Номер на курорте' },
	services: { heading: 'Дорога и жильё в одном бронировании', rideTitle: 'Трансфер', rideDescription: 'Из аэропорта, с вокзала или от двери. Закажите водителя и следите за поездкой.', assistantTitle: 'Помощники в поездке', assistantDescription: 'Местные помощники помогут с бронированиями, билетами и переводом.', guideTitle: 'Туристические гиды', guideDescription: 'Лицензированные гиды, знающие истории каждого места.' },
	people: { assistants: 'Помощники в поездке', guides: 'Туристические гиды', assistantRole: 'Помощник в поездке', guideRole: 'Гид', fromDay: 'От 30 $ в день', book: 'Забронировать', all: 'Все', female: 'Женщины', male: 'Мужчины' },
	inside: { step: 'ШАГ', title: 'Жизнь внутри путешествия', view: 'Смотреть жильё' },
	payments: { title: 'Выберите способ оплаты', description: 'Выберите основной способ. Его можно изменить при оформлении.', card: 'Карта', cardDescription: 'Visa, Mastercard, RuPay', upi: 'UPI', upiDescription: 'Оплата через любое приложение UPI', netBanking: 'Интернет-банк', netBankingDescription: 'Прямой банковский перевод', wallets: 'Кошельки', walletsDescription: 'Apple Pay, Google Pay', arrival: 'Оплата на месте', arrivalDescription: 'Наличными хозяину или водителю' },
	join: { title: 'Создать аккаунт', description: 'Войдите через привычное приложение.', email: 'Или используйте электронную почту', continue: 'Продолжить', emailLabel: 'Электронная почта' },
	closing: { tag: 'Откройте места, ради которых стоит путешествовать', title: 'Ваше следующее жильё уже ждёт', explore: 'Смотреть жильё' },
	footer: { explore: 'Обзор', guesthouses: 'Гостевые дома', pickDrop: 'Трансфер', guides: 'Гиды', support: 'Поддержка', help: 'Центр помощи', contact: 'Связаться с нами', legal: 'Правовая информация', terms: 'Условия', privacy: 'Конфиденциальность', newsletter: 'Введите почту', subscribe: 'Подписаться' },
};

const italian = {
	site: { title: 'GuesthouseBD — soggiorni, trasferimenti e guide locali' },
	nav: { all: 'Tutto', stays: 'Soggiorni', ride: 'Trasferimenti', guides: 'Guide', explore: 'Esplora le categorie', host: 'Pubblica il tuo alloggio', language: 'Scegli la lingua', account: 'Registrati o apri il tuo account', themeLight: 'Passa al tema chiaro', themeDark: 'Passa al tema scuro' },
	common: { previous: 'Precedente', next: 'Successivo' },
	search: { where: 'Dove vuoi andare?', when: 'Quando?', who: 'Chi viaggia?', destinations: 'Cerca destinazioni', addDates: 'Aggiungi date', addGuests: 'Aggiungi ospiti', anywhere: 'Ovunque', search: 'Cerca', searchStays: 'Cerca soggiorni', current: 'Ricerca attuale', close: 'Chiudi la ricerca', popular: 'Destinazioni popolari', today: 'Oggi', tomorrow: 'Domani', weekend: 'Questo fine settimana', oneNight: 'Una notte', twoNights: 'Due notti', previousMonth: 'Mese precedente', nextMonth: 'Mese successivo', pickCheckIn: 'Scegli la data di arrivo', pickCheckOut: 'Scegli la data di partenza', coming: 'Chi viaggia?', adults: 'Adulti', adultAge: 'Dai 13 anni', children: 'Bambini', childrenAge: 'Da 2 a 12 anni', infants: 'Neonati', infantAge: 'Meno di 2 anni', removeAdult: 'Rimuovi un adulto', addAdult: 'Aggiungi un adulto', removeChild: 'Rimuovi un bambino', addChild: 'Aggiungi un bambino', removeInfant: 'Rimuovi un neonato', addInfant: 'Aggiungi un neonato', guest_one: '{{count}} ospite', guest_other: '{{count}} ospiti' },
	stays: { eyebrow: 'Guesthouse da prenotare e affittare', popular: 'Le più amate dai nostri ospiti', description: 'Prenota per notte o affitta per la stagione. Il nostro team verifica ogni guesthouse.', viewAll: 'Vedi tutto', noMatch: 'Nessun soggiorno per questa destinazione. Prova un altro luogo.', inLocation: 'Soggiorni a {{destination}}', night: 'notte' },
	homes: { kerala: 'Villa in Kerala', calangute: 'Appartamento a Calangute', wayanad: 'Camera a Wayanad', bali: 'Villa a Bali', poolGoa: 'Casa con piscina a Goa', resortGoa: 'Suite in un resort' },
	services: { heading: 'Strada e soggiorno, con una sola prenotazione', rideTitle: 'Trasferimenti', rideDescription: 'Aeroporto, stazione o porta di casa. Prenota un autista e segui il viaggio.', assistantTitle: 'Assistenti di viaggio', assistantDescription: 'Persone del posto ti aiutano con prenotazioni, biglietti e traduzioni.', guideTitle: 'Guide turistiche', guideDescription: 'Guide autorizzate che conoscono le storie di ogni luogo.' },
	people: { assistants: 'Assistenti di viaggio', guides: 'Guide turistiche', assistantRole: 'Assistente di viaggio', guideRole: 'Guida turistica', fromDay: 'Da 30 $ al giorno', book: 'Prenota', all: 'Tutti', female: 'Donne', male: 'Uomini' },
	inside: { step: 'PASSAGGIO', title: 'Vivi il soggiorno', view: 'Vedi soggiorni' },
	payments: { title: 'Paga come preferisci', description: 'Scegli un metodo predefinito. Puoi cambiarlo al pagamento.', card: 'Carta', cardDescription: 'Visa, Mastercard, RuPay', upi: 'UPI', upiDescription: 'Paga con qualsiasi app UPI', netBanking: 'Home banking', netBankingDescription: 'Bonifico bancario diretto', wallets: 'Wallet', walletsDescription: 'Apple Pay, Google Pay', arrival: 'Paga all’arrivo', arrivalDescription: 'In contanti all’host o all’autista' },
	join: { title: 'Crea il tuo account', description: 'Accedi con l’app che usi già.', email: 'Oppure usa la tua email', continue: 'Continua', emailLabel: 'Email' },
	closing: { tag: 'Scopri luoghi che meritano un viaggio', title: 'Il tuo prossimo soggiorno ti aspetta', explore: 'Esplora soggiorni' },
	footer: { explore: 'Esplora', guesthouses: 'Guesthouse', pickDrop: 'Trasferimenti', guides: 'Guide', support: 'Assistenza', help: 'Centro assistenza', contact: 'Contattaci', legal: 'Informazioni legali', terms: 'Termini', privacy: 'Privacy', newsletter: 'Inserisci email', subscribe: 'Iscriviti' },
};

const french = {
	site: { title: 'GuesthouseBD — logements, transferts et guides locaux' },
	nav: { all: 'Tout', stays: 'Logements', ride: 'Transferts', guides: 'Guides', explore: 'Explorer les catégories', host: 'Proposer votre logement', language: 'Choisir la langue', account: 'Créer un compte ou ouvrir le vôtre', themeLight: 'Passer au thème clair', themeDark: 'Passer au thème sombre' },
	common: { previous: 'Précédent', next: 'Suivant' },
	search: { where: 'Où souhaitez-vous aller ?', when: 'Quand ?', who: 'Qui voyage ?', destinations: 'Rechercher une destination', addDates: 'Ajouter des dates', addGuests: 'Ajouter des voyageurs', anywhere: 'N’importe où', search: 'Rechercher', searchStays: 'Rechercher un logement', current: 'Recherche en cours', close: 'Fermer la recherche', popular: 'Destinations populaires', today: 'Aujourd’hui', tomorrow: 'Demain', weekend: 'Ce week-end', oneNight: 'Une nuit', twoNights: 'Deux nuits', previousMonth: 'Mois précédent', nextMonth: 'Mois suivant', pickCheckIn: 'Choisissez la date d’arrivée', pickCheckOut: 'Choisissez la date de départ', coming: 'Qui voyage ?', adults: 'Adultes', adultAge: '13 ans ou plus', children: 'Enfants', childrenAge: 'De 2 à 12 ans', infants: 'Bébés', infantAge: 'Moins de 2 ans', removeAdult: 'Retirer un adulte', addAdult: 'Ajouter un adulte', removeChild: 'Retirer un enfant', addChild: 'Ajouter un enfant', removeInfant: 'Retirer un bébé', addInfant: 'Ajouter un bébé', guest_one: '{{count}} voyageur', guest_other: '{{count}} voyageurs' },
	stays: { eyebrow: 'Maisons d’hôtes à réserver ou à louer', popular: 'Les plus appréciés de nos voyageurs', description: 'Réservez à la nuitée ou louez pour la saison. Notre équipe vérifie chaque maison d’hôtes.', viewAll: 'Tout voir', noMatch: 'Aucun logement pour cette destination. Essayez un autre lieu.', inLocation: 'Logements à {{destination}}', night: 'nuit' },
	homes: { kerala: 'Villa au Kerala', calangute: 'Appartement à Calangute', wayanad: 'Chambre à Wayanad', bali: 'Villa à Bali', poolGoa: 'Maison avec piscine à Goa', resortGoa: 'Suite en resort' },
	services: { heading: 'Transport et séjour, en une réservation', rideTitle: 'Transferts', rideDescription: 'Aéroport, gare ou domicile. Réservez un chauffeur et suivez votre trajet.', assistantTitle: 'Assistants de voyage', assistantDescription: 'Des habitants vous aident pour les réservations, les billets et la traduction.', guideTitle: 'Guides touristiques', guideDescription: 'Des guides agréés qui connaissent les histoires de chaque lieu.' },
	people: { assistants: 'Assistants de voyage', guides: 'Guides touristiques', assistantRole: 'Assistant de voyage', guideRole: 'Guide touristique', fromDay: 'À partir de 30 $ / jour', book: 'Réserver', all: 'Tout', female: 'Femmes', male: 'Hommes' },
	inside: { step: 'ÉTAPE', title: 'Vivre le séjour', view: 'Voir les logements' },
	payments: { title: 'Payez à votre façon', description: 'Choisissez un moyen de paiement par défaut. Vous pourrez le modifier au règlement.', card: 'Carte', cardDescription: 'Visa, Mastercard, RuPay', upi: 'UPI', upiDescription: 'Payez avec l’application UPI de votre choix', netBanking: 'Banque en ligne', netBankingDescription: 'Virement bancaire direct', wallets: 'Portefeuilles', walletsDescription: 'Apple Pay, Google Pay', arrival: 'Payer à l’arrivée', arrivalDescription: 'En espèces à l’hôte ou au chauffeur' },
	join: { title: 'Créer votre compte', description: 'Connectez-vous avec l’application que vous utilisez déjà.', email: 'Ou utilisez votre adresse e-mail', continue: 'Continuer', emailLabel: 'E-mail' },
	closing: { tag: 'Découvrez des lieux qui valent le détour', title: 'Votre prochain séjour vous attend', explore: 'Découvrir les logements' },
	footer: { explore: 'Explorer', guesthouses: 'Maisons d’hôtes', pickDrop: 'Transferts', guides: 'Guides', support: 'Assistance', help: 'Centre d’aide', contact: 'Nous contacter', legal: 'Mentions légales', terms: 'Conditions', privacy: 'Confidentialité', newsletter: 'Saisissez votre e-mail', subscribe: 'S’inscrire' },
};

const hindi = {
	site: { title: 'GuesthouseBD — ठहरने की जगहें, सफ़र और स्थानीय गाइड' },
	nav: { all: 'सभी', stays: 'ठहरने की जगह', ride: 'आना-जाना', guides: 'गाइड', explore: 'श्रेणियाँ देखें', host: 'अपनी जगह सूचीबद्ध करें', language: 'भाषा चुनें', account: 'साइन अप करें या अपना अकाउंट खोलें', themeLight: 'लाइट थीम चुनें', themeDark: 'डार्क थीम चुनें' },
	common: { previous: 'पिछला', next: 'अगला' },
	search: { where: 'कहाँ जाना है?', when: 'कब?', who: 'कौन जाएगा?', destinations: 'जगह खोजें', addDates: 'तारीखें जोड़ें', addGuests: 'मेहमान जोड़ें', anywhere: 'कहीं भी', search: 'खोजें', searchStays: 'ठहरने की जगह खोजें', current: 'मौजूदा खोज', close: 'खोज बंद करें', popular: 'लोकप्रिय जगहें', today: 'आज', tomorrow: 'कल', weekend: 'इस सप्ताहांत', oneNight: 'एक रात', twoNights: 'दो रातें', previousMonth: 'पिछला महीना', nextMonth: 'अगला महीना', pickCheckIn: 'चेक-इन की तारीख चुनें', pickCheckOut: 'चेक-आउट की तारीख चुनें', coming: 'कौन आ रहा है?', adults: 'वयस्क', adultAge: '13 वर्ष या उससे अधिक', children: 'बच्चे', childrenAge: '2–12 वर्ष', infants: 'शिशु', infantAge: '2 वर्ष से कम', removeAdult: 'एक वयस्क हटाएँ', addAdult: 'एक वयस्क जोड़ें', removeChild: 'एक बच्चा हटाएँ', addChild: 'एक बच्चा जोड़ें', removeInfant: 'एक शिशु हटाएँ', addInfant: 'एक शिशु जोड़ें', guest_one: '{{count}} मेहमान', guest_other: '{{count}} मेहमान' },
	stays: { eyebrow: 'बुकिंग और किराये के लिए गेस्टहाउस', popular: 'मेहमानों की पसंदीदा जगहें', description: 'रात के हिसाब से बुक करें या पूरे मौसम के लिए किराये पर लें। हमारी टीम हर गेस्टहाउस की जाँच करती है।', viewAll: 'सभी देखें', noMatch: 'इस जगह पर ठहरने की जगह नहीं मिली। कोई दूसरी जगह आज़माएँ।', inLocation: '{{destination}} में ठहरने की जगहें', night: 'रात' },
	homes: { kerala: 'केरल में विला', calangute: 'कलंगुट में फ्लैट', wayanad: 'वायनाड में कमरा', bali: 'बाली में विला', poolGoa: 'गोवा में पूल हाउस', resortGoa: 'रिसॉर्ट सुइट' },
	services: { heading: 'सफ़र और ठहरना, एक ही बुकिंग में', rideTitle: 'आना-जाना सेवा', rideDescription: 'हवाई अड्डे, स्टेशन या घर के दरवाज़े से। ड्राइवर बुक करें और सफ़र ट्रैक करें।', assistantTitle: 'यात्रा सहायक', assistantDescription: 'स्थानीय सहायक बुकिंग, टिकट और अनुवाद में मदद करते हैं।', guideTitle: 'यात्रा गाइड', guideDescription: 'लाइसेंस प्राप्त गाइड जो हर जगह की कहानियाँ जानते हैं।' },
	people: { assistants: 'यात्रा सहायक', guides: 'यात्रा गाइड', assistantRole: 'यात्रा सहायक', guideRole: 'यात्रा गाइड', fromDay: '₹30 / दिन से', book: 'बुक करें', all: 'सभी', female: 'महिला', male: 'पुरुष' },
	inside: { step: 'चरण', title: 'ठहरने का अनुभव', view: 'ठहरने की जगहें देखें' },
	payments: { title: 'अपनी पसंद से भुगतान करें', description: 'डिफ़ॉल्ट भुगतान तरीका चुनें। चेकआउट पर इसे बदल सकते हैं।', card: 'कार्ड', cardDescription: 'Visa, Mastercard, RuPay', upi: 'UPI', upiDescription: 'किसी भी UPI ऐप से भुगतान करें', netBanking: 'नेट बैंकिंग', netBankingDescription: 'सीधा बैंक ट्रांसफ़र', wallets: 'वॉलेट', walletsDescription: 'Apple Pay, Google Pay', arrival: 'पहुँचकर भुगतान', arrivalDescription: 'मेज़बान या ड्राइवर को नकद दें' },
	join: { title: 'अपना अकाउंट बनाएँ', description: 'उस ऐप से जुड़ें जिसका आप पहले से इस्तेमाल करते हैं।', email: 'या अपना ईमेल इस्तेमाल करें', continue: 'जारी रखें', emailLabel: 'ईमेल' },
	closing: { tag: 'ऐसी जगहें खोजें जहाँ जाना यादगार हो', title: 'आपका अगला ठहराव आपका इंतज़ार कर रहा है', explore: 'ठहरने की जगहें देखें' },
	footer: { explore: 'देखें', guesthouses: 'गेस्टहाउस', pickDrop: 'आना-जाना', guides: 'गाइड', support: 'सहायता', help: 'सहायता केंद्र', contact: 'संपर्क करें', legal: 'कानूनी जानकारी', terms: 'नियम', privacy: 'गोपनीयता', newsletter: 'ईमेल दर्ज करें', subscribe: 'सब्सक्राइब करें' },
};

export const resources = {
	en: { translation: english },
	bn: { translation: bangla },
	zh: { translation: chinese },
	ru: { translation: russian },
	it: { translation: italian },
	fr: { translation: french },
	hi: { translation: hindi },
};