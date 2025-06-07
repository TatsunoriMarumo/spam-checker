"""
Tatsunori Marumo
A01327744
"""

import os
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)


class Settings:
    BASE_URL: str = os.getenv("BASE_URL")
    ACCESS_TOKEN: str = os.getenv("ACCESS_TOKEN")
    USER_NAME: str = os.getenv("USER_NAME")
    PLAIN_MODEL: str = os.getenv("PLAIN_MODEL")
    WEIGHTED_MODEL: str = os.getenv("WEIGHTED_MODEL")


settings = Settings()


def main():
    pass


if __name__ == '__main__':
    main()
