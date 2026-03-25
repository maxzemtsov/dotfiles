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

## Примеры хороших skill'ов для TraitTune

- `github-traittune` — работа с GitHub репозиториями TraitTune (клонирование, PR, ветки)
- `deploy-traittune` — деплой приложений на AWS/Vercel для TraitTune
- `db-traittune` — подключение к базам данных TraitTune, типичные запросы
- `onboarding-traittune` — инструкция для нового разработчика в TraitTune
