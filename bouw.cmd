@echo off
rem Bouwt de website opnieuw in de map "site" en controleert het menu tegen de pdf.
cd /d "%~dp0"
node build.mjs
if errorlevel 1 goto einde
echo.
node tools\controleer-menu.mjs
:einde
echo.
pause
