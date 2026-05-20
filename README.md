# 🎵 بوت الموسيقى Lava Music

بوت موسيقى ديسكورد يعمل مع LavaLink لتشغيل الموسيقى عالية الجودة.

## ✨ المميزات

- 🔍 البحث عن الأغاني من YouTube
- 🎶 تشغيل وإدارة قائمة الانتظار
- ⏯️ التحكم الكامل (تشغيل، إيقاف مؤقت، تخطي)
- 🔊 التحكم بالصوت (0-100)
- 🔁 وضع التكرار (أغنية واحدة / قائمة كاملة)
- 📋 عرض قائمة التشغيل الحالية
- 🎵 عرض الأغنية التي تعمل حالياً
- 📤 فصل تلقائي بعد 5 دقائق من عدم النشاط

## 🚀 كيفية التثبيت

### 1. تحميل المشروع

```bash
cd music-bot
```

### 2. تثبيت المكتبات

```bash
npm install
```

### 3. إعداد ملف .env

```bash
cp .env.example .env
```

ثم افتح ملف `.env` وأضف رمز البوت الخاص بك:

```
DISCORD_TOKEN=your_bot_token_here
```

### 4. الحصول على رمز البوت

1. اذهب إلى [Discord Developer Portal](https://discord.com/developers/applications)
2. اضغط على "New Application"
3. اختر اسم للبوت
4. اذهب إلى "Bot" في القائمة الجانبية
5. اضغط "Reset Token" واحفظ الرمز
6. فعّل **Message Content Intent** من "Privileged Gateway Intents"

### 5. دعوة البوت للخادم

من Developer Portal:
1. اذهب إلى "OAuth2" > "URL Generator"
2. اختر الصلاحيات: `bot` و `applications.commands`
3. في "Bot Permissions" اختر:
   - View Channels
   - Send Messages
   - Embed Links
   - Connect
   - Speak
4. انسخ الرابط ودعوة البوت لخادمك

### 6. تشغيل البوت

```bash
npm start
```

## 📚 الأوامر

| الأمر | الوصف |
|-------|-------|
| `!play <أغنية>` | تشغيل أغنية أو البحث |
| `!skip` | تخطي الأغنية الحالية |
| `!stop` | إيقاف الموسيقى ومسح القائمة |
| `!pause` | إيقاف مؤقت |
| `!resume` | استئناف التشغيل |
| `!queue` | عرض قائمة الانتظار |
| `!nowplaying` | عرض الأغنية الحالية |
| `!volume <0-100>` | تعديل الصوت |
| `!loop [off/single/queue]` | وضع التكرار |
| `!help` | عرض المساعدة |

## ⚙️ الإعدادات

الإعدادات موجودة في `config.js`:

```javascript
{
  host: "lava-v4.ajieblogs.eu.org",
  port: 443,
  secure: true,
  password: "https://dsc.gg/ajidevserver",
}
```

## 📁 هيكل المشروع

```
music-bot/
├── index.js          # الملف الرئيسي للبوت
├── config.js         # الإعدادات
├── package.json      # معلومات المشروع
├── .env              # ملف البيئة (بعد الإنشاء)
├── .env.example      # مثال ملف البيئة
├── commands/         # أوامر البوت
│   ├── play.js
│   ├── skip.js
│   ├── stop.js
│   ├── pause.js
│   ├── resume.js
│   ├── queue.js
│   ├── nowplaying.js
│   ├── volume.js
│   ├── loop.js
│   └── help.js
└── README.md          # هذا الملف
```

## ❓ حلول المشاكل

### البوت لا يتصل بالصوت
- تأكد من منح البوت صلاحيات الاتصال والتحدث
- تأكد من وجود Message Content Intent مفعل

### لا يجد الأغاني
- تأكد من اتصال LavaLink يعمل
- جرب استخدام رابط YouTube مباشرة

### أخطاء Lavalink
- تأكد من صحة إعدادات LavaLink في config.js
- تأكد من أن المنفذ مفتوح

## 📝 ملاحظات

- البوت يستخدم Node.js 18+
- يتطلب Eri_la.js للتعامل مع LavaLink
- يدعم YouTube, SoundCloud, وروابط أخرى

## 🤝 المساهمة

المشروع مفتوح للمساهمة. يمكنك فتح issue أو pull request.

## 📜 الترخيص

MIT License