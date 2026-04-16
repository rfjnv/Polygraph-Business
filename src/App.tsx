import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
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
  Package,
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

type PriceItem = {
  title: string
  description: string
  price: string
  unit: string
  lead: string
}

type Dictionary = {
  meta: {
    title: string
    description: string
  }
  nav: {
    products: string
    advantages: string
    pricing: string
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
    pricing: { label: string; title: string; description: string }
    trust: { label: string; title: string; description: string }
    cta: { label: string; title: string; description: string }
  }
  features: Feature[]
  products: Product[]
  pricing: {
    note: string
    items: PriceItem[]
  }
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
      pricing: 'Цены',
      trust: 'Почему нам доверяют',
      contact: 'Контакты',
      cta: 'Запросить прайс',
    },
    hero: {
      badge: 'Поставщик материалов и расходников для полиграфии',
      title: ['Материалы', 'и расходники', 'для полиграфии'],
      subtitle:
        'Polygraph Business поставляет материалы и расходники для типографий, упаковочных и печатных производств. Помогаем бизнесу закупать бумагу, пленку, фольгу, краски, химию и сопутствующие позиции в одном месте.',
      primaryCta: 'Запросить прайс',
      secondaryCta: 'Смотреть каталог',
      highlights: [
        [
          'Широкий ассортимент',
          'Бумага, ламинация, фольга, краски, офсетная резина, химия и вспомогательные материалы.',
        ],
        [
          'Фокус на B2B',
          'Работаем для типографий, производств упаковки и компаний, которым важны стабильные поставки.',
        ],
        [
          'Понятные рыночные цены',
          'Ориентируемся на рынок и держим цены в сравнении с ключевыми конкурентами.',
        ],
      ],
      statusLabel: 'supply status',
      statusTitle: 'Материалы для полиграфии',
      statusChip: 'B2B supply',
      solutionTitle: 'Основные категории',
      solutionItems: [
        ['Бумага и основы', 'Самоклеящаяся бумага, мелованная бумага, картон'],
        ['Ламинация и отделка', 'Пленки, soft touch, фольга для горячего тиснения'],
        ['Печатные расходники', 'Краски, офсетная резина, смывки и химия'],
      ],
      launchLabel: 'Регион',
      launchValue: 'Tashkent',
      launchText: 'Работаем по рынку Узбекистана и под задачи типографий, упаковки и печатных производств.',
      supplyTitle: 'Что поставляем',
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
          'Ниже 3 ключевых направления, которые лучше всего отражают профиль компании и подходят для первого экрана каталога или лендинга.',
      },
      pricing: {
        label: 'Цены',
        title: 'Ориентировочные цены',
        description:
          'Ниже примерные стартовые цены по позициям, которые встречаются в сравнительной таблице компании.',
      },
      trust: {
        label: 'Почему нам доверяют',
        title: 'Поставщик с понятной логикой закупки для полиграфического бизнеса',
        description:
          'Компания выглядит как профильный поставщик для полиграфического рынка, где важны ассортимент, стабильность и понятная закупочная логика.',
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
    pricing: {
      note: 'Финальная стоимость зависит от формата, плотности, объема закупки, наличия и сроков поставки.',
      items: [
        {
          title: 'Самоклеящаяся бумага',
          description: 'Листовые позиции для печати и этикетки',
          price: 'от 1 000 сум',
          unit: '/ за лист',
          lead: 'по наличию / уточнить',
        },
        {
          title: 'Ламинационная пленка',
          description: 'Глянцевая или матовая пленка для постпечатной обработки',
          price: 'от 43 000 сум',
          unit: '/ за рулон',
          lead: 'по наличию / уточнить',
        },
        {
          title: 'Фольга для горячего тиснения',
          description: 'Золото, серебро и цветные решения для отделки',
          price: 'от 150 000 сум',
          unit: '/ за рулон',
          lead: 'по наличию / уточнить',
        },
        {
          title: 'Офсетные краски CMYK',
          description: 'Базовые краски для типографского производства',
          price: 'от 82 000 сум',
          unit: '/ за 2,5 кг',
          lead: 'по наличию / уточнить',
        },
      ],
    },
    metrics: [
      { value: '10+', label: 'товарных направлений в ассортименте' },
      { value: '117+', label: 'ценовых позиций в сравнении' },
      { value: '8+', label: 'лет на рынке материалов и расходников для полиграфии' },
      { value: 'B2B', label: 'фокус на типографии и производственные компании' },
    ],
    trustPoints: [
      'Подбор материалов под задачу, тираж и оборудование',
      'Быстрый доступ к ходовым позициям и прозрачным ценам',
      'Один контакт для бумаги, ламинации, красок, химии и расходников',
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
      pricing: 'Narxlar',
      trust: 'Nega bizga ishonishadi',
      contact: 'Kontaktlar',
      cta: 'Prays so‘rash',
    },
    hero: {
      badge: 'Poligrafiya uchun materiallar va sarf mahsulotlari yetkazib beruvchisi',
      title: ['Materiallar', 'va sarf mahsulotlari', 'poligrafiya uchun'],
      subtitle:
        'Polygraph Business tipografiyalar, qadoqlash va bosma ishlab chiqarishlar uchun materiallar hamda sarf mahsulotlarini yetkazib beradi. Biznesga qog‘oz, plyonka, folga, bo‘yoq, kimyo va boshqa pozitsiyalarni bir joydan xarid qilishga yordam beramiz.',
      primaryCta: 'Prays so‘rash',
      secondaryCta: 'Katalogni ko‘rish',
      highlights: [
        [
          'Keng assortiment',
          'Qog‘oz, laminatsiya, folga, bo‘yoqlar, ofset rezina, kimyo va yordamchi materiallar.',
        ],
        [
          'B2B fokus',
          'Tipografiyalar, qadoqlash ishlab chiqarishlari va barqaror ta’minot muhim bo‘lgan kompaniyalar uchun ishlaymiz.',
        ],
        [
          'Tushunarli bozor narxlari',
          'Bozorga tayangan holda asosiy raqobatchilar bilan solishtiriladigan narxlarni ushlab turamiz.',
        ],
      ],
      statusLabel: 'supply status',
      statusTitle: 'Poligrafiya materiallari',
      statusChip: 'B2B supply',
      solutionTitle: 'Asosiy kategoriyalar',
      solutionItems: [
        ['Qog‘oz va asoslar', 'O‘z-o‘zidan yopishuvchi qog‘oz, melovan qog‘oz, karton'],
        ['Laminatsiya va bezak', 'Plyonkalar, soft touch, issiq tısma uchun folga'],
        ['Bosma sarflari', 'Bo‘yoqlar, ofset rezina, yuvish va kimyo'],
      ],
      launchLabel: 'Hudud',
      launchValue: 'Tashkent',
      launchText: 'O‘zbekiston bozori va tipografiya, qadoqlash hamda bosma ishlab chiqarishlar ehtiyojlariga mos ishlaymiz.',
      supplyTitle: 'Nimalarni yetkazamiz',
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
          'Quyida kompaniya profilini eng yaxshi aks ettiradigan va katalog yoki landingning birinchi ekraniga mos 3 ta yo‘nalish berilgan.',
      },
      pricing: {
        label: 'Narxlar',
        title: 'Taxminiy narxlar',
        description:
          'Quyida kompaniyaning solishtirma jadvalida uchraydigan pozitsiyalar bo‘yicha taxminiy boshlang‘ich narxlar keltirilgan.',
      },
      trust: {
        label: 'Nega bizga ishonishadi',
        title: 'Poligrafiya bozori uchun tushunarli xarid mantiqiga ega yetkazib beruvchi',
        description:
          'Kompaniya assortiment, barqarorlik va tushunarli xarid mantig‘i muhim bo‘lgan poligrafiya bozori uchun ixtisoslashgan yetkazib beruvchi sifatida ko‘rinadi.',
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
    pricing: {
      note: 'Yakuniy narx format, zichlik, xarid hajmi, mavjudlik va yetkazib berish muddatiga bog‘liq.',
      items: [
        {
          title: 'O‘z-o‘zidan yopishuvchi qog‘oz',
          description: 'Bosma va etiketka uchun list pozitsiyalar',
          price: '1 000 so‘mdan',
          unit: '/ varaq',
          lead: 'mavjud / aniqlanadi',
        },
        {
          title: 'Laminatsion plyonka',
          description: 'Post-bosma ishlov uchun yaltiroq yoki mat plyonka',
          price: '43 000 so‘mdan',
          unit: '/ rulon',
          lead: 'mavjud / aniqlanadi',
        },
        {
          title: 'Issiq tısma uchun folga',
          description: 'Oltin, kumush va rangli bezak yechimlari',
          price: '150 000 so‘mdan',
          unit: '/ rulon',
          lead: 'mavjud / aniqlanadi',
        },
        {
          title: 'CMYK ofset bo‘yoqlari',
          description: 'Tipografiya ishlab chiqarishi uchun asosiy bo‘yoqlar',
          price: '82 000 so‘mdan',
          unit: '/ 2,5 kg',
          lead: 'mavjud / aniqlanadi',
        },
      ],
    },
    metrics: [
      { value: '10+', label: 'assortimentdagi asosiy yo‘nalishlar' },
      { value: '117+', label: 'taqqoslashdagi narx pozitsiyalari' },
      { value: '8+', label: '2018-yil 15-martdan beri bozorda' },
      { value: 'B2B', label: 'tipografiya va ishlab chiqarish kompaniyalariga fokus' },
    ],
    trustPoints: [
      'Vazifa, tiraj va uskunaga mos materiallarni tanlash',
      'Yuradigan pozitsiyalar va shaffof narxlarga tezkor kirish',
      'Qog‘oz, laminatsiya, bo‘yoq, kimyo va sarflar uchun bitta kontakt',
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
      pricing: 'Pricing',
      trust: 'Why clients trust us',
      contact: 'Contact',
      cta: 'Request price list',
    },
    hero: {
      badge: 'Supplier of materials and consumables for print production',
      title: ['Materials', 'and consumables', 'for print production'],
      subtitle:
        'Polygraph Business supplies materials and consumables for printing houses, packaging plants, and print manufacturers. We help businesses source paper, films, foils, inks, chemistry, and related items in one place.',
      primaryCta: 'Request price list',
      secondaryCta: 'View catalog',
      highlights: [
        [
          'Wide assortment',
          'Paper, lamination, foil, inks, offset rubber, chemistry, and supporting materials.',
        ],
        [
          'B2B focus',
          'We work for printing houses, packaging manufacturers, and companies that need stable supply.',
        ],
        [
          'Clear market pricing',
          'We follow the market and keep prices comparable to key competitors.',
        ],
      ],
      statusLabel: 'supply status',
      statusTitle: 'Materials for print production',
      statusChip: 'B2B supply',
      solutionTitle: 'Core categories',
      solutionItems: [
        ['Paper and base stock', 'Self-adhesive paper, coated paper, carton'],
        ['Lamination and finishing', 'Films, soft touch, hot stamping foil'],
        ['Print consumables', 'Inks, offset rubber, washes and chemistry'],
      ],
      launchLabel: 'Region',
      launchValue: 'Tashkent',
      launchText: 'Built around the Uzbekistan print market and the needs of printing, packaging, and manufacturing companies.',
      supplyTitle: 'What we supply',
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
          'These three directions best represent the company profile and are ideal for the first screen of the catalog or landing page.',
      },
      pricing: {
        label: 'Pricing',
        title: 'Indicative prices',
        description:
          'Below are sample starting prices for positions that appear in the company’s comparison table.',
      },
      trust: {
        label: 'Why clients trust us',
        title: 'A supplier with a clear procurement logic for the print industry',
        description:
          'The company presents itself as a focused supplier for the print market, where assortment, stability, and practical purchasing logic matter.',
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
    pricing: {
      note: 'Final cost depends on format, gsm, purchase volume, stock availability, and delivery lead time.',
      items: [
        {
          title: 'Self-adhesive paper',
          description: 'Sheet stock for print and label production',
          price: 'from 1,000 UZS',
          unit: '/ sheet',
          lead: 'in stock / check availability',
        },
        {
          title: 'Lamination film',
          description: 'Gloss or matte film for post-print processing',
          price: 'from 43,000 UZS',
          unit: '/ roll',
          lead: 'in stock / check availability',
        },
        {
          title: 'Hot stamping foil',
          description: 'Gold, silver, and colored finishing solutions',
          price: 'from 150,000 UZS',
          unit: '/ roll',
          lead: 'in stock / check availability',
        },
        {
          title: 'CMYK offset inks',
          description: 'Base inks for print production',
          price: 'from 82,000 UZS',
          unit: '/ 2.5 kg',
          lead: 'in stock / check availability',
        },
      ],
    },
    metrics: [
      { value: '10+', label: 'product directions in the assortment' },
      { value: '117+', label: 'price points in comparison tables' },
      { value: '8+', label: 'years on the market since March 15, 2018' },
      { value: 'B2B', label: 'focus on printing houses and manufacturing companies' },
    ],
    trustPoints: [
      'Material selection based on the task, run size, and equipment',
      'Fast access to key items and transparent pricing',
      'One contact point for paper, lamination, inks, chemistry, and consumables',
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
      <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-accent">
        <Sparkles className="h-3.5 w-3.5" />
        {label}
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
            className="glass-panel flex items-center justify-between gap-4 rounded-[1.75rem] px-4 py-3 sm:px-5"
            initial={reduceMotion ? undefined : { opacity: 0, y: -16 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={reduceMotion ? undefined : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <a href="#" className="flex items-center gap-3">
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
              <a className="whitespace-nowrap transition-colors hover:text-white" href="#advantages">
                {content.nav.advantages}
              </a>
              <a className="whitespace-nowrap transition-colors hover:text-white" href="#pricing">
                {content.nav.pricing}
              </a>
              <a className="whitespace-nowrap transition-colors hover:text-white" href="#trust">
                {content.nav.trust}
              </a>
            </nav>

            <div className="header-controls">
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
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-white/82"
                initial={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={reduceMotion ? undefined : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <BadgeCheck className="h-3.5 w-3.5 text-accent" />
                {content.hero.badge}
              </motion.div>

              <h1 className="mt-6 text-5xl font-semibold leading-[0.94] tracking-[-0.055em] text-white sm:text-6xl md:text-7xl">
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
              <div className="glass-panel relative overflow-hidden rounded-[2rem] p-5 sm:p-6">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,140,255,0.22),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(255,122,24,0.16),transparent_32%)]" />

                <div className="relative grid gap-4">
                  <div className="flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-black/18 px-4 py-3">
                    <div>
                      <div className="text-xs uppercase tracking-[0.22em] text-muted">{content.hero.statusLabel}</div>
                      <div className="mt-1 text-lg font-medium text-white">{content.hero.statusTitle}</div>
                    </div>
                    <div className="rounded-full border border-accent/25 bg-accent/15 px-3 py-1 text-sm text-accent">
                      {content.hero.statusChip}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
                    <div className="glass-panel rounded-[1.75rem] p-5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted">{content.hero.solutionTitle}</span>
                        <Printer className="h-5 w-5 text-accent" />
                      </div>
                      <div className="mt-5 space-y-4">
                        {content.hero.solutionItems.map(([title, text]) => (
                          <div key={title} className="rounded-2xl border border-white/8 bg-white/4 p-4">
                            <div className="text-sm font-medium text-white">{title}</div>
                            <div className="mt-1 text-sm leading-6 text-muted">{text}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-4">
                      <div className="glass-panel rounded-[1.75rem] p-5">
                        <div className="text-sm text-muted">{content.hero.launchLabel}</div>
                        <div className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white">
                          {content.hero.launchValue}
                        </div>
                        <div className="mt-2 text-sm leading-6 text-muted">{content.hero.launchText}</div>
                      </div>

                      <div className="glass-panel rounded-[1.75rem] p-5">
                        <div className="flex items-center gap-3">
                          <Package className="h-5 w-5 text-[#ff7a18]" />
                          <span className="text-sm font-medium text-white">{content.hero.supplyTitle}</span>
                        </div>
                        <div className="mt-4 space-y-3">
                          {content.hero.supplyItems.map((item) => (
                            <div key={item} className="flex items-center gap-2 text-sm text-muted">
                              <Check className="h-4 w-4 text-accent" />
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </MotionSection>

          <MotionSection id="advantages" className="section-space border-t border-white/8" delay={0.05}>
            <SectionHeading
              label={content.section.advantages.label}
              title={content.section.advantages.title}
              description={content.section.advantages.description}
            />

            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {content.features.map(({ icon: Icon, title, text }, index) => (
                <motion.article
                  key={title}
                  className="glass-panel rounded-[1.75rem] p-6 hover-lift"
                  initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={
                    reduceMotion
                      ? undefined
                      : { duration: 0.55, delay: 0.07 * index, ease: [0.22, 1, 0.36, 1] }
                  }
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-white/8">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="mt-6 text-xl font-medium tracking-[-0.03em] text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{text}</p>
                </motion.article>
              ))}
            </div>
          </MotionSection>

          <MotionSection id="products" className="section-space border-t border-white/8" delay={0.08}>
            <SectionHeading
              label={content.section.products.label}
              title={content.section.products.title}
              description={content.section.products.description}
            />

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {content.products.map((product, index) => (
                <motion.article
                  key={product.title}
                  className="product-card group rounded-[2rem] p-6 sm:p-7"
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
                        className="flex items-center gap-3 rounded-2xl border border-white/8 bg-black/16 px-4 py-3 text-sm text-white/86 transition-colors duration-300 group-hover:border-white/12"
                      >
                        <Check className="h-4 w-4 text-accent" />
                        {point}
                      </div>
                    ))}
                  </div>
                </motion.article>
              ))}
            </div>
          </MotionSection>

          <MotionSection id="pricing" className="section-space border-t border-white/8" delay={0.1}>
            <SectionHeading
              label={content.section.pricing.label}
              title={content.section.pricing.title}
              description={content.section.pricing.description}
            />

            <div className="mt-10 grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
              {content.pricing.items.map((item, index) => (
                <motion.article
                  key={item.title}
                  className="glass-panel rounded-[1.8rem] p-6 hover-lift"
                  initial={reduceMotion ? undefined : { opacity: 0, y: 22 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={
                    reduceMotion
                      ? undefined
                      : { duration: 0.55, delay: 0.06 * index, ease: [0.22, 1, 0.36, 1] }
                  }
                >
                  <div className="text-sm font-medium text-white">{item.title}</div>
                  <p className="mt-3 text-sm leading-6 text-muted">{item.description}</p>
                  <div className="mt-8 flex items-end gap-2">
                    <div className="text-3xl font-semibold tracking-[-0.05em] text-white">{item.price}</div>
                    <div className="pb-1 text-sm text-muted">{item.unit}</div>
                  </div>
                  <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/75">
                    <ChevronDown className="h-3.5 w-3.5 rotate-[-90deg] text-accent" />
                    {item.lead}
                  </div>
                </motion.article>
              ))}
            </div>

            <p className="mt-6 text-sm leading-6 text-muted">{content.pricing.note}</p>
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

            <div className="mt-10 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="glass-panel rounded-[2rem] p-6 sm:p-7">
                <div className="text-sm uppercase tracking-[0.22em] text-muted">
                  {locale === 'ru' ? 'Что получает клиент' : locale === 'uz' ? 'Mijoz nimani oladi' : 'Client outcome'}
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
                  {locale === 'ru' ? 'Подходит для' : locale === 'uz' ? 'Kimlar uchun' : 'Built for'}
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
                    ? 'Если вам нужен не просто подрядчик, а спокойный и предсказуемый production-партнер, вы в правильном месте.'
                    : locale === 'uz'
                      ? 'Agar sizga oddiy pudratchi emas, balki xotirjam va bashorat qilinadigan production hamkor kerak bo‘lsa, bu to‘g‘ri joy.'
                      : 'If you need more than a vendor, and want a calm, predictable production partner, you are in the right place.'}
                </p>
              </div>
            </div>
          </MotionSection>

          <MotionSection id="cta" className="section-space border-t border-white/8" delay={0.15}>
            <div className="grid gap-5 lg:grid-cols-[1fr_0.92fr]">
              <div className="glass-panel rounded-[2rem] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs uppercase tracking-[0.22em] text-accent">
                    {content.section.cta.label}
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
                    <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">
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

        <footer className="border-t border-white/8 py-8">
          <div className="flex flex-col gap-4 text-sm text-muted md:flex-row md:items-center md:justify-between">
            <div>
              <span className="font-medium text-white">POLYGRAPH BUSINESS</span> — {content.footer.text}
            </div>
            <div className="flex flex-wrap gap-5">
              <a className="transition-colors hover:text-white" href="#advantages">
                {content.nav.advantages}
              </a>
              <a className="transition-colors hover:text-white" href="#products">
                {content.nav.products}
              </a>
              <a className="transition-colors hover:text-white" href="#pricing">
                {content.nav.pricing}
              </a>
              <a className="transition-colors hover:text-white" href="#cta">
                {content.nav.contact}
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
