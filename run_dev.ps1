# TripPilot Agent Development Launcher
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  Starting TripPilot Agent (Dev Mode)          " -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# 1. Start Backend in separate process
Write-Host "`n[1/2] Launching FastAPI Backend on http://localhost:8000 ..." -ForegroundColor Green
$backendProcess = Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; .\venv\Scripts\Activate.ps1; python -m uvicorn app.main:app --reload --port 8000" -PassThru

Start-Sleep -Seconds 2

# 2. Start Frontend
Write-Host "`n[2/2] Launching React Frontend on http://localhost:5173 ..." -ForegroundColor Green
Set-Location -Path "$PSScriptRoot\frontend"
npm run dev
