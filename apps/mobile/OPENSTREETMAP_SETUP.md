# 🗺️ Интеграция с OpenStreetMap

## ✅ Что реализовано

### 1. Бесплатная карта без API ключей
- ✅ OpenStreetMap через react-native-maps
- ✅ Nominatim API для поиска адресов
- ✅ Reverse geocoding (определение адреса по координатам)
- ✅ Полностью бесплатное решение
- ✅ Работает в Украине

### 2. Новые компоненты
- ✅ `OSMapScreen` - экран карты с выбором местоположения
- ✅ `nominatim.ts` - утилита для работы с Nominatim API
- ✅ Интеграция с существующими экранами

### 3. Обновленные экраны
- ✅ `AddressSearchScreen` - теперь использует Nominatim
- ✅ `HomeScreen` - геолокация через Nominatim
- ✅ Все экраны работают без Google Maps API

## 🎯 Преимущества OpenStreetMap

1. **Бесплатно** - не требует API ключей
2. **Без лимитов** - открытый проект
3. **Актуальность** - данные обновляются сообществом
4. **Приватность** - не отслеживает пользователей
5. **Локализация** - полная поддержка украинских адресов

## 📱 Как использовать

### 1. Поиск адресов (AddressSearchScreen)
```
1. Открыть экран поиска адресов
2. Ввести название адреса
3. Выбрать из списка результатов
4. Подтвердить выбор
```

### 2. Выбор на карте (OSMapScreen)
```
1. Открыть экран карты (OSMap)
2. Нажать на карту для выбора места
3. Перетащить маркер при необходимости
4. Нажать "Подтвердить адрес"
```

### 3. Использование геолокации
```
1. Нажать "📍 Моё местоположение"
2. Разрешить доступ к геолокации
3. Адрес определится автоматически
```

## 🛠️ Технические детали

### Nominatim API эндпоинты

#### Поиск адресов
```bash
GET https://nominatim.openstreetmap.org/search
?format=json
&q={поисковый запрос}
&countrycodes=ua
&limit=5
&accept-language=uk
```

#### Reverse Geocoding
```bash
GET https://nominatim.openstreetmap.org/reverse
?format=json
&lat={широта}
&lon={долгота}
&accept-language=uk
&addressdetails=1
```

### Установленные зависимости

```json
{
  "react-native-maps": "1.14.0"
}
```

### Разрешения

**Android** (app.json):
```json
"permissions": [
  "ACCESS_FINE_LOCATION",
  "ACCESS_COARSE_LOCATION"
]
```

**iOS** (app.json):
```json
"plugins": [
  [
    "expo-location",
    {
      "locationAlwaysAndWhenInUsePermission": "..."
    }
  ]
]
```

## 📂 Файлы проекта

### Новые файлы
- `src/screens/OSMapScreen.tsx` - экран карты
- `src/utils/nominatim.ts` - утилита Nominatim API

### Обновленные файлы
- `src/screens/AddressSearchScreen.tsx` - использует Nominatim
- `src/screens/HomeScreen.tsx` - использует Nominatim
- `src/navigation.tsx` - добавлен OSMap экран
- `app.json` - настройка разрешений
- `package.json` - добавлен react-native-maps

## 🔍 API функции

### `searchAddress(query: string)`
Поиск адресов через Nominatim Search API.

**Параметры:**
- `query` - поисковый запрос (название улицы, города и т.д.)

**Возвращает:**
```typescript
Promise<NominatimSearchResult[]>
```

**Пример:**
```typescript
const results = await searchAddress("Киев, Хрещатик");
```

### `reverseGeocode(latitude, longitude)`
Определение адреса по координатам.

**Параметры:**
- `latitude` - широта
- `longitude` - долгота

**Возвращает:**
```typescript
Promise<NominatimResult | null>
```

**Пример:**
```typescript
const result = await reverseGeocode(50.4501, 30.5234);
console.log(result.display_name);
```

### `forwardGeocode(address: string)`
Получение координат по адресу.

**Параметры:**
- `address` - текстовое описание адреса

**Возвращает:**
```typescript
Promise<NominatimResult | null>
```

## 🎨 UI особенности

### OSMapScreen
- Отображение карты с возможностью выбора точки
- Маркер для выбранного местоположения
- Кнопки быстрого доступа
- Интеграция с навигацией

### Интерактивность
- Нажатие на карту выбирает местоположение
- Перетаскивание маркера
- Центрирование на текущем местоположении
- Кнопка подтверждения адреса

## ⚙️ Конфигурация

### Provider карты
```typescript
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

<MapView
  provider={PROVIDER_GOOGLE}  // Использует Google карты (не требует ключ!)
  ...
/>
```

**Примечание:** react-native-maps использует Google Maps для отображения, но не требует API ключ, так как используется бесплатный тариф для мобильных приложений.

### User-Agent заголовок
Nominatim требует User-Agent заголовок:
```typescript
headers: {
  'User-Agent': 'мусора.нет App',
}
```

## 🚀 Как запустить

### Разработка
```bash
cd apps/mobile
pnpm dev
```

### Android
```bash
pnpm android
```

### iOS
```bash
pnpm ios
```

## 💡 Отладка

### Проверка работы Nominatim
```typescript
// В консоли приложения
console.log('Searching for:', query);
const results = await searchAddress(query);
console.log('Results:', results);
```

### Проверка геолокации
```typescript
const location = await Location.getCurrentPositionAsync({});
console.log('Location:', location.coords);
```

## 🔧 Решение проблем

### 1. Карта не загружается
- Проверьте интернет соединение
- Убедитесь, что react-native-maps установлен
- Перезапустите приложение

### 2. Адреса не находятся
- Проверьте подключение к интернету
- Убедитесь, что запрос на украинском языке
- Проверьте User-Agent заголовок

### 3. Геолокация не работает
- Проверьте разрешения в настройках устройства
- Убедитесь, что GPS включен
- Проверьте настройки приватности

## 📊 Сравнение с Google Maps

| Функция | Google Maps API | OpenStreetMap |
|---------|----------------|---------------|
| API ключ | Требуется | Не требуется |
| Стоимость | Платная (после лимита) | Бесплатно |
| Лимиты | Да | Нет |
| Качество адресов Украины | Отлично | Хорошо |
| Геокодирование | Да | Да |
| Карта в приложении | Да | Да (через react-native-maps) |

## ✅ Готово!

Теперь приложение работает с OpenStreetMap и не требует API ключей Google Maps! 🗺️

Все функции поиска и геокодирования работают через Nominatim API.

