import pandas as pd
import typer
from datasets import concatenate_datasets, load_dataset
from sklearn.model_selection import train_test_split

app = typer.Typer()

LABELS_MAP = {0: "relevant", 1: "technical"}


class Massive:
    _INTENTS = [
        "datetime_query",
        "iot_hue_lightchange",
        "transport_ticket",
        "takeaway_query",
        "qa_stock",
        "general_greet",
        "recommendation_events",
        "music_dislikeness",
        "iot_wemo_off",
        "cooking_recipe",
        "qa_currency",
        "transport_traffic",
        "general_quirky",
        "weather_query",
        "audio_volume_up",
        "email_addcontact",
        "takeaway_order",
        "email_querycontact",
        "iot_hue_lightup",
        "recommendation_locations",
        "play_audiobook",
        "lists_createoradd",
        "news_query",
        "alarm_query",
        "iot_wemo_on",
        "general_joke",
        "qa_definition",
        "social_query",
        "music_settings",
        "audio_volume_other",
        "calendar_remove",
        "iot_hue_lightdim",
        "calendar_query",
        "email_sendemail",
        "iot_cleaning",
        "audio_volume_down",
        "play_radio",
        "cooking_query",
        "datetime_convert",
        "qa_maths",
        "iot_hue_lightoff",
        "iot_hue_lighton",
        "transport_query",
        "music_likeness",
        "email_query",
        "play_music",
        "audio_volume_mute",
        "social_post",
        "alarm_set",
        "qa_factoid",
        "calendar_set",
        "play_game",
        "alarm_remove",
        "lists_remove",
        "transport_taxi",
        "recommendation_movies",
        "iot_coffee",
        "music_query",
        "play_podcasts",
        "lists_query",
    ]

    _TECHNICAL = ["qa_maths"]

    _RELEVANT = [
        "datetime_query",
        "transport_ticket",
        "takeaway_query",
        "qa_stock",
        "general_greet",
        "recommendation_events",
        "music_dislikeness",
        "cooking_recipe",
        "qa_currency",
        "transport_traffic",
        "general_quirky",
        "takeaway_order",
        "weather_query",
        "recommendation_locations",
        "news_query",
        "general_joke",
        "calendar_remove",
        "qa_definition",
        "social_query",
        "calendar_query",
        "cooking_query",
        "transport_query",
        "datetime_convert",
        "email_query",
        "social_post",
        "music_query",
        "play_podcasts",
        "lists_query",
    ]

    @classmethod
    def dataset_to_df(cls, dataset) -> pd.DataFrame:
        texts = []
        labels = []

        for example in dataset:
            text = example["utt"]
            intent = example["intent"]

            texts.append(text)
            labels.append(intent)

        df = pd.DataFrame({"text": texts, "label": labels})
        return df

    @classmethod
    def load_massive_full(cls, locale: str):
        # Загрузить все сплиты для данной локали
        dataset = load_dataset("AmazonScience/massive", name=locale)

        # Объединить train, validation, test
        full_dataset = concatenate_datasets(
            [
                dataset["train"],
                dataset["validation"],
                dataset["test"],
            ]
        )
        return full_dataset

    @classmethod
    def save_fasttext_binary_format(cls, df: pd.DataFrame, output_path: str):
        with open(output_path, "w", encoding="utf-8") as f_out:
            for _, row in df.iterrows():
                if cls._INTENTS[row["label"]] not in cls._TECHNICAL:
                    label_str = "relevant"
                else:
                    label_str = "technical"
                text = row["text"].replace("\n", " ").strip()
                f_out.write(f"__label__{label_str} {text}\n")

    @classmethod
    def save_fasttext_format(cls, df: pd.DataFrame, output_path: str):
        with open(output_path, "w", encoding="utf-8") as f_out:
            for _, row in df.iterrows():
                label_str = cls._INTENTS[row["label"]]
                text = row["text"].replace("\n", " ").strip()
                f_out.write(f"__label__{label_str} {text}\n")


