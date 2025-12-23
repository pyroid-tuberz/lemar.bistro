@echo off
echo ==========================================
echo Lemar Bistro - GitHub Yukleme Aracina Hosgeldiniz
echo ==========================================
echo.

echo 1. Git baslatiliyor...
call git init

echo 2. Dosyalar ekleniyor...
call git add .

echo 3. Kayit olusturuluyor...
call git commit -m "Lemar Bistro V1 Deployment"

echo 4. Ana dal olusturuluyor...
call git branch -M main

echo 5. Uzak sunucu baglaniyor (https://github.com/pyroid-tuberz/coffe.git)...
call git remote remove origin 2>nul
call git remote add origin https://github.com/pyroid-tuberz/lemar.bistro.git

echo.
echo ==========================================
echo HAZIR! Simdi yukleme baslayacak.
echo Lutfen acilan pencerede GitHub girisi yapin.
echo ==========================================
echo.
call git push -u origin main --force

echo.
echo Islem tamamlandi. Bir hata varsa yukarida yazacaktir.
pause
