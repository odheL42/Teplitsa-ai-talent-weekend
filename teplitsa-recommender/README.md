### Перед запуском

> Все команды выполняются из `teplitsa-recommender/`

1. Создать и заполнить `.env` на основе `.env.example`
2. Сконфигурировать проект с помощью `./config.yaml`

### Запуск приложения с Gradio-интерфейсом

```bash
uv run -m src.gradio_ui
```

### Запуск сервера

```bash
uv run -m src.main
```

### Тесты

_Запуск unit-тестов_

```bash
uv run -m pytest -m unit
```

_Запуск интеграционных тестов_

```bash
uv run -m pytest -m integration
```
