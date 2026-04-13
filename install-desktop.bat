@echo off
setlocal
cd /d "%~dp0"
set "LAUNCHPAD_EXE=%~dp0bin\A3MissionLaunchpad.exe"
set "LAUNCHPAD_WORK=%~dp0bin"
if not exist "%LAUNCHPAD_EXE%" (
  echo ERROR: Missing packaged app. Build first: package.bat
  exit /b 1
)
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ws = New-Object -ComObject WScript.Shell; ^
   $path = Join-Path ([Environment]::GetFolderPath('Desktop')) 'A3 Mission Launchpad.lnk'; ^
   $s = $ws.CreateShortcut($path); ^
   $s.TargetPath = $env:LAUNCHPAD_EXE; ^
   $s.WorkingDirectory = $env:LAUNCHPAD_WORK; ^
   $s.Description = 'A3 Mission Launchpad'; ^
   $s.Save(); ^
   Write-Host ('Shortcut: ' + $path)"
exit /b 0
