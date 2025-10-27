# 🚀 Настройка GitHub Actions для автоматической сборки APK

## Требуется настройка

### 1. Получите EAS Token

```bash
cd apps/mobile
eas login
eas whoami
```

Получите ваш токен на https://expo.dev/accounts/kkipish/settings/access-tokens

### 2. Добавьте секрет в GitHub

1. Откройте: https://github.com/nickkipish-code/musora.net/settings/secrets/actions
2. Нажмите "New repository secret"
3. Название: `EAS_TOKEN`
4. Значение: ваш EAS токен
5. Нажмите "Add secret"

### 3. Запустите сборку

1. https://github.com/nickkipish-code/musora.net
2. Actions → "Build Android APK"
3. "Run workflow" → "Run workflow"

---

## Альтернатива: Используйте текущую EAS сборку

Текущий build висит в очереди:
https://expo.dev/accounts/kipish/projects/musora-net/builds

Просто подождите 20-60 минут, и APK будет готов!

