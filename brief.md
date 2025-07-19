# Приоритизация

Интеграция с основным меню:

- Коннектор для таблиц (Маша):

  - Актуальное меню:

    - Текущая модель (Menu) перегоняет в CateringMenu, оно становится частью фичи Catering
    - CurrentMenu (модель данных):

            ```python
            class CurrentMenuCategory(Enum, str):
                complex: "complex"
                base: "base"

            class CPFCModel(BaseModel): # per 100g
                calories: int
                proteins: int
                fats: int
                carbs: int

            class CurrentMenu(BaseModel):
                index: str # (аналогично текущей реализации меню)
                category: CurrentMenuCategory
                quantity: str # (выход, гр)
                price: int
                stock: bool | None = None
                notes: str | None = None # уточнения
                cpfc: CPFCModel | None = None

            ```

    - Коннектор get_current_menu (модуль `src.connectors.current_menu`)

            ```python
            async def get_current_menu() -> CurrentMenu:
                """
                Коннектор, который возвращает актуальное меню
                """
                pass
            ```

- Update для системного промпта (Слава)

  - Update под актуальное меню:

    - Компонент под текущее меню (модуль `src.chat.prompts.components.current_menu`)

            ```python
            class CurrentMenuPrompt:
                _current_menu_ = """ """ # шаблон для

                ...

                @classmethod
                async def get() -> str:
                    """
                    Здесь инкапсулирована логика для превращения CurrentMenu в строку
                    """
                    pass
            ```

    - Подставлять в `build_initial_prompt`

            ```python
            fields["current_menu"] = await CurrentMenuPrompt.get()
            ```

Задача: надо как-то прикрутить логику для валидации истории и саммаризации. Хранить настоящую и сжатую истории? 100%

`src.models.summary`

```python
class DBSummary:
    """
    Используется для хранилища
    """
    summary: str
    notes: str
```

```python
class SummaryResponse:
    """
    Используется для валидации ответа модели
    """
    summary: str
    new_notes: str # Новые предпочтения пользователя, выявленные по истории сообшений и старому саммари
```

`src.storage.summary`

```python
class SummaryStore:
    """
    Поведение аналогичное HistoryStore. Не хочется делать зависимость от структуры класса HistoryStore. Можно хранить текущее Summary и index в истории сообщений. Как поддерживать персистентность HistoryStore и SummaryStore?
    """
    pass
```

`src.connectors.openai`

```python
class OpenAISummary:
    """
    Поведение аналогичное коннектору к OpenAI для валидации, служит для генерации саммари общим скопом без stream-режима
    """
    pass
```

`src.chat.prompts.templates.summary`

```python
summary_prompt = f""" {summary: DBSummary, history: list[ChatMessage]} """

system_summary_prompt = """ """
```

`src.chat.builder`

```python
def build_summary_system_prompt() -> str:
    """
    Просто вернет шаблон системного промпта
    """
    pass

def build_summary_prompt(summary: DBSummary) -> str:
    """
    Доступ к истории происходит с помощью глобального HistoryStore
    """
    pass
```

`src.chat.service`

```python
class SummaryService:
    """
    Задача в том, чтобы принимать на вход историю (доступна глобально), и саммаризировать ее, на выход подается сжатый вариант истории. Поддерживает персистентность между HistoryStore и SummaryStore.
    """

    async def _validate_history_length() -> bool:
        """
        Задача в проверке истории перед помещением ее в контекст модели. Возвращает true/false. HistoryStore оперирует classmethod's, поэтому инициализация не нужна
        """
        pass

    async def _make_summary() -> str:
        """
        Будет вызывать метод из класса OpenAISummary.
        """

    async def _save_summary() -> None:
        pass

    async def get_history() -> list[ChatMessage]:
        """
        Главный метод класса, который возвращает историю, если
        """

    pass
```

### Порядок выполнения

1. Модели
2. Коннекторы: SummaryStore, OpenAISummary
3. SummaryPrompt, билдеры для промптов
4. SummaryService
5. API
6. Front

### Front

1. Хотим отображать предпочтения пользователя во вкладке PreferencesModal
2. Хотим иметь возможность редактировать предпочтения пользователя во вкладке PreferencesModal
3. Хотим отображать, когда память заполнена TODO: подумать, как отслеживать, заполнена ли память

### API

1. Хотим отдельный эндпоинт, чтобы редактировать NotesStore (задавать новое значение)
2. Хотим эндпоинт, чтобы получать значения из NotesStore

```python
@router.post("/update_summary", tags=["Summary"])
async def update_summary(new_summary: str) -> None:
    pass

@router.post("/get_summary", tags=["Summary"])
async def get_summary() -> str:
    pass
```
