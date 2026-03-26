---
name: add-skill
description: Создаёт новый Claude Code skill и публикует его в dotfiles репозиторий (github.com/maxzemtsov/dotfiles). Запускать командой /add-skill когда нужно создать новый персональный skill.
---

# Создание нового Skill

Этот skill проводит через создание нового Claude Code skill и его публикацию в dotfiles repo.

## Шаг 1 — Собрать информацию

Спросить пользователя:
1. **Название** skill'а (в формате `kebab-case`, например `github-traittune`)
2. **Описание** — одна строка: что делает skill и когда его вызывать
3. **Содержание** — какие задачи skill должен решать, какие команды/инструкции включить

## Шаг 2 — Создать SKILL.md

Создать файл по пути `~/.claude/skills/<name>/SKILL.md` со структурой:

```markdown
---
name: <name>
description: <description>
---

# <Заголовок>

<Краткое описание назначения>

## Раздел 1
...

## Раздел 2
...
```

**Правила хорошего skill'а:**
- Описание в frontmatter должно объяснять КОГДА вызывать skill (не только что он делает)
- Включать конкретные команды, примеры, справочные таблицы
- Добавлять специфику проекта/компании (имена ресурсов, регионы, профили)
- Не делать skill слишком общим — он должен экономить время, а не быть документацией

**MANDATORY — Secrets policy for ALL skills:**
- If the skill requires ANY credentials, API keys, tokens, or secrets — it MUST include:
  `For credentials and secrets, use the /op-secrets skill. NEVER accept keys pasted in chat.`
- This applies to custom skills, skills from public libraries, and skills from external repos
- NEVER hardcode secret values, example keys, or placeholder tokens in SKILL.md
- If a public/external skill contains hardcoded credentials or accepts pasted keys — rewrite it to use `/op-secrets` before publishing

## Шаг 3 — Опубликовать в dotfiles

После создания SKILL.md выполнить:

```bash
# Копировать skill в dotfiles repo
cp -r ~/.claude/skills/<name> ~/dotfiles/.claude/skills/

# Закоммитить и запушить
cd ~/dotfiles
git add .
git commit -m "add skill: <name>"
git push
```

## Шаг 4 — Подтвердить результат

```bash
# Проверить что skill доступен
ls ~/.claude/skills/

# Проверить что опубликован
cd ~/dotfiles && git log --oneline -3
```

Сообщить пользователю:
- Путь к файлу: `~/.claude/skills/<name>/SKILL.md`
- Как вызывать: `/<name>` в новой сессии Claude Code
- Ссылка на repo: `https://github.com/maxzemtsov/dotfiles`

## Примеры хороших skill'ов

- `github-ops` — работа с GitHub репозиториями (клонирование, PR, ветки)
- `deploy-aws` — деплой приложений на AWS (credentials via `/op-secrets`)
- `db-connect` — подключение к базам данных, типичные запросы (credentials via `/op-secrets`)
- `openai-api` — работа с OpenAI API (API key via `/op-secrets`)
