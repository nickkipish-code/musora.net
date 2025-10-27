# 📱 Создание APK Без EAS (Оффлайн метод)

## Вариант 1: Использовать APK Builder онлайн

### Быстрый способ:
1. Откройте: https://www.appypie.com/apk-builder
2. Или используйте: https://buildapp.io
3. Или: https://gonative.io

Это простейший способ - загрузите код, и они создадут APK.

---

## Вариант 2: Локальная сборка с Android Studio

### Требования:
- [ ] Android Studio (https://developer.android.com/studio)
- [ ] JDK 17
- [ ] Android SDK

### Шаг 1: Установите Android Studio
Скачайте и установите Android Studio с официального сайта.

### Шаг 2: Настройте проект
```bash
cd apps/mobile
npx expo prebuild
```

### Шаг 3: Откройте в Android Studio
```bash
# Откройте папку android в Android Studio
cd android
# Android Studio откроется автоматически
```

### Шаг 4: Соберите APK
1. Build → Build Bundle(s) / APK(s) → Build APK(s)
2. Дождитесь завершения
3. APK будет в `android/app/build/outputs/apk/debug/app-debug.apk`

---

## Вариант 3: Простое решение - Поделиться ссылкой Expo Go

### Что нужно:
1. Запустите сервер:
```bash
cd apps/mobile
pnpm dev
```

2. Получите ссылку из терминала (QR-код)

3. Поделитесь этой ссылкой с другими:
```
exp://192.168.0.101:8081
```

### Плюсы:
- ✅ Работает сразу
- ✅ Не нужна сборка APK
- ✅ Быстрое обновление

### Минусы:
- ❌ Нужен Expo Go на телефоне
- ❌ Нужно быть в одной сети Wi-Fi

---

## Вариант 4: Создать account на Expo (бесплатно)

### Зарегистрируйтесь на https://expo.dev

1. Перейдите на https://expo.dev
2. Нажмите "Sign up"
3. Зарегистрируйтесь (это бесплатно)
4. Затем выполните:
```bash
cd apps/mobile
eas login
# Введите ваши данные
eas build -p android --profile preview
```

---

## Рекомендация

**Для быстрого тестирования:**
- Используйте Expo Go с QR-кодом

**Для финальной версии:**
- Зарегистрируйтесь на expo.dev (бесплатно)
- Используйте `eas build` для создания APK

**Самый простой способ:**
- Используйте онлайн APK Builder (см. Вариант 1)
