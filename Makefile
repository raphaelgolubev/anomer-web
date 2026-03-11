# регистр важен!!!
# macOS вернет "Darwin"
# Linux вернет "Linux" (включая WSL)
UNAME_S := $(shell uname -s)

# переменная OS для винды всегда возвращает Windows_NT
ifeq ($(OS), Windows_NT)
    UNAME_S := Windows
else
# если операционная система macOS, то используем zsh
	ifeq ($(UNAME_S),Darwin)
		SHELL := /bin/zsh
	endif
# иначе используем bash
	ifeq ($(UNAME_S),Linux)
		SHELL := /bin/bash
	endif
endif

# если юзер просто написал make, то вызвать таргет help
.DEFAULT_GOAL := help

ENV_FILE := ./.env
COMPOSE_FILE := ./compose.dev.yaml

COMPOSE := docker-compose -f $(COMPOSE_FILE)

# ============
# === HELP ===
# ============
help: ## Отобразить это справочное сообщение
	@echo "Доступные команды:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

# ==============
# === DOCKER ===
# ==============
.PHONY: build up upb down logs clean full-clean

build: ## собираем контейнеры
	$(COMPOSE) build

up: ## поднимаем контейнеры
	${COMPOSE} up -d

upb: ## пересобираем и поднимаем контейнеры
	${COMPOSE} up --build -d

down: ## останавливаем контейнеры
	$(COMPOSE) down

logs: ## выводим логи docker за последние 10 минут
	${COMPOSE} logs --since=10m

clean: ## удаляем контейнеры и их вольюмы 
	$(COMPOSE) down -v --remove-orphans

full-clean: ## удаляем все подчистую
	docker system prune -a