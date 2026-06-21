@echo off
echo Iniciando VacunasPet...

start "BACKEND" cmd /k "cd /d C:\Users\xavie\Desktop\UPN\SOLUCIONES WEB Y APLI. DIST. - 226513.5447\vacunaspet\backend\backend && mvnw.cmd spring-boot:run"

timeout /t 5

start "FRONTEND" cmd /k "cd /d C:\Users\xavie\Desktop\UPN\SOLUCIONES WEB Y APLI. DIST. - 226513.5447\vacunaspet\frontend && ng serve"

echo Backend y Frontend iniciados en ventanas separadas.