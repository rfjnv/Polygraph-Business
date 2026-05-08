import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import heroMark from '../new-mini-logo.png'
import brandGeometry from '../image.png'
import foilAssortmentImage from '../photos/1.png'
import consumablesImage from '../photos/6.png'
import heroSceneImage from '../photos/8.png'
import glossFoilImage from '../photos/12.png'
import paperRollImage from '../photos/14.png'
import matteFilmImage from '../photos/16.png'
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  Globe,
  Layers3,
  Mail,
  MessageSquareText,
  Moon,
  Phone,
  Printer,
  ShieldCheck,
  Sparkles,
  Sun,
  Truck,
  type LucideIcon,
} from 'lucide-react'

type Locale = 'ru' | 'uz' | 'en'
type Theme = 'dark' | 'light'

type Feature = {
  icon: LucideIcon
  title: string
  text: string
}

type Product = {
  eyebrow: string
  title: string
  description: string
  points: string[]
}

type Dictionary = {
  meta: {
    title: string
    description: string
  }
  nav: {
    products: string
    advantages: string
    trust: string
    contact: string
    cta: string
  }
  hero: {
    badge: string
    title: string[]
    subtitle: string
    primaryCta: string
    secondaryCta: string
    highlights: [string, string][]
    statusLabel: string
    statusTitle: string
    statusChip: string
    solutionTitle: string
    solutionItems: [string, string][]
    launchLabel: string
    launchValue: string
    launchText: string
    supplyTitle: string
    supplyItems: string[]
  }
  section: {
    advantages: { label: string; title: string; description: string }
    products: { label: string; title: string; description: string }
    trust: { label: string; title: string; description: string }
    cta: { label: string; title: string; description: string }
  }
  features: Feature[]
  products: Product[]
  metrics: { value: string; label: string }[]
  trustPoints: string[]
  fitFor: string[]
  form: {
    title: string
    description: string
    channelsTitle: string
    channelsDescription: string
    tgPending: string
    emailPending: string
    fields: {
      name: string
      company: string
      phone: string
      email: string
      requestType: string
      quantity: string
      details: string
    }
    placeholders: {
      name: string
      company: string
      phone: string
      email: string
      quantity: string
      details: string
    }
    options: string[]
    submit: string
    success: string
    missingConfig: string
    validation: string
    consent: string
  }
  footer: {
    text: string
  }
}

type ContactFormState = {
  name: string
  company: string
  phone: string
  email: string
  requestType: string
  quantity: string
  details: string
}

const supportedLocales: Locale[] = ['ru', 'uz', 'en']

