---
name: aws-cli-traittune
description: Полное руководство по подключению и управлению AWS CLI для TraitTune, Inc. Установка, конфигурация профилей, проверка подключения, управление регионами, безопасная работа с credentials.
---

# AWS CLI для TraitTune, Inc.

Skill для самостоятельного подключения и управления AWS-инфраструктурой TraitTune, Inc. через AWS CLI.

## 1. Установка AWS CLI

Проверить наличие:

```bash
aws --version
```

Если не установлен — установить:

```bash
# macOS (Homebrew)
brew install awscli

# macOS (официальный установщик)
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /

# Linux
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip && sudo ./aws/install
```

После установки убедиться:

```bash
aws --version
# Ожидаемый вывод: aws-cli/2.x.x ...
```

## 2. Конфигурация профиля TraitTune

Настроить именованный профиль `traittune`:

```bash
aws configure --profile traittune
```

Ввести по запросу:
- **AWS Access Key ID** — ключ доступа (получить у администратора или в IAM Console)
- **AWS Secret Access Key** — секретный ключ
- **Default region name** — `us-east-1` (или регион, используемый TraitTune)
- **Default output format** — `json`

Для использования по умолчанию без `--profile`:

```bash
export AWS_PROFILE=traittune
```

Добавить в `~/.zshrc` или `~/.bashrc` для постоянного использования:

```bash
echo 'export AWS_PROFILE=traittune' >> ~/.zshrc
source ~/.zshrc
```

## 3. Безопасность credentials

**Правила:**

- **НИКОГДА** не хардкодить ключи в коде, конфигах или чатах
- **НИКОГДА** не коммитить `~/.aws/credentials` или `.env` файлы с ключами в git
- Credentials хранятся ТОЛЬКО в `~/.aws/credentials` (создаётся автоматически при `aws configure`) или через environment variables
- Регулярно ротировать ключи (рекомендуется каждые 90 дней)
- Использовать IAM-роли вместо долгоживущих ключей где возможно

**Через environment variables** (для CI/CD или временного использования):

```bash
export AWS_ACCESS_KEY_ID=<ваш_ключ>
export AWS_SECRET_ACCESS_KEY=<ваш_секрет>
export AWS_DEFAULT_REGION=us-east-1
```

**Если credentials скомпрометированы:**

1. Немедленно перейти в AWS IAM Console
2. Деактивировать текущий ключ
3. Создать новый ключ
4. Обновить конфигурацию: `aws configure --profile traittune`

## 4. Проверка подключения

```bash
aws sts get-caller-identity --profile traittune
```

Ожидаемый ответ:

```json
{
    "UserId": "AIDAEXAMPLE",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/traittune-user"
}
```

Если ошибка — см. раздел "Диагностика проблем".

## 5. Полезные команды

Все команды используют `--profile traittune` или переменную `AWS_PROFILE=traittune`.

### IAM (управление доступом)

```bash
aws iam list-users --profile traittune
aws iam get-user --profile traittune
aws iam list-attached-user-policies --user-name <имя> --profile traittune
```

### S3 (хранилище)

```bash
aws s3 ls --profile traittune
aws s3 cp <файл> s3://<bucket>/<путь> --profile traittune
aws s3 sync <локальная_папка> s3://<bucket>/<путь> --profile traittune
aws s3 mb s3://<новый-bucket> --profile traittune
```

### EC2 (вычисления)

```bash
aws ec2 describe-instances --profile traittune
aws ec2 describe-instances --filters "Name=instance-state-name,Values=running" --profile traittune
aws ec2 start-instances --instance-ids <id> --profile traittune
aws ec2 stop-instances --instance-ids <id> --profile traittune
```

### RDS (базы данных)

```bash
aws rds describe-db-instances --profile traittune
aws rds describe-db-clusters --profile traittune
```

### Lambda (serverless)

```bash
aws lambda list-functions --profile traittune
aws lambda invoke --function-name <имя> output.json --profile traittune
```

### CloudWatch (мониторинг)

```bash
aws cloudwatch list-metrics --profile traittune
aws logs describe-log-groups --profile traittune
aws logs tail <log-group> --follow --profile traittune
```

### ECS/EKS (контейнеры)

```bash
aws ecs list-clusters --profile traittune
aws eks list-clusters --profile traittune
```

### Стоимость и биллинг

```bash
aws ce get-cost-and-usage \
  --time-period Start=2026-03-01,End=2026-03-31 \
  --granularity MONTHLY \
  --metrics "BlendedCost" \
  --profile traittune
```

## 6. Переключение между профилями

```bash
# Временно для одной команды
aws s3 ls --profile traittune

# Для текущей сессии терминала
export AWS_PROFILE=traittune

# Посмотреть все настроенные профили
aws configure list-profiles

# Посмотреть текущую конфигурацию
aws configure list --profile traittune
```

## 7. Диагностика проблем

| Ошибка | Причина | Решение |
|--------|---------|---------|
| `Unable to locate credentials` | Не настроен профиль или нет env vars | `aws configure --profile traittune` |
| `InvalidClientTokenId` | Неверный Access Key ID | Проверить ключ в IAM Console, перенастроить |
| `SignatureDoesNotMatch` | Неверный Secret Access Key | Перенастроить `aws configure --profile traittune` |
| `ExpiredToken` | Истёк временный токен (STS) | Получить новый токен или перелогиниться |
| `AccessDenied` | Нет прав на операцию | Проверить IAM-политики пользователя |
| `Could not connect to the endpoint URL` | Неверный регион или проблемы с сетью | Проверить `aws configure list`, попробовать другой регион |

### Отладка запросов

```bash
# Подробный вывод
aws sts get-caller-identity --profile traittune --debug

# Проверить какие credentials используются
aws configure list --profile traittune
```
