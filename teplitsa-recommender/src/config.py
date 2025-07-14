from pathlib import Path
from zoneinfo import ZoneInfo

import yaml
from pydantic import BaseModel, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Secrets(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    dgis_key: SecretStr
    openweather_key: SecretStr


class Config(BaseModel):
    dgis_base_url: str
    openweather_base_url: str
    history_json: Path

    uvicorn_host: str
    uvicorn_port: int
    uvicorn_workers: int
    uvicorn_reload: bool


def load_config() -> Config:
    with open("./config.yaml") as f:
        raw = yaml.safe_load(f)

    return Config(**raw)


timezone = ZoneInfo("Asia/Novosibirsk")

config = load_config()
secrets = Secrets()
