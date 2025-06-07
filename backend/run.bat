@echo off
call venv\Scripts\activate.bat

REM Just start the server — config is handled in Python
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

pause
