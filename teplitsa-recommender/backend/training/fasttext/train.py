import fasttext
import pandas as pd
import typer
from sklearn.metrics import classification_report

app = typer.Typer()


@app.command()
def train(dataset: str, output: str):
    model = fasttext.train_supervised(
        input=dataset, epoch=50, lr=1.0, wordNgrams=3, loss="softmax"
    )

    model.save_model(output)


@app.command()
def evaluate(model_path: str, test_dataset: str, test_parquet: str = None):
    model = fasttext.load_model(model_path)
    if test_parquet is None:
        total, precision, recall = model.test(test_dataset)
        print(f"Samples: {total}")
        print(f"Precision: {precision:.4f}")
        print(f"Recall (macro F1): {recall:.4f}")
    else:
        df = pd.read_parquet(test_parquet)
        texts = df["question"].tolist()
        true_labels = df["label"].tolist()
        pred_labels = []
        for text in texts:
            labels, _ = model.predict(text)
            label_str = labels[0].replace("__label__", "")
            pred_labels.append(1 if label_str == "technical" else 0)
        print(
            classification_report(
                true_labels, pred_labels, target_names=["relevant", "technical"]
            )
        )


if __name__ == "__main__":
    app()
