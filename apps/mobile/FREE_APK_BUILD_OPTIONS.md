# 🆓 Бесплатные способы сборки APK

## ✅ Вариант 1: GitHub Actions (РЕКОМЕНДУЕТСЯ)

**Бесплатно**: ✅ Да  
**Скорость**: ~10-15 минут  
**Требования**: GitHub аккаунт

### Как запустить:

1. **Создайте GitHub репозиторий** (если ещё нет)
```bash
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

2. **Запустите сборку через интерфейс GitHub**:
   - Перейдите на GitHub → Actions
   - Выберите workflow "Build Android APK"
   - Нажмите "Run workflow"
   - Выберите профиль (preview или production)
   - Нажмите "Run workflow"

3. **Получите APK**:
   - После завершения (10-15 минут) перейдите в "Artifacts"
   - Скачайте `android-apk`

### Плюсы:
✅ Полностью бесплатно  
✅ Автоматическая сборка  
✅ APK доступен 7 дней  
✅ Работает на Windows/Mac/Linux  
✅ Не нужно устанавливать Android Studio

---

## ✅ Вариант 2: Android Studio (Локально)

**Бесплатно**: ✅ Да  
**Скорость**: ~5-10 минут после настройки  
**Требования**: Android Studio (~1GB)

### Инструкция:

1. **Установите Android Studio**
   - Скачайте: https://developer.android.com/studio
   - Установите JDK 17 через Android Studio

2. **Подготовьте проект**:
```bash
cd apps/mobile
npx expo prebuild
```

3. **Откройте в Android Studio**:
   - Откройте Android Studio
   - File → Open → выберите `apps/mobile/android`

4. **Соберите APK**:
   - Build → Build Bundle(s) / APK(s) → Build APK(s)
   - APK будет в: `apps/mobile/android/app/build/outputs/apk/debug/app-debug.apk`

### Плюсы:
✅ Работает оффлайн  
✅ Быстрая сборка  
✅ Полный контроль

### Минусы:
❌ Нужно установить Android Studio (1GB+)

---

## ✅ Вариант 3: EAS Build (Текущий)

**Бесплатно**: ✅ Да (с лимитами)  
**Скорость**: 10-60 минут (зависит от очереди)  
**Требования**: Expo аккаунт

### Как использовать:

```bash
cd apps/mobile
pnpm build:android        # Preview
pnpm build:android:prod   # Production
```

### Плюсы:
✅ Не нужно настраивать Android Studio  
✅ Облачная сборка

### Минусы:
❌ Очередь (до 60 минут ожидания)  
❌ Лимит 1 одновременная сборка на бесплатном плане

**Текущий статус**: Ваша сборка в очереди  
https://expo.dev/accounts/kipish/projects/musora-net/builds

---

## ✅ Вариант 4: Expo Go (Для тестирования)

**Бесплатно**: ✅ Да  
**Скорость**: Мгновенно  
**Требования**: Телефон с Expo Go

### Как использовать:

1. **Установите Expo Go** на телефон:
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
   - iOS: https://apps.apple.com/app/expo-go/id982107779

2. **Запустите dev сервер**:
```bash
cd apps/mobile
pnpm dev
```

3. **Отсканируйте QR-код** через Expo Go

### Плюсы:
✅ Мгновенный запуск  
✅ Не нужно собирать APK  
✅ Подходит для разработки

### Минусы:
❌ Нужно быть в одной сети  
❌ Нужен Expo Go на телефоне  
❌ Не работает оффлайн

---

## 🏆 Рекомендация

**Для постоянной сборки**: Используйте **GitHub Actions** (Вариант 1)
- Бесплатно
- Автоматически
- Быстро
- Не зависит от очереди EAS

**Для быстрого тестирования**: Используйте **Expo Go** (Вариант 4)

**Если нужен APK срочно**: Используйте **Android Studio** (Вариант 2)

---

## 📝 Сравнение методов

| Метод | Бесплатно | Скорость | Требования | Рекомендация |
|-------|-----------|----------|------------|--------------|
| GitHub Actions | ✅ | ⭐⭐⭐ | GitHub | **Лучший выбор** |
| Android Studio | ✅ | ⭐⭐⭐⭐⭐ | Android Studio | Для оффлайн |
| EAS Build | ✅ | ⭐⭐ | Expo аккаунт | Когда нет очереди |
| Expo Go | ✅ | ⭐⭐⭐⭐⭐ | Телефон | Для тестирования |

---

## 🚀 Следующие шаги

1. **Запустите GitHub Actions** (самый надёжный способ):
   ```bash
   git add .github/workflows/build-apk.yml apps/mobile/FREE_APK_BUILD_OPTIONS.md
   git commit -m "Add free APK build via GitHub Actions"
   git push
   ```
   Затем зайдите на GitHub → Actions и запустите workflow

2. **Или используйте текущую EAS сборку**:
   - Подождите 20-60 минут
   - Ссылка: https://expo.dev/accounts/kipish/projects/musora-net/builds

3. **Для разработки**: Используйте Expo Go - самый быстрый способ