const localeNames: Record<Locale, string> = {
  ru: 'RU',
  uz: 'UZ',
  en: 'EN',
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'dark'
  }

  const saved = window.localStorage.getItem('forma-print-theme')
  if (saved === 'dark' || saved === 'light') {
    return saved
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

const dictionaries: Record<Locale, Dictionary> = {
  ru: {
    meta: {
      title: 'Polygraph Business — Материалы и расходники для полиграфии',
      description:
        'Polygraph Business поставляет материалы, ламинацию, фольгу, краски, химию и расходные материалы для типографий и печатных производств в Ташкенте и по рынку Узбекистана.',
    },
    nav: {
      products: 'Каталог',
      advantages: 'Преимущества',
      trust: 'О компании',
      contact: 'Контакты',
      cta: 'Связаться',
    },
    hero: {
      badge: 'Поставщик материалов и расходников для полиграфии в Узбекистане',
      title: ['Polygraph Business', 'поставщик для типографий', 'и упаковки'],
      subtitle:
        'Polygraph Business — B2B-компания из Ташкента, которая поставляет материалы и расходные решения для типографий, упаковочных и печатных производств. Первый экран сайта сразу показывает, кто мы, с каким рынком работаем и какие товарные направления закрываем.',
      primaryCta: 'Связаться с нами',
      secondaryCta: 'Смотреть каталог',
      highlights: [
        [
          'Кто мы',
          'Профильный B2B-поставщик бумаги, пленок, фольги, красок, химии и других материалов для полиграфического производства.',
        ],
        [
          'Где работаем',
          'Базируемся в Ташкенте и работаем по рынку Узбекистана с типографиями, упаковочными и печатными компаниями.',
        ],
        [
          'Что закрываем',
          'Помогаем закупать ключевые позиции через одного профильного поставщика: от бумаги и ламинации до красок и химии.',
        ],
      ],
      statusLabel: 'company profile',
      statusTitle: 'Polygraph Business',
      statusChip: 'B2B supplier',
      solutionTitle: 'Основные направления',
      solutionItems: [
        ['Бумага и основы', 'Самоклеящаяся бумага, мелованная бумага, картон'],
        ['Ламинация и отделка', 'Пленки, soft touch, фольга для горячего тиснения'],
        ['Печатные расходники', 'Краски, офсетная резина, смывки и химия'],
      ],
      launchLabel: 'На рынке',
      launchValue: '2018',
      launchText: 'Работаем с 15 марта 2018 года и фокусируемся на задачах типографий, упаковки и печатного производства.',
      supplyTitle: 'Ключевые категории',
      supplyItems: ['Бумага и картон', 'Ламинация и фольга', 'Краски, химия, расходники'],
    },
    section: {
      advantages: {
        label: 'Преимущества',
        title: 'Почему выбирают Polygraph Business',
        description:
          'Закрываем основные закупочные задачи полиграфического бизнеса: от бумаги и ламинации до офсетной химии и комплектующих для производства.',
      },
      products: {
        label: 'Категории',
        title: 'Основные категории продукции',
        description:
          'Ниже показаны ключевые товарные направления, по которым можно быстро понять профиль компании и структуру поставок.',
      },
      trust: {
        label: 'О компании',
        title: 'Кратко о Polygraph Business',
        description:
          'Polygraph Business — профильный B2B-поставщик материалов и расходников для полиграфии, упаковки и смежных производств в Узбекистане.',
      },
      cta: {
        label: 'Поставка для полиграфии без лишних задержек',
        title: 'Подберем материалы под ваши задачи и производство',
        description:
          'Если вам нужен надежный поставщик для типографии или упаковочного бизнеса, оставьте заявку. Поможем собрать нужные позиции, рассчитать стоимость и предложить удобный формат поставки.',
      },
    },
    features: [
      {
        icon: Printer,
        title: 'Все для полиграфии в одном месте',
        text: 'Можно закупать ключевые материалы и расходники у одного поставщика без распыления по разным компаниям.',
      },
      {
        icon: Layers3,
        title: 'Ассортимент под производство',
        text: 'В наличии и под заказ позиции для печати, постпечатной обработки, отделки и технологического обслуживания.',
      },
      {
        icon: Truck,
        title: 'Удобно для регулярных закупок',
        text: 'Подходит для компаний, которым нужны не разовые покупки, а системное снабжение производства.',
      },
      {
        icon: ShieldCheck,
        title: 'Локальный рынок и быстрая коммуникация',
        text: 'Рабочая модель компании заточена под полиграфический рынок Узбекистана и оперативную работу с бизнес-клиентами.',
      },
    ],
    products: [
      {
        eyebrow: 'Бумага и основы',
        title: 'Бумага, картон и материалы для печати',
        description:
          'Поставки базовых материалов для типографий и печатных производств: от самоклеящейся бумаги до мелованной бумаги и вспомогательных листовых материалов.',
        points: [
          'Самоклеящаяся бумага в разных форматах',
          'Мелованная бумага разной плотности',
          'Калиброванный картон и вспомогательные материалы',
        ],
      },
      {
        eyebrow: 'Ламинация и отделка',
        title: 'Ламинационные пленки и фольга для тиснения',
        description:
          'Материалы для постпечатной обработки и декоративной отделки, которые помогают улучшать внешний вид и износостойкость продукции.',
        points: [
          'Глянцевая и матовая ламинационная пленка',
          'Soft touch, металлизированные пленки, золото и серебро',
          'Фольга для горячего тиснения в разных цветах и форматах',
        ],
      },
      {
        eyebrow: 'Печатные расходники',
        title: 'Краски, офсетная резина и полиграфическая химия',
        description:
          'Расходные материалы для стабильной печати и обслуживания оборудования на производстве.',
        points: [
          'Офсетные и пантонные краски',
          'Офсетная резина в рулонах и с планками',
          'Смывки, добавки к увлажнению, очистители и порошки',
        ],
      },
    ],
    metrics: [
      { value: '2018', label: 'работаем на рынке с 15 марта 2018 года' },
      { value: '10+', label: 'ключевых товарных направлений в ассортименте' },
      { value: 'B2B', label: 'фокус на типографии, упаковку и производственные компании' },
      { value: 'UZ', label: 'работаем из Ташкента по рынку Узбекистана' },
    ],
    trustPoints: [
      'Профиль компании считывается с первого экрана: поставщик материалов для полиграфии и упаковки.',
      'Основные категории продукции собраны так, чтобы иностранец или новый партнер быстро понял специализацию бизнеса.',
      'Коммуникация ориентирована на подбор позиций под задачу, тираж и формат производства.',
    ],
    fitFor: [
      'Типографии',
      'Производства упаковки',
      'Компании по печати этикетки и стикеров',
      'Рекламно-производственные компании',
      'Книжные, журнальные и календарные производства',
      'Отделы снабжения полиграфического бизнеса',
    ],
    form: {
      title: 'Оставьте заявку на подбор материалов',
      description:
        'Напишите, что вам нужно, и мы подберем подходящие позиции, сориентируем по цене, наличию и срокам поставки.',
      channelsTitle: 'Каналы отправки',
      channelsDescription:
        'Форма уже подготовлена под реальную отправку. После получения ваших доступов я подключу Telegram Bot API и email API без редизайна этого блока.',
      tgPending: 'Telegram / WhatsApp: уточняется',
      emailPending: 'Email: уточняется',
      fields: {
        name: 'Имя',
        company: 'Компания',
        phone: 'Телефон',
        email: 'Email',
        requestType: 'Что нужно',
        quantity: 'Объем / количество',
        details: 'Что требуется',
      },
      placeholders: {
        name: 'Как к вам обращаться',
        company: 'Название компании',
        phone: 'Уточняется',
        email: 'Уточняется',
        quantity: 'Например: 20 листов / 5 рулонов / 10 кг',
        details: 'Опишите нужные материалы, объем, формат, плотность, сроки и любые дополнительные пожелания.',
      },
      options: ['Бумага и картон', 'Ламинация и фольга', 'Краски и химия', 'Нужен полный прайс / консультация'],
      submit: 'Отправить заявку',
      success: 'Форма заполнена. После подключения каналов отправка станет live.',
      missingConfig: 'Telegram/email еще не настроены. Интерфейс и структура заявки уже готовы.',
      validation: 'Заполните имя, телефон или email, и кратко опишите, что вам нужно.',
      consent: 'Нажимая кнопку, вы отправляете заявку на подбор продукции и консультацию.',
    },
    footer: {
      text: 'Polygraph Business — материалы, расходники и химия для полиграфического бизнеса.',
    },
  },
  uz: {
    meta: {
      title: 'Polygraph Business — Poligrafiya uchun materiallar va sarf mahsulotlari',
      description:
        'Polygraph Business Toshkent va O‘zbekiston bozori uchun tipografiyalar hamda qadoqlash ishlab chiqarishiga materiallar, laminatsiya, folga, bo‘yoq va kimyo yetkazib beradi.',
    },
    nav: {
      products: 'Katalog',
      advantages: 'Afzalliklar',
      trust: 'Kompaniya haqida',
      contact: 'Kontaktlar',
      cta: 'Bog‘lanish',
    },
    hero: {
      badge: 'O‘zbekistonda poligrafiya uchun materiallar va sarf mahsulotlari yetkazib beruvchisi',
      title: ['Polygraph Business', 'tipografiya uchun yetkazib beruvchi', 'va qadoqlash uchun'],
      subtitle:
        'Polygraph Business — Toshkentdagi B2B kompaniya bo‘lib, tipografiyalar, qadoqlash va bosma ishlab chiqarishlar uchun materiallar hamda sarf yechimlarini yetkazib beradi. Birinchi ekran kompaniya kimligi, qaysi bozorda ishlashi va qaysi yo‘nalishlarni qamrab olishini darhol ko‘rsatadi.',
      primaryCta: 'Biz bilan bog‘laning',
      secondaryCta: 'Katalogni ko‘rish',
      highlights: [
        [
          'Biz kimmiz',
          'Qog‘oz, plyonka, folga, bo‘yoq, kimyo va boshqa poligrafik materiallar bo‘yicha ixtisoslashgan B2B yetkazib beruvchimiz.',
        ],
        [
          'Qayerda ishlaymiz',
          'Toshkentda joylashganmiz va O‘zbekiston bozorida tipografiyalar, qadoqlash hamda bosma kompaniyalar bilan ishlaymiz.',
        ],
        [
          'Nimani yopamiz',
          'Qog‘oz va laminatsiyadan tortib bo‘yoq va kimyogacha bo‘lgan asosiy xarid pozitsiyalarini bitta yetkazib beruvchi orqali yopishga yordam beramiz.',
        ],
      ],
      statusLabel: 'company profile',
      statusTitle: 'Polygraph Business',
      statusChip: 'B2B supplier',
      solutionTitle: 'Asosiy yo‘nalishlar',
      solutionItems: [
        ['Qog‘oz va asoslar', 'O‘z-o‘zidan yopishuvchi qog‘oz, melovan qog‘oz, karton'],
        ['Laminatsiya va bezak', 'Plyonkalar, soft touch, issiq tısma uchun folga'],
        ['Bosma sarflari', 'Bo‘yoqlar, ofset rezina, yuvish va kimyo'],
      ],
      launchLabel: 'Bozorda',
      launchValue: '2018',
      launchText: '2018-yil 15-martdan beri tipografiya, qadoqlash va bosma ishlab chiqarish ehtiyojlariga fokus bilan ishlaymiz.',
      supplyTitle: 'Asosiy kategoriyalar',
      supplyItems: ['Qog‘oz va karton', 'Laminatsiya va folga', 'Bo‘yoqlar, kimyo, sarf mahsulotlari'],
    },
    section: {
      advantages: {
        label: 'Afzalliklar',
        title: 'Nima uchun Polygraph Business tanlanadi',
        description:
          'Poligrafiya biznesining asosiy xarid vazifalarini yopamiz: qog‘oz va laminatsiyadan tortib ofset kimyosi va ishlab chiqarish uchun komponentlargacha.',
      },
      products: {
        label: 'Kategoriyalar',
        title: 'Asosiy mahsulot kategoriyalari',
        description:
          'Quyida kompaniya profili va yetkazib berish tuzilmasini tez tushunishga yordam beradigan asosiy yo‘nalishlar ko‘rsatilgan.',
      },
      trust: {
        label: 'Kompaniya haqida',
        title: 'Polygraph Business haqida qisqacha',
        description:
          'Polygraph Business — O‘zbekistonda poligrafiya, qadoqlash va unga yaqin ishlab chiqarishlar uchun materiallar hamda sarf mahsulotlari yetkazib beruvchi B2B kompaniya.',
      },
      cta: {
        label: 'Poligrafiya uchun yetkazib berish ortiqcha kechikishlarsiz',
        title: 'Ishlab chiqarishingiz uchun mos materiallarni tanlab beramiz',
        description:
          'Agar sizga tipografiya yoki qadoqlash biznesi uchun ishonchli yetkazib beruvchi kerak bo‘lsa, so‘rov qoldiring. Kerakli pozitsiyalarni yig‘ish, narxni hisoblash va qulay yetkazib berish formatini taklif qilamiz.',
      },
    },
    features: [
      {
        icon: Printer,
        title: 'Poligrafiya uchun hammasi bir joyda',
        text: 'Asosiy materiallar va sarf mahsulotlarini turli kompaniyalarga bo‘linmasdan bitta yetkazib beruvchidan xarid qilish mumkin.',
      },
      {
        icon: Layers3,
        title: 'Ishlab chiqarishga mos assortiment',
        text: 'Bosma, post-bosma ishlov, bezak va texnologik xizmat ko‘rsatish uchun mavjud va buyurtma asosidagi pozitsiyalar.',
      },
      {
        icon: Truck,
        title: 'Muntazam xaridlar uchun qulay',
        text: 'Bir martalik xarid emas, balki ishlab chiqarishni tizimli ta’minlash kerak bo‘lgan kompaniyalar uchun mos.',
      },
      {
        icon: ShieldCheck,
        title: 'Mahalliy bozor va tez aloqa',
        text: 'Kompaniya modeli O‘zbekiston poligrafiya bozori va biznes-mijozlar bilan tezkor ishlashga moslashtirilgan.',
      },
    ],
    products: [
      {
        eyebrow: 'Qog‘oz va asoslar',
        title: 'Qog‘oz, karton va bosma uchun materiallar',
        description:
          'Tipografiyalar va bosma ishlab chiqarishlar uchun asosiy materiallar yetkazib beriladi: o‘z-o‘zidan yopishuvchi qog‘ozdan tortib melovan qog‘oz va yordamchi list materiallargacha.',
        points: [
          'Turli formatlarda o‘z-o‘zidan yopishuvchi qog‘oz',
          'Har xil zichlikdagi melovan qog‘oz',
          'Kalibrlangan karton va yordamchi materiallar',
        ],
      },
      {
        eyebrow: 'Laminatsiya va bezak',
        title: 'Laminatsion plyonkalar va tısma uchun folga',
        description:
          'Mahsulotning ko‘rinishi va chidamliligini yaxshilaydigan post-bosma ishlov va dekorativ bezak materiallari.',
        points: [
          'Yaltiroq va mat laminatsion plyonka',
          'Soft touch, metallangan plyonkalar, oltin va kumush',
          'Turli rang va formatlarda issiq tısma uchun folga',
        ],
      },
      {
        eyebrow: 'Bosma sarflari',
        title: 'Bo‘yoqlar, ofset rezina va poligrafik kimyo',
        description:
          'Barqaror bosma va uskunani xizmat ko‘rsatish uchun ishlab chiqarishdagi sarf materiallari.',
        points: [
          'Ofset va panton bo‘yoqlar',
          'Rulon va planqali ofset rezina',
          'Yuvish vositalari, namlash qo‘shimchalari, tozalagichlar va kukunlar',
        ],
      },
    ],
    metrics: [
      { value: '2018', label: '2018-yil 15-martdan beri bozorda' },
      { value: '10+', label: 'assortimentdagi asosiy yo‘nalishlar' },
      { value: 'B2B', label: 'tipografiya, qadoqlash va ishlab chiqarish kompaniyalariga fokus' },
      { value: 'UZ', label: 'Toshkentdan turib O‘zbekiston bozorida ishlaymiz' },
    ],
    trustPoints: [
      'Kompaniya profili birinchi ekrandanoq tushunarli: poligrafiya va qadoqlash uchun materiallar yetkazib beruvchisi.',
      'Mahsulot kategoriyalari xorijiy hamkor yoki yangi mijozga biznes yo‘nalishini tez anglashga yordam beradi.',
      'Muloqot usuli vazifa, tiraj va ishlab chiqarish formatiga mos pozitsiyalarni tanlashga qaratilgan.',
    ],
    fitFor: [
      'Tipografiyalar',
      'Qadoqlash ishlab chiqarishlari',
      'Etiketka va stiker bosadigan kompaniyalar',
      'Reklama ishlab chiqarish kompaniyalari',
      'Kitob, jurnal va kalendar ishlab chiqarishlari',
      'Poligrafiya biznesi ta’minot bo‘limlari',
    ],
    form: {
      title: 'Material tanlash uchun so‘rov qoldiring',
      description:
        'Nima kerakligini yozing, biz mos pozitsiyalarni tanlaymiz va narx, mavjudlik hamda yetkazib berish muddati bo‘yicha yo‘nalish beramiz.',
      channelsTitle: 'Yuborish kanallari',
      channelsDescription:
        'Forma real yuborish uchun tayyor. Keyinroq sizning Telegram Bot API va email API ma’lumotlaringiz bilan shu blokka integratsiya qilinadi.',
      tgPending: 'Telegram / WhatsApp: aniqlanadi',
      emailPending: 'Email: aniqlanadi',
      fields: {
        name: 'Ism',
        company: 'Kompaniya',
        phone: 'Telefon',
        email: 'Email',
        requestType: 'Nima kerak',
        quantity: 'Hajm / miqdor',
        details: 'Talab tafsilotlari',
      },
      placeholders: {
        name: 'Sizga qanday murojaat qilaylik',
        company: 'Kompaniya nomi',
        phone: 'Aniqlanadi',
        email: 'Aniqlanadi',
        quantity: 'Masalan: 20 varaq / 5 rulon / 10 kg',
        details: 'Kerakli materiallar, hajm, format, zichlik, muddat va qo‘shimcha istaklarni yozing.',
      },
      options: ['Qog‘oz va karton', 'Laminatsiya va folga', 'Bo‘yoqlar va kimyo', 'To‘liq prays / konsultatsiya kerak'],
      submit: 'So‘rov yuborish',
      success: 'Forma tayyor. Kanallar ulangach yuborish live bo‘ladi.',
      missingConfig: 'Telegram/email hali sozlanmagan. Interfeys va so‘rov strukturasi tayyor.',
      validation: 'Ismni, telefon yoki emailni va qisqacha ehtiyojingizni kiriting.',
      consent: 'Tugmani bosish orqali mahsulot tanlash va konsultatsiya uchun so‘rov yuborasiz.',
    },
    footer: {
      text: 'Polygraph Business — poligrafiya biznesi uchun materiallar, sarf mahsulotlari va kimyo.',
    },
  },
  en: {
    meta: {
      title: 'Polygraph Business — Materials and consumables for print production',
      description:
        'Polygraph Business supplies print materials, lamination films, foils, inks, chemistry, and consumables for printing houses and packaging production in Tashkent, Uzbekistan.',
    },
    nav: {
      products: 'Catalog',
      advantages: 'Advantages',
      trust: 'About company',
      contact: 'Contact',
      cta: 'Contact us',
    },
    hero: {
      badge: 'Supplier of print materials and consumables in Uzbekistan',
      title: ['Polygraph Business', 'supplier for printing houses', 'and packaging'],
      subtitle:
        'Polygraph Business is a B2B company based in Tashkent, supplying materials and production consumables for printing houses, packaging plants, and print manufacturers. The hero section now works as a concise company profile, showing who we are, where we operate, and what product directions we cover.',
      primaryCta: 'Contact us',
      secondaryCta: 'View catalog',
      highlights: [
        [
          'Who we are',
          'A focused B2B supplier of paper, films, foils, inks, chemistry, and other materials used in print production.',
        ],
        [
          'Where we work',
          'Based in Tashkent and serving the Uzbekistan market for printing, packaging, and related manufacturing companies.',
        ],
        [
          'What we cover',
          'We help clients source key procurement categories through one specialized supplier, from paper and lamination to inks and chemistry.',
        ],
      ],
      statusLabel: 'company profile',
      statusTitle: 'Polygraph Business',
      statusChip: 'B2B supplier',
      solutionTitle: 'Core directions',
      solutionItems: [
        ['Paper and base stock', 'Self-adhesive paper, coated paper, carton'],
        ['Lamination and finishing', 'Films, soft touch, hot stamping foil'],
        ['Print consumables', 'Inks, offset rubber, washes and chemistry'],
      ],
      launchLabel: 'On the market',
      launchValue: '2018',
      launchText: 'Operating since March 15, 2018 with a focus on printing houses, packaging, and print production needs.',
      supplyTitle: 'Key categories',
      supplyItems: ['Paper and carton', 'Lamination and foil', 'Inks, chemistry, consumables'],
    },
    section: {
      advantages: {
        label: 'Advantages',
        title: 'Why companies choose Polygraph Business',
        description:
          'We cover the core procurement needs of print businesses: from paper and lamination to offset chemistry and production consumables.',
      },
      products: {
        label: 'Categories',
        title: 'Main product categories',
        description:
          'These directions help a new visitor quickly understand the company profile and the main structure of the supply offering.',
      },
      trust: {
        label: 'About company',
        title: 'Polygraph Business at a glance',
        description:
          'Polygraph Business is a focused B2B supplier of materials and consumables for print, packaging, and related production businesses in Uzbekistan.',
      },
      cta: {
        label: 'Supply for print production without unnecessary delays',
        title: 'We will match materials to your production needs',
        description:
          'If you need a reliable supplier for a printing house or packaging business, leave a request. We will help collect the right items, estimate the cost, and suggest a convenient supply format.',
      },
    },
    features: [
      {
        icon: Printer,
        title: 'Everything for print in one place',
        text: 'Key materials and consumables can be sourced from one supplier without splitting orders across multiple companies.',
      },
      {
        icon: Layers3,
        title: 'Assortment tailored to production',
        text: 'Available and made-to-order positions for printing, post-print processing, finishing, and technical maintenance.',
      },
      {
        icon: Truck,
        title: 'Convenient for recurring procurement',
        text: 'Ideal for companies that need systematic production supply, not one-off purchases.',
      },
      {
        icon: ShieldCheck,
        title: 'Local market and fast communication',
        text: 'The business model is tailored to the Uzbekistan print market and operational work with B2B clients.',
      },
    ],
    products: [
      {
        eyebrow: 'Paper and stock',
        title: 'Paper, carton, and print substrates',
        description:
          'Supply of base materials for printing houses and print manufacturers: from self-adhesive paper to coated paper and auxiliary sheet materials.',
        points: [
          'Self-adhesive paper in multiple formats',
          'Coated paper in different weights',
          'Calibrated carton and auxiliary materials',
        ],
      },
      {
        eyebrow: 'Lamination and finishing',
        title: 'Lamination films and hot stamping foil',
        description:
          'Materials for post-print processing and decorative finishing that improve both visual quality and durability.',
        points: [
          'Gloss and matte lamination film',
          'Soft touch, metallized films, gold and silver finishes',
          'Hot stamping foil in multiple colors and formats',
        ],
      },
      {
        eyebrow: 'Print consumables',
        title: 'Inks, offset rubber, and print chemistry',
        description:
          'Consumables for stable printing and equipment maintenance in production environments.',
        points: [
          'Offset and Pantone inks',
          'Offset rubber in rolls and with bars',
          'Washes, fountain additives, cleaners, and powders',
        ],
      },
    ],
    metrics: [
      { value: '2018', label: 'on the market since March 15, 2018' },
      { value: '10+', label: 'core product directions in the assortment' },
      { value: 'B2B', label: 'focus on printing houses, packaging, and manufacturing companies' },
      { value: 'UZ', label: 'operating from Tashkent across the Uzbekistan market' },
    ],
    trustPoints: [
      'The company profile is clear from the first screen: a supplier for print and packaging materials.',
      'Product categories are arranged so an international visitor or new partner can quickly understand the business specialization.',
      'Communication is built around matching positions to the task, run size, and production format.',
    ],
    fitFor: [
      'Printing houses',
      'Packaging manufacturers',
      'Label and sticker printing companies',
      'Advertising production companies',
      'Book, magazine, and calendar production',
      'Procurement teams in print businesses',
    ],
    form: {
      title: 'Leave a request for materials',
      description:
        'Tell us what you need and we will match suitable positions and guide you on price, availability, and delivery lead time.',
      channelsTitle: 'Delivery channels',
      channelsDescription:
        'The form is ready for real submission. Once credentials are provided, I can connect Telegram Bot API and email API without redesigning this block.',
      tgPending: 'Telegram / WhatsApp: to be confirmed',
      emailPending: 'Email: to be confirmed',
      fields: {
        name: 'Name',
        company: 'Company',
        phone: 'Phone',
        email: 'Email',
        requestType: 'What do you need',
        quantity: 'Volume / quantity',
        details: 'Request details',
      },
      placeholders: {
        name: 'How should we address you',
        company: 'Company name',
        phone: 'To be confirmed',
        email: 'To be confirmed',
        quantity: 'For example: 20 sheets / 5 rolls / 10 kg',
        details: 'Describe the required materials, quantity, format, gsm, deadline, and any extra notes.',
      },
      options: ['Paper and carton', 'Lamination and foil', 'Inks and chemistry', 'Need full price list / consultation'],
      submit: 'Send request',
      success: 'The form is ready. Once channels are connected, submission will go live.',
      missingConfig: 'Telegram/email is not configured yet. The UI and request structure are ready.',
      validation: 'Please provide your name, phone or email, and a short description of what you need.',
      consent: 'By clicking the button, you send a request for product подбор and consultation.',
    },
    footer: {
      text: 'Polygraph Business — materials, consumables, and chemistry for the print business.',
    },
  },
}

const initialFormState: ContactFormState = {
  name: '',
  company: '',
  phone: '',
  email: '',
  requestType: 'Печать',
  quantity: '',
  details: '',
}

const productVisuals = [
  {
    image: paperRollImage,
    tone: 'warm',
    caption: { ru: 'Рулонная и листовая база', uz: 'Rulon va list asoslari', en: 'Roll and sheet base stock' },
  },
  {
    image: foilAssortmentImage,
    tone: 'gold',
    caption: { ru: 'Фольга и декоративная отделка', uz: 'Folga va dekorativ bezak', en: 'Foil and decorative finishing' },
  },
  {
    image: consumablesImage,
    tone: 'cool',
    caption: { ru: 'Пленки, химия и расходники', uz: 'Plyonkalar, kimyo va sarflar', en: 'Films, chemistry, consumables' },
  },
] satisfies Array<{
  image: string
  tone: 'warm' | 'gold' | 'cool'
  caption: Record<Locale, string>
}>

const telegramConfigured = Boolean(import.meta.env.VITE_TELEGRAM_BOT_TOKEN && import.meta.env.VITE_TELEGRAM_CHAT_ID)
const emailConfigured = Boolean(import.meta.env.VITE_EMAIL_ENDPOINT || import.meta.env.VITE_EMAILJS_SERVICE_ID)

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'ru'
  }

  const saved = window.localStorage.getItem('forma-print-locale')
  if (saved && supportedLocales.includes(saved as Locale)) {
    return saved as Locale
  }

  const browserLocale = window.navigator.language.slice(0, 2).toLowerCase()
  if (supportedLocales.includes(browserLocale as Locale)) {
    return browserLocale as Locale
  }

  return 'ru'
}

