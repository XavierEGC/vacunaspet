@echo off
cd /d "%~dp0"

echo ===================================
echo   SUBIENDO CAMBIOS A GITHUB
echo ===================================
echo.

git add .

set /p mensaje="Describe brevemente el cambio (Enter para usar fecha/hora): "

if "%mensaje%"=="" (
    set mensaje=Actualizacion %date% %time%
)

git commit -m "%mensaje%"
git push

echo.
echo ===================================
echo   LISTO
echo ===================================
pause
