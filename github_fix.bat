@echo off
echo ==========================================
echo Lemar Bistro - GitHub Hata Duzeltici
echo ==========================================
echo.

echo 1. Git altyapisi sifirlaniyor...
rmdir /s /q .git

echo 2. Git yeniden baslatiliyor...
call git init

echo 3. Tum dosyalar ekleniyor...
call git add .

echo 4. Paketleme (Commit) yapiliyor...
call git commit -m "Versiyon 1.0 - Full Yukleme"

echo 5. Ana dal 'main' olarak ayarlaniyor...
call git branch -M main

echo 6. Sunucu adresi ayarlaniyor...
call git remote add origin https://github.com/pyroid-tuberz/coffe.git

echo.
echo ==========================================
echo HAZIR! Simdi yukleme deneniyor...
echo ==========================================
echo.
call git push -f origin main

echo.
echo Islem bitti. Eger hala hata varsa ekran goruntusu atabilirsin.
pause