function SectionHeading({
  label,
  title,
  description,
}: {
  label: string
  title: string
  description: string
}) {
  return (
    <div className="max-w-2xl space-y-4">
      <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-accent">
        <Sparkles className="h-3.5 w-3.5" />
        <span className="break-words">{label}</span>
      </div>
      <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl md:text-5xl">
        {title}
      </h2>
      <p className="text-base leading-7 text-muted sm:text-lg">{description}</p>
    </div>
  )
}

function MotionSection({
  children,
  className,
  delay = 0,
  id,
}: {
  children: ReactNode
  className?: string
  delay?: number
  id?: string
}) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return (
      <section id={id} className={className}>
        {children}
      </section>
    )
  }

  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  )
}

async function submitRequest(_: ContactFormState) {
  if (!telegramConfigured && !emailConfigured) {
    throw new Error('MISSING_CONFIG')
  }

  return Promise.resolve()
}

export default function App() {
  const [locale, setLocale] = useState<Locale>(getInitialLocale)
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
  const [formState, setFormState] = useState<ContactFormState>(initialFormState)
  const [submitMessage, setSubmitMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCursorGlowVisible, setIsCursorGlowVisible] = useState(false)
  const content = useMemo(() => dictionaries[locale], [locale])
  const reduceMotion = useReducedMotion()
  const cursorX = useMotionValue(-320)
  const cursorY = useMotionValue(-320)
  const smoothCursorX = useSpring(cursorX, { stiffness: 140, damping: 24, mass: 0.45 })
  const smoothCursorY = useSpring(cursorY, { stiffness: 140, damping: 24, mass: 0.45 })
  const headerSubtitle =
    locale === 'ru'
      ? 'Материалы, ламинация, фольга, краски и расходные материалы'
      : locale === 'uz'
        ? 'Materiallar, laminatsiya, folga, bo‘yoqlar va sarf mahsulotlari'
        : 'Materials, lamination, foils, inks, and consumables'
  const emailLabel = locale === 'ru' ? 'Email: уточняется' : locale === 'uz' ? 'Email: aniqlanadi' : 'Email: to be confirmed'
  const phoneLabel =
    locale === 'ru' ? 'Телефон: уточняется' : locale === 'uz' ? 'Telefon: aniqlanadi' : 'Phone: to be confirmed'

  useEffect(() => {
    window.localStorage.setItem('forma-print-locale', locale)
    document.documentElement.lang = locale
    document.title = content.meta.title

    const descriptionTag = document.querySelector('meta[name="description"]')
    if (descriptionTag) {
      descriptionTag.setAttribute('content', content.meta.description)
    }
  }, [content.meta.description, content.meta.title, locale])

  useEffect(() => {
    window.localStorage.setItem('forma-print-theme', theme)
    document.documentElement.dataset.theme = theme

    const themeColorTag = document.querySelector('meta[name="theme-color"]')
    if (themeColorTag) {
      themeColorTag.setAttribute('content', theme === 'light' ? '#f5f7fb' : '#06080d')
    }
  }, [theme])

  useEffect(() => {
    setFormState((current) => ({
      ...current,
      requestType: content.form.options[0],
    }))
  }, [content.form.options])

  useEffect(() => {
    if (reduceMotion || typeof window === 'undefined') {
      setIsCursorGlowVisible(false)
      return
    }

    const finePointerQuery = window.matchMedia('(pointer: fine)')
    if (!finePointerQuery.matches) {
      setIsCursorGlowVisible(false)
      return
    }

    const glowSize = 320

    const handlePointerMove = (event: PointerEvent) => {
      cursorX.set(event.clientX - glowSize / 2)
      cursorY.set(event.clientY - glowSize / 2)
      setIsCursorGlowVisible(true)
    }

    const handlePointerLeave = () => {
      setIsCursorGlowVisible(false)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerleave', handlePointerLeave)
    window.addEventListener('blur', handlePointerLeave)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
      window.removeEventListener('blur', handlePointerLeave)
    }
  }, [cursorX, cursorY, reduceMotion])

  useEffect(() => {
    if (!isLanguageMenuOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null
      if (!target?.closest('[data-language-menu]')) {
        setIsLanguageMenuOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLanguageMenuOpen(false)
      }
    }

    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isLanguageMenuOpen])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const isMissingRequired =
      !formState.name.trim() ||
      !(formState.phone.trim() || formState.email.trim()) ||
      !formState.details.trim()

    if (isMissingRequired) {
      setSubmitMessage(content.form.validation)
      return
    }

    setIsSubmitting(true)

    try {
      await submitRequest(formState)
      setSubmitMessage(content.form.success)
    } catch (error) {
      if (error instanceof Error && error.message === 'MISSING_CONFIG') {
        setSubmitMessage(content.form.missingConfig)
      } else {
        setSubmitMessage(content.form.missingConfig)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="cursor-glow"
        style={{ x: smoothCursorX, y: smoothCursorY }}
        initial={false}
        animate={{
          opacity: isCursorGlowVisible ? 1 : 0,
          scale: isCursorGlowVisible ? 1 : 0.86,
        }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="hero-orb left-[-12rem] top-[-10rem] h-[22rem] w-[22rem] bg-accent/25"
        animate={reduceMotion ? undefined : { y: [0, -10, 0], rotate: [0, 1.2, 0] }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 9, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }
        }
      />
      <motion.div
        className="hero-orb bottom-[12rem] right-[-10rem] h-[18rem] w-[18rem] bg-[#ff7a18]/16"
        animate={reduceMotion ? undefined : { y: [0, 18, 0], x: [0, -12, 0] }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 11, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }
        }
      />

      <div className="container-shell relative z-10">
        <header className="pt-5 sm:pt-6">
          <motion.div
            className="glass-panel flex flex-wrap items-start justify-between gap-3 rounded-[1.75rem] px-4 py-3 sm:items-center sm:gap-4 sm:px-5"
            initial={reduceMotion ? undefined : { opacity: 0, y: -16 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={reduceMotion ? undefined : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <a href="#" className="min-w-0 flex-1 sm:flex-none flex items-center gap-3">
              <div className="logo-badge">
                <img
                  src="/logo-for-applications.png"
                  alt="Polygraph Business logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <div className="text-sm font-semibold tracking-[0.18em] text-white">POLYGRAPH BUSINESS</div>
                <div className="text-xs text-muted">{headerSubtitle}</div>
              </div>
            </a>

            <nav className="hidden flex-1 items-center justify-center gap-6 text-[0.92rem] text-muted md:flex xl:gap-8">
              <a className="whitespace-nowrap transition-colors hover:text-white" href="#products">
                {content.nav.products}
              </a>
              <a className="whitespace-nowrap transition-colors hover:text-white" href="#trust">
                {content.nav.trust}
              </a>
              <a className="whitespace-nowrap transition-colors hover:text-white" href="#cta">
                {content.nav.contact}
              </a>
            </nav>

            <div className="header-controls ml-auto">
              <button
                type="button"
                onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
                className="theme-toggle"
                aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                title={theme === 'dark' ? 'Light theme' : 'Dark theme'}
              >
                <motion.span
                  key={theme}
                  initial={{ opacity: 0, rotate: -70, scale: 0.74 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
                  className="theme-toggle-icon"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-4 w-4 text-accent" />
                  ) : (
                    <Moon className="h-4 w-4 text-accent" />
                  )}
                </motion.span>
              </button>

              <div className="language-dropdown" data-language-menu>
                <button
                  type="button"
                  className="language-switch"
                  aria-haspopup="menu"
                  aria-expanded={isLanguageMenuOpen}
                  aria-label="Change language"
                  onClick={() => setIsLanguageMenuOpen((current) => !current)}
                >
                  <Globe className="h-4 w-4 text-accent" />
                  <span className="language-current">{localeNames[locale]}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted transition-transform duration-300 ${isLanguageMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isLanguageMenuOpen ? (
                  <div className="language-menu" role="menu">
                    {supportedLocales.map((item) => (
                      <button
                        key={item}
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setLocale(item)
                          setIsLanguageMenuOpen(false)
                        }}
                        className={item === locale ? 'language-menu-item language-menu-item-active' : 'language-menu-item'}
                      >
                        {localeNames[item]}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <a
                href="#cta"
                className="header-cta"
              >
                {content.nav.cta}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </header>

        <main className="pb-10">
          <MotionSection className="section-space grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
            <div className="max-w-3xl">
              <motion.div
                className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-white/82"
                initial={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={reduceMotion ? undefined : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <BadgeCheck className="h-3.5 w-3.5 text-accent" />
                <span className="break-words">{content.hero.badge}</span>
              </motion.div>

              <h1 className="mt-6 text-[2.9rem] font-semibold leading-[0.94] tracking-[-0.055em] text-white min-[360px]:text-5xl sm:text-6xl md:text-7xl">
                {content.hero.title[0]}
                <br />
                {content.hero.title[1]}
                <br />
                <span className="text-white/72">{content.hero.title[2]}</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg">{content.hero.subtitle}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#cta" className="primary-button">
                  {content.hero.primaryCta}
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#products" className="secondary-button">
                  {content.hero.secondaryCta}
                </a>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {content.hero.highlights.map(([title, text], index) => (
                  <motion.div
                    key={title}
                    className="glass-panel rounded-3xl px-5 py-5 hover-lift"
                    initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={
                      reduceMotion
                        ? undefined
                        : { duration: 0.55, delay: 0.08 * index, ease: [0.22, 1, 0.36, 1] }
                    }
                  >
                    <div className="text-sm font-medium text-white">{title}</div>
                    <div className="mt-2 text-sm leading-6 text-muted">{text}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              className="relative"
              initial={reduceMotion ? undefined : { opacity: 0, scale: 0.98, y: 22 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.22 }}
              transition={reduceMotion ? undefined : { duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="hero-showcase relative overflow-hidden rounded-[2rem] p-4 sm:p-5">
                <div className="hero-stage">
                  <div className="hero-stage-top">
                    <div className="flex items-center gap-3">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/12 bg-white/8 p-2">
                        <img src={heroMark} alt="Polygraph Business logo" className="h-full w-full object-contain" />
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-[0.22em] text-muted">{content.hero.statusLabel}</div>
                        <div className="mt-1 text-base font-semibold text-white">{content.hero.statusTitle}</div>
                      </div>
                    </div>
                    <div className="rounded-full border border-accent/25 bg-accent/15 px-3 py-1 text-sm text-accent">
                      {content.hero.statusChip}
                    </div>
                  </div>

                  <div className="hero-material-scene">
                    <img
                      src={heroSceneImage}
                      alt="Premium lamination film roll on a dark industrial surface"
                      className="hero-material-photo"
                    />
                    <div className="hero-material-overlay" />
                    <div className="floating-sample sample-paper">
                      <span>{locale === 'ru' ? 'Мелованная бумага' : locale === 'uz' ? 'Melovan qog‘oz' : 'Coated paper'}</span>
                    </div>
                    <div className="floating-sample sample-carton">
                      <span>{locale === 'ru' ? 'Картон 300 gsm' : locale === 'uz' ? 'Karton 300 gsm' : 'Carton 300 gsm'}</span>
                    </div>
                    <div className="floating-sample sample-foil">
                      <span>{locale === 'ru' ? 'Hot foil' : locale === 'uz' ? 'Hot foil' : 'Hot foil'}</span>
                    </div>
                  </div>

                  <div className="hero-stage-grid">
                    <div className="material-stack-card">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm text-muted">{content.hero.solutionTitle}</span>
                        <Printer className="h-5 w-5 text-accent" />
                      </div>
                      <div className="mt-5 space-y-3">
                        {content.hero.solutionItems.map(([title, text]) => (
                          <div key={title} className="supply-row">
                            <div className="text-sm font-medium text-white">{title}</div>
                            <div className="mt-1 text-xs leading-5 text-muted">{text}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="procurement-card">
                      <div className="text-xs uppercase tracking-[0.22em] text-muted">{content.hero.launchLabel}</div>
                      <div className="mt-3 text-5xl font-semibold tracking-[-0.06em] text-white">
                        {content.hero.launchValue}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted">{content.hero.launchText}</p>
                      <div className="mt-5 space-y-2">
                        {content.hero.supplyItems.map((item) => (
                          <div key={item} className="flex items-center gap-2 text-sm text-white/84">
                            <Check className="h-4 w-4 text-accent" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </MotionSection>

          <MotionSection id="products" className="section-space border-t border-white/8" delay={0.08}>
            <SectionHeading
              label={content.section.products.label}
              title={content.section.products.title}
              description={content.section.products.description}
            />

            <div className="material-showcase mt-10">
              <div className="relative overflow-hidden rounded-[2rem]">
                <img
                  src={paperRollImage}
                  alt="White paper roll and print substrate sample"
                  className="h-full min-h-[360px] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/82 via-black/38 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/72 to-transparent" />
                <div className="absolute left-5 top-5 max-w-md rounded-[1.5rem] border border-white/12 bg-black/38 p-5 backdrop-blur-md sm:left-7 sm:top-7 sm:p-6">
                  <div className="text-xs uppercase tracking-[0.24em] text-accent">
                    {locale === 'ru' ? 'Материалы в работе' : locale === 'uz' ? 'Ishdagi materiallar' : 'Materials in production'}
                  </div>
                  <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
                    {locale === 'ru'
                      ? 'От основы до готовой упаковки'
                      : locale === 'uz'
                        ? 'Asosdan tayyor qadoqqacha'
                        : 'From base stock to finished packaging'}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-white/75">
                    {locale === 'ru'
                      ? 'Подбор бумаги, картона, пленок и расходников под тираж, плотность, отделку и сроки поставки.'
                      : locale === 'uz'
                        ? 'Qog‘oz, karton, plyonka va sarflarni tiraj, zichlik, bezak va muddatlarga mos tanlash.'
                        : 'Paper, carton, films, and consumables matched to run size, gsm, finishing, and lead time.'}
                  </p>
                </div>
                <div className="showcase-samples" aria-hidden="true">
                  <div className="sample-sheet sample-sheet-white" />
                  <div className="sample-sheet sample-sheet-blue" />
                  <div className="sample-sheet sample-sheet-kraft" />
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              {content.products.map((product, index) => (
                <motion.article
                  key={product.title}
                  className={`product-card product-card-${productVisuals[index].tone} group overflow-hidden rounded-[2rem] p-5 sm:p-6`}
                  style={{
                    background:
                      index === 1
                        ? 'linear-gradient(180deg, rgba(79,140,255,0.13), rgba(255,255,255,0.04))'
                        : 'linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03))',
                  }}
                  initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={
                    reduceMotion
                      ? undefined
                      : { duration: 0.6, delay: 0.08 * index, ease: [0.22, 1, 0.36, 1] }
                  }
                >
                  <div className="product-visual">
                    <img
                      src={productVisuals[index].image}
                      alt={productVisuals[index].caption[locale]}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="product-visual-shade" />
                    <div className="product-visual-label">{productVisuals[index].caption[locale]}</div>
                  </div>
                  <div className="text-xs font-medium uppercase tracking-[0.22em] text-accent/90">
                    {product.eyebrow}
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white">
                    {product.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-muted">{product.description}</p>

                  <div className="mt-8 space-y-3">
                          {product.points.map((point) => (
                      <div
                        key={point}
                              className="flex items-start gap-3 rounded-2xl border border-white/8 bg-black/16 px-4 py-3 text-sm text-white/86 transition-colors duration-300 group-hover:border-white/12"
                      >
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                              <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </motion.article>
              ))}
            </div>
          </MotionSection>

          <MotionSection className="section-space border-t border-white/8" delay={0.1}>
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <SectionHeading
                label={locale === 'ru' ? 'Матовая и глянцевая отделка' : locale === 'uz' ? 'Mat va yaltiroq qoplama' : 'Matte and gloss finish'}
                title={
                  locale === 'ru'
                    ? 'Материалы должны ощущаться до заявки'
                    : locale === 'uz'
                      ? 'Material buyurtmadan oldin ham sezilishi kerak'
                      : 'Materials should feel tangible before the request'
                }
                description={
                  locale === 'ru'
                    ? 'Отражения, мягкие поверхности и фактура помогают закупщику быстрее понять, какие позиции подходят для упаковки, этикетки и премиальной полиграфии.'
                    : locale === 'uz'
                      ? 'Akslar, yumshoq sirtlar va faktura xaridorga qadoqlash, etiketka va premium poligrafiya uchun mos pozitsiyalarni tezroq tushunishga yordam beradi.'
                      : 'Reflections, soft surfaces, and texture help procurement teams understand which materials fit packaging, label, and premium print work.'
                }
              />

              <div className="finish-comparison">
                <div className="finish-panel finish-panel-matte">
                  <img src={matteFilmImage} alt="Matte lamination surface close-up" />
                  <div className="finish-copy">
                    <div className="text-xs uppercase tracking-[0.22em] text-accent">Matte</div>
                    <h3>{locale === 'ru' ? 'Soft touch и низкий блик' : locale === 'uz' ? 'Soft touch va past aks' : 'Soft touch and low glare'}</h3>
                    <p>
                      {locale === 'ru'
                        ? 'Для премиальной упаковки, каталогов и продукции, где важна спокойная тактильность.'
                        : locale === 'uz'
                          ? 'Sokin taktil sezgi muhim bo‘lgan premium qadoq, katalog va mahsulotlar uchun.'
                          : 'For premium packaging, catalogs, and products where a calm tactile feel matters.'}
                    </p>
                  </div>
                </div>

                <div className="finish-panel finish-panel-gloss">
                  <img src={glossFoilImage} alt="Gloss foil reflection close-up" />
                  <div className="finish-copy">
                    <div className="text-xs uppercase tracking-[0.22em] text-[#ffd88a]">Gloss</div>
                    <h3>{locale === 'ru' ? 'Глубокий блеск и акцент' : locale === 'uz' ? 'Chuqur yaltirash va urg‘u' : 'Deep shine and accent'}</h3>
                    <p>
                      {locale === 'ru'
                        ? 'Для этикетки, декоративной отделки, тиснения и визуально заметных элементов.'
                        : locale === 'uz'
                          ? 'Etiketka, dekorativ bezak, tısma va ko‘zga tashlanadigan elementlar uchun.'
                          : 'For labels, decorative finishing, stamping, and visually prominent details.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </MotionSection>

          <MotionSection id="trust" className="section-space border-t border-white/8" delay={0.12}>
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
              <SectionHeading
                label={content.section.trust.label}
                title={content.section.trust.title}
                description={content.section.trust.description}
              />

              <div className="grid gap-4 md:grid-cols-2">
                {content.metrics.map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    className="glass-panel rounded-[1.75rem] p-6 hover-lift"
                    initial={reduceMotion ? undefined : { opacity: 0, y: 22 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={
                      reduceMotion
                        ? undefined
                        : { duration: 0.55, delay: 0.05 * index, ease: [0.22, 1, 0.36, 1] }
                    }
                  >
                    <div className="text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
                      {metric.value}
                    </div>
                    <div className="mt-3 text-sm leading-6 text-muted">{metric.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="supply-chain-panel mt-10">
              <div className="supply-chain-visual">
                <img src={brandGeometry} alt="Polygraph Business brand geometry" className="brand-geometry" />
                <div className="warehouse-rack rack-left" />
                <div className="warehouse-rack rack-right" />
                <div className="warehouse-floor" />
                <div className="warehouse-pallet pallet-one">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="warehouse-pallet pallet-two">
                  <span />
                  <span />
                </div>
              </div>
              <div className="supply-chain-copy">
                <div className="text-xs uppercase tracking-[0.24em] text-accent">
                  {locale === 'ru' ? 'Закупка и логистика' : locale === 'uz' ? 'Xarid va logistika' : 'Procurement and logistics'}
                </div>
                <h3>
                  {locale === 'ru'
                    ? 'Понятный процесс для отделов снабжения'
                    : locale === 'uz'
                      ? 'Ta’minot bo‘limlari uchun tushunarli jarayon'
                      : 'A clear process for procurement teams'}
                </h3>
                <div className="procurement-steps">
                  {[
                    locale === 'ru' ? 'Заявка по материалам и объемам' : locale === 'uz' ? 'Material va hajm bo‘yicha so‘rov' : 'Request by material and volume',
                    locale === 'ru' ? 'Подбор формата, плотности и отделки' : locale === 'uz' ? 'Format, zichlik va bezak tanlovi' : 'Format, gsm, and finish matching',
                    locale === 'ru' ? 'Уточнение наличия и сроков поставки' : locale === 'uz' ? 'Mavjudlik va muddatlarni aniqlash' : 'Availability and lead-time check',
                  ].map((step, index) => (
                    <div key={step} className="procurement-step">
                      <span>{index + 1}</span>
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="glass-panel rounded-[2rem] p-6 sm:p-7">
                <div className="text-sm uppercase tracking-[0.22em] text-muted">
                  {locale === 'ru' ? 'Что важно знать' : locale === 'uz' ? 'Nimani bilish muhim' : 'What to know'}
                </div>
                <div className="mt-5 space-y-4">
                  {content.trustPoints.map((point) => (
                    <div key={point} className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full border border-accent/20 bg-accent/12 p-1">
                        <Check className="h-3.5 w-3.5 text-accent" />
                      </div>
                      <p className="text-sm leading-7 text-white/86">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel rounded-[2rem] p-6 sm:p-7">
                <div className="text-sm uppercase tracking-[0.22em] text-muted">
                  {locale === 'ru' ? 'С кем работаем' : locale === 'uz' ? 'Kimlar bilan ishlaymiz' : 'Who we work with'}
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  {content.fitFor.map((item) => (
                    <div
                      key={item}
                      className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/84"
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-sm leading-7 text-muted">
                  {locale === 'ru'
                    ? 'Если вам нужен понятный поставщик для полиграфии, упаковки и печатного производства, здесь можно быстро оценить профиль компании и связаться с нами.'
                    : locale === 'uz'
                      ? 'Agar sizga poligrafiya, qadoqlash va bosma ishlab chiqarish uchun tushunarli yetkazib beruvchi kerak bo‘lsa, bu yerda kompaniya profilini tez baholab, biz bilan bog‘lanishingiz mumkin.'
                      : 'If you need a clear supplier profile for print, packaging, and production materials, this page helps you understand the company quickly and get in touch.'}
                </p>
              </div>
            </div>
          </MotionSection>

          <MotionSection id="cta" className="section-space border-t border-white/8" delay={0.15}>
            <div className="grid gap-5 lg:grid-cols-[1fr_0.92fr]">
              <div className="glass-panel rounded-[2rem] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
                <div className="max-w-2xl">
                  <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs uppercase tracking-[0.22em] text-accent">
                    <span className="break-words">{content.section.cta.label}</span>
                  </div>
                  <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl md:text-5xl">
                    {content.section.cta.title}
                  </h2>
                  <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
                    {content.section.cta.description}
                  </p>
                </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <div className="contact-chip">
                    <Mail className="h-4 w-4 text-accent" />
                    <span>{emailLabel}</span>
                  </div>
                  <div className="contact-chip">
                    <Phone className="h-4 w-4 text-accent" />
                    <span>{phoneLabel}</span>
                  </div>
                </div>
              </div>

              <div className="glass-panel rounded-[2rem] p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[2rem] font-semibold tracking-[-0.04em] text-white sm:text-2xl">
                      {content.form.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-muted">{content.form.description}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/6 p-3">
                    <MessageSquareText className="h-5 w-5 text-accent" />
                  </div>
                </div>

                <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="field-shell">
                      <span>{content.form.fields.name}</span>
                      <input
                        value={formState.name}
                        onChange={(event) =>
                          setFormState((current) => ({ ...current, name: event.target.value }))
                        }
                        placeholder={content.form.placeholders.name}
                      />
                    </label>

                    <label className="field-shell">
                      <span>{content.form.fields.company}</span>
                      <input
                        value={formState.company}
                        onChange={(event) =>
                          setFormState((current) => ({ ...current, company: event.target.value }))
                        }
                        placeholder={content.form.placeholders.company}
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="field-shell">
                      <span>{content.form.fields.phone}</span>
                      <input
                        value={formState.phone}
                        onChange={(event) =>
                          setFormState((current) => ({ ...current, phone: event.target.value }))
                        }
                        placeholder={content.form.placeholders.phone}
                      />
                    </label>

                    <label className="field-shell">
                      <span>{content.form.fields.email}</span>
                      <input
                        value={formState.email}
                        onChange={(event) =>
                          setFormState((current) => ({ ...current, email: event.target.value }))
                        }
                        placeholder={content.form.placeholders.email}
                        type="email"
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="field-shell">
                      <span>{content.form.fields.requestType}</span>
                      <select
                        value={formState.requestType}
                        onChange={(event) =>
                          setFormState((current) => ({ ...current, requestType: event.target.value }))
                        }
                      >
                        {content.form.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="field-shell">
                      <span>{content.form.fields.quantity}</span>
                      <input
                        value={formState.quantity}
                        onChange={(event) =>
                          setFormState((current) => ({ ...current, quantity: event.target.value }))
                        }
                        placeholder={content.form.placeholders.quantity}
                      />
                    </label>
                  </div>

                  <label className="field-shell">
                    <span>{content.form.fields.details}</span>
                    <textarea
                      rows={5}
                      value={formState.details}
                      onChange={(event) =>
                        setFormState((current) => ({ ...current, details: event.target.value }))
                      }
                      placeholder={content.form.placeholders.details}
                    />
                  </label>

                  <button type="submit" className="primary-button w-full justify-center sm:w-auto" disabled={isSubmitting}>
                    {isSubmitting ? '...' : content.form.submit}
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <p className="text-sm leading-6 text-muted">{content.form.consent}</p>
                  {submitMessage ? <p className="text-sm leading-6 text-accent">{submitMessage}</p> : null}
                </form>

                <div className="mt-8 rounded-[1.5rem] border border-white/8 bg-black/20 p-5">
                  <div className="text-sm font-medium text-white">{content.form.channelsTitle}</div>
                  <p className="mt-2 text-sm leading-6 text-muted">{content.form.channelsDescription}</p>
                  <div className="mt-4 grid gap-3">
                    <div className="contact-status">
                      <Check className={`h-4 w-4 ${telegramConfigured ? 'text-emerald-400' : 'text-accent'}`} />
                      {telegramConfigured ? 'Telegram connected' : content.form.tgPending}
                    </div>
                    <div className="contact-status">
                      <Check className={`h-4 w-4 ${emailConfigured ? 'text-emerald-400' : 'text-accent'}`} />
                      {emailConfigured ? 'Email connected' : content.form.emailPending}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </MotionSection>
        </main>

        <footer className="footer-panel border-t border-white/8 py-8">
          <div className="grid gap-8 text-sm text-muted lg:grid-cols-[1.1fr_0.9fr_0.75fr]">
            <div>
              <div className="flex items-center gap-3">
                <div className="logo-badge">
                  <img src="/logo-for-applications.png" alt="Polygraph Business logo" className="h-full w-full object-contain" />
                </div>
                <div>
                  <div className="font-semibold tracking-[0.18em] text-white">POLYGRAPH BUSINESS</div>
                  <div className="mt-1 text-xs text-muted">{headerSubtitle}</div>
                </div>
              </div>
              <p className="mt-5 max-w-xl leading-7">{content.footer.text}</p>
              <p className="mt-3 max-w-xl leading-7">
                {locale === 'ru'
                  ? 'Поставка материалов для типографий, упаковочных производств, этикетки и регулярных B2B-закупок.'
                  : locale === 'uz'
                    ? 'Tipografiyalar, qadoqlash ishlab chiqarishlari, etiketka va muntazam B2B xaridlar uchun materiallar yetkazib berish.'
                    : 'Material supply for printing houses, packaging manufacturers, labels, and recurring B2B procurement.'}
              </p>
            </div>

            <div className="footer-business-card">
              <div className="text-xs uppercase tracking-[0.22em] text-accent">
                {locale === 'ru' ? 'Бизнес-профиль' : locale === 'uz' ? 'Biznes profili' : 'Business profile'}
              </div>
              <div className="mt-4 grid gap-3">
                {[
                  locale === 'ru' ? 'Складские и заказные позиции' : locale === 'uz' ? 'Ombordagi va buyurtma pozitsiyalari' : 'Stock and made-to-order positions',
                  locale === 'ru' ? 'Бумага, картон, пленки, фольга' : locale === 'uz' ? 'Qog‘oz, karton, plyonka, folga' : 'Paper, carton, films, foil',
                  locale === 'ru' ? 'Ташкент и рынок Узбекистана' : locale === 'uz' ? 'Toshkent va O‘zbekiston bozori' : 'Tashkent and Uzbekistan market',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-white/84">
                    <Check className="h-4 w-4 text-accent" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-muted">
                {locale === 'ru' ? 'Навигация' : locale === 'uz' ? 'Navigatsiya' : 'Navigation'}
              </div>
              <div className="mt-4 grid gap-3">
                <a className="transition-colors hover:text-white" href="#products">
                  {content.nav.products}
                </a>
                <a className="transition-colors hover:text-white" href="#trust">
                  {content.nav.trust}
                </a>
                <a className="transition-colors hover:text-white" href="#cta">
                  {content.nav.contact}
                </a>
              </div>
              <div className="mt-6 grid gap-2 text-xs">
                <span>{emailLabel}</span>
                <span>{phoneLabel}</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
