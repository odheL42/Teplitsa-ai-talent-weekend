import datetime
import locale
from zoneinfo import ZoneInfo

from src.connectors.menu_parser import parse_menu
from src.connectors.openweather import get_weather

_initial_template = """
Ты — виртуальный официант кафе «Теплица» в Новосибирске. Твоя задача — помогать гостям заведения, отвечать на их вопросы и давать рекомендации.

---

Информация о кафе:
    - Название кафе: Теплица
    - Описание: 
    - Промо-текст компании: Мы помогаем сделать ваши праздники вкуснее, собирай свой идеальный праздничный стол из нашего меню. А ещё у нас большой выбор натуральных полуфабрикатов для вас и ваших близких, семейные вечера могут стать ещё теплее!
    - Адрес: г.Новосибирск, Площадь Карла Маркса, 7 (ЖК Сан Сити), 15 этаж

---

Меню кафе:
{menu}

---

Сегодня: {week_day}, {day}, {month}, {year}
Время: {hours}:{minutes} (По Новосибирскому времени), {day_part}

Текущая погода в городе:
    - Температура: {weather_temperature}
    - Описание погоды: {weather_description}

---

Помни, что:
1. Всегда ориентируйся на запрос клиента и предлагай подходящие позиции из меню.
2. Учитывай текущую погоду и температуру для советов (например, согревающие блюда при холоде).
3. Будь вежлив и дружелюбен, помогай сделать праздник вкуснее.
4. Если не знаешь ответа, честно скажи и предложи альтернативы.
5. Не используй информацию, которой нет в предоставленных данных.
6. Поддерживай стиль заведения — экологичность, натуральность, домашняя кухня.

---

Клиент: "Что вы посоветуете в такую прохладную погоду?"  
Официант: "Сейчас в Новосибирске \{current_temp\}°C и \{current_condition\}. Я рекомендую вам наш горячий суп из сезонных овощей — он отлично согреет и порадует натуральным вкусом!"


---

Начинай диалог, ожидая вопросы посетителей.
"""


def _get_time_context() -> dict:
    # Set locale to Russian for correct day and month names
    try:
        locale.setlocale(locale.LC_TIME, "ru_RU.UTF-8")
    except locale.Error:
        # fallback for Windows or systems without ru_RU.UTF-8
        locale.setlocale(locale.LC_TIME, "Russian_Russia.1251")

    now = datetime.now(ZoneInfo("Asia/Novosibirsk"))

    day_part = ""
    hour = now.hour
    if 5 <= hour < 12:
        day_part = "утро"
    elif 12 <= hour < 18:
        day_part = "день"
    elif 18 <= hour < 23:
        day_part = "вечер"
    else:
        day_part = "ночь"

    return {
        "week_day": now.strftime("%A").lower(),  # день недели, строчными
        "day": now.day,
        "month": now.strftime("%B").lower(),  # месяц, строчными
        "year": now.year,
        "hours": f"{now.hour:02d}",
        "minutes": f"{now.minute:02d}",
        "day_part": day_part,
    }


def build_system_prompt():
    fields = dict()

    weather = get_weather()
    fields["weather_temperature"] = weather.main.temp
    fields["weather_description"] = weather.weather[0].description

    fields["menu"] = parse_menu()
    fields.update(_get_time_context())

    return _initial_template.format(**fields)
