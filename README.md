# حدوتة إعلامية

موقع عربي للتعريف بتاريخ الإعلام المصري، من الصحافة والإذاعة إلى التلفزيون والإعلام الرقمي.

## تشغيل الموقع محليًا

افتح `index.html` في المتصفح. الموقع ثابت ولا يحتاج إلى تثبيت حزم أو تشغيل خادم.

## النشر على GitHub Pages

1. أنشئ مستودعًا عامًا باسم `hadouta-elamia` على GitHub، واترك خيار إضافة README أو ملفات أخرى غير محدد.
2. من مجلد المشروع، اربط المستودع وارفع الملفات:

   ```powershell
   git remote add origin https://github.com/USERNAME/hadouta-elamia.git
   git push -u origin main
   ```

   استبدل `USERNAME` باسم حسابك. إذا كان للمشروع remote باسم `origin`، استخدم `git remote set-url origin https://github.com/USERNAME/hadouta-elamia.git` بدلًا من أمر الإضافة.
3. من إعدادات المستودع افتح **Settings → Pages**، واجعل مصدر النشر **GitHub Actions** إذا لم يكن محددًا تلقائيًا.
4. بعد نجاح سير العمل **Deploy to GitHub Pages** في تبويب **Actions**، سيظهر رابط الموقع في **Settings → Pages**. غالبًا سيكون `https://USERNAME.github.io/hadouta-elamia/`.

ملف `.github/workflows/pages.yml` ينشر الموقع تلقائيًا عند كل دفع إلى فرع `main`.

## التعديل والمحتوى

- النصوص: `index.html`.
- التنسيق: `style.css`.
- التفاعلات وروابط التواصل والبريد: `script.js`.
- الصور: مجلد `images/`.
- دليل تعديل المحتوى والصور: `README.txt`.

لا تضع كلمات مرور أو مفاتيح وصول أو بيانات سرية في ملفات المستودع. الصور الحالية تعبيرية أو بدائل مؤقتة؛ راجع مصادرها وحقوق استخدامها قبل النشر العام.
