import numpy as np

_original_array = np.array


def patched_array(obj, *args, **kwargs):
    if "copy" in kwargs and kwargs["copy"] is False:
        # replace np.array(..., copy=False) -> np.asarray(...)
        kwargs.pop("copy")
        return np.asarray(obj, *args, **kwargs)
    return _original_array(obj, *args, **kwargs)


np.array = patched_array


import fasttext
import typer
from rich.console import Console
from rich.prompt import Prompt

app = typer.Typer()
console = Console()

LABELS_MAP = {
    "__label__technical": "Да",
    "__label__relevant": "Нет",
}


@app.command()
def chat(model_path: str):
    """
    Запускает интерактивный чат с fastText моделью.
    Вводи вопрос, получай ответ 'Да' или 'Нет'.
    Для выхода введи пустую строку или Ctrl+C.
    """
    try:
        model = fasttext.load_model(model_path)
    except Exception as e:
        console.print(f"[red]Ошибка загрузки модели:[/red] {e}")
        raise typer.Exit(code=1)

    console.print("[bold green]Интерактивный чат запущен.[/bold green]")
    console.print("Введи вопрос и получи ответ (Да/Нет). Пустая строка — выход.\n")

    while True:
        try:
            question = Prompt.ask("[bold blue]Ты[/bold blue]").strip()
            if not question:
                console.print("[yellow]Выход из чата.[/yellow]")
                break

            labels, probabilities = model.predict(question, k=1)
            label = labels[0]

            answer = LABELS_MAP.get(label, "Неопределено")
            prob = probabilities[0]

            if answer == "Неопределено":
                console.print(f"[red]Модель вернула неизвестную метку: {label}[/red]")
            else:
                color = "green" if answer == "Да" else "red"
                console.print(
                    f"[bold {color}]Бот:[/bold {color}] {answer} (вероятность {prob:.2f})"
                )

        except KeyboardInterrupt:
            console.print("\n[yellow]Выход из чата по Ctrl+C[/yellow]")
            break
        except Exception as e:
            console.print(f"[red]Ошибка:[/red] {e}")
            raise e


if __name__ == "__main__":
    app()
