<p align="center">
  <img src="docs/images/logo.svg" width="128" height="128">
  <h1 align="center">A.N.O.M.E.R. (Web Terminal)</h1>
  <p align="center"><i>Another New Online MEssengeR</i></p>
</p>

<p align="center">
  <img alt="Static Badge" src="https://img.shields.io/badge/raphael_golubev-anomer-5ad1e6">
  <img alt="GitHub Created At" src="https://img.shields.io/github/created-at/raphaelgolubev/anomer-web">
  <img alt="GitHub" src="https://img.shields.io/github/license/raphaelgolubev/anomer-web?color=white">
  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/raphaelgolubev/anomer-web">
  <img alt="GitHub commit activity" src="https://img.shields.io/github/commit-activity/t/raphaelgolubev/anomer-web?color=green">
</p>

<p align="center">
  <img src="docs/images/screen.png" alt="Terminal Interface Preview" width="800" style="border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);"/>
</p>

---

## 📟 О проекте

**Anomer** — это иммерсивный веб-терминал с эстетикой ЭЛТ-мониторов 80-х и 90-х годов. Проект ориентирован на максимальное погружение через звук, визуальные дефекты (глитчи) и тактильный интерфейс.

### Основные фичи:
* Процедурная генерация звуков печати, работы диска и гула трансформатора через Web Audio API.
* Интерактивное меню настроек монитора (яркость, насыщенность, громкость).
* Построено на современных рунах (`$state`, `$derived`, `$effect`) для молниеносной реактивности.

---

## Технологический стек

* **Frontend**: [Svelte 5](https://svelte.dev), TypeScript, Vite.
* **Backend**: [FastAPI (Python)](https://github.com/raphaelgolubev/anomer-backend)
* **Runtime**: [Bun](https://bun.sh)
* **Containerization**: Docker & Docker Compose

---

## 🚀 Быстрый старт (Development)

Для удобства развертывания используется `Makefile`. Все команды Docker инкапсулированы для быстрой работы в терминале.

### 1. Подготовка
```bash
git clone https://github.com
cd anomer-web
```

### 2. Запуск

Просто выполните команду сборки и запуска. Она поднимет Frontend (Svelte) в изолированной сети:

```bash
make upb
```
*Приложение будет доступно по адресу: http://localhost:3000*

**клянусь** этот ридми генерил не ЛЛМ