@app.command()
def massive(
    output_train_txt: str = typer.Option(..., help="Output train txt path"),
    output_test_txt: str = typer.Option(..., help="Output test txt path"),
    test_size: float = typer.Option(0.2, help="Fraction of test data"),
    binary: bool = typer.Option(True),
    random_state: int = typer.Option(42, help="Random seed"),
    output_train_parquet: str = typer.Option(
        None, help="Optional train parquet output"
    ),
    output_test_parquet: str = typer.Option(None, help="Optional test parquet output"),
):
    """
    Load Massive dataset, label intents as relevant/technical, split train/test and save in fastText format.
    """
    typer.echo("Loading Massive dataset for english and russian ...")
    dataset = concatenate_datasets(
        [Massive.load_massive_full("en-US"), Massive.load_massive_full("ru-RU")]
    )

    df = Massive.dataset_to_df(dataset)
    typer.echo(f"Dataset loaded. Total examples after filtering: {len(df)}")

    train_df, test_df = train_test_split(
        df, test_size=test_size, random_state=random_state, stratify=df["label"]
    )

    if binary:
        typer.echo(f"Saving train data to {output_train_txt} ...")
        Massive.save_fasttext_binary_format(train_df, output_train_txt)
        typer.echo(f"Saving test data to {output_test_txt} ...")
        Massive.save_fasttext_binary_format(test_df, output_test_txt)
    else:
        typer.echo(f"Saving train data to {output_train_txt} ...")
        Massive.save_fasttext_format(train_df, output_train_txt)
        typer.echo(f"Saving test data to {output_test_txt} ...")
        Massive.save_fasttext_format(test_df, output_test_txt)

    if output_train_parquet:
        typer.echo(f"Saving train parquet to {output_train_parquet} ...")
        train_df.to_parquet(output_train_parquet, index=False)

    if output_test_parquet:
        typer.echo(f"Saving test parquet to {output_test_parquet} ...")
        test_df.to_parquet(output_test_parquet, index=False)

    typer.echo("Done.")


def save_fasttext_format(df: pd.DataFrame, output_path: str):
    with open(output_path, "w", encoding="utf-8") as f_out:
        for _, row in df.iterrows():
            label_str = LABELS_MAP[row["label"]]
            text = row["text"].replace("\n", " ").strip()
            f_out.write(f"__label__{label_str} {text}\n")


@app.command()
def pg(
    input_parquet: str,
    output_train_txt: str,
    output_test_txt: str,
    test_size: float = 0.2,
    random_state: int = 42,
    output_train_parquet: str = None,
    output_test_parquet: str = None,
):
    """
    Prepare Postgresql train and test datasets in fastText format from parquet.

    Args:
        input_parquet: path to input parquet file with columns 'text' and 'label'
        output_train_txt: path to output train txt file in fastText format
        output_test_txt: path to output test txt file in fastText format
        test_size: fraction of test data, default 0.2
        random_state: random seed for splitting
        output_train_parquet: optional path to save cleaned train parquet
        output_test_parquet: optional path to save cleaned test parquet
    """

    df = pd.read_parquet(input_parquet)

    if "text" not in df.columns or "label" not in df.columns:
        raise ValueError("Input parquet must have 'text' and 'label' columns")

    df = df[df["label"].isin(LABELS_MAP.keys())].copy()
    df["text"] = df["text"].str.replace("\n", " ").str.strip()

    train_df, test_df = train_test_split(
        df, test_size=test_size, random_state=random_state, stratify=df["label"]
    )

    save_fasttext_format(train_df, output_train_txt)
    save_fasttext_format(test_df, output_test_txt)

    if output_train_parquet:
        train_df.to_parquet(output_train_parquet, index=False)
    if output_test_parquet:
        test_df.to_parquet(output_test_parquet, index=False)


if __name__ == "__main__":
    app()
