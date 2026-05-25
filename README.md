# Журнал строительных работ

Full-stack приложение для ведения журнала выполненных строительных работ. В журнале можно просматривать записи, фильтровать их по дате, добавлять, редактировать и удалять записи. Вид работ выбирается из предзаполненного справочника.

## Стек

- **Next.js 16 + React 19 + TypeScript** — один проект для фронтенда и backend-for-frontend API.
- **Tailwind CSS 4** — быстрый и предсказуемый слой стилизации без отдельной UI-библиотеки.
- **PostgreSQL** — настоящая база данных, данные не хранятся в памяти или файлах.
- **Prisma 7** — типизированная работа с БД, миграции и seed справочника.
- **Docker Compose** — запуск PostgreSQL и веб-приложения одной командой.

## Запуск

Запустить БД, применить миграции, заполнить справочник и поднять веб-приложение:

```bash
docker compose up --build
```

Приложение будет доступно на [http://localhost:3000](http://localhost:3000).
PostgreSQL проброшен на `localhost:5433`.

Если порт `3000` занят:

```bash
WEB_PORT=3001 docker compose up --build
```

В Windows PowerShell:

```powershell
$env:WEB_PORT = "3001"; docker compose up --build
```

Приложение будет доступно на `http://localhost:3001`.

Остановить стек:

```bash
docker compose down
```

Остановить стек и удалить данные БД:

```bash
docker compose down -v
```

## Локальная разработка без Docker для веба

1. Установить зависимости:

```bash
pnpm install
```

2. Создать локальный env-файл:

```bash
cp .env.example .env
```

В Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Запустить только PostgreSQL:

```bash
docker compose up -d postgres
```

4. Применить миграции, сгенерировать Prisma Client и заполнить справочник видов работ:

```bash
pnpm prisma migrate dev
pnpm prisma generate
pnpm prisma db seed
```

5. Запустить приложение:

```bash
pnpm dev
```

## Проверка

```bash
pnpm lint
pnpm build
```

## API

- `GET /api/work-types` — список видов работ.
- `GET /api/journal-entries?from=&to=&sort=asc|desc` — список записей с фильтром и сортировкой по дате.
- `POST /api/journal-entries` — создание записи.
- `PATCH /api/journal-entries/[id]` — редактирование записи.
- `DELETE /api/journal-entries/[id]` — удаление записи.
