# Activate the virtual environment (PowerShell version)
. .\venv\Scripts\Activate.ps1

# Just start the server — config is handled in Python
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
