# ELRFAEY FINAL — التشغيل مرة واحدة

## 1) Supabase
أنشئ مشروع Supabase جديدًا.

## 2) Authentication
Authentication → Providers → Phone → فعّل Phone.
للاختبار يمكن إيقاف Phone Confirmation، وللإطلاق استخدم مزود SMS مناسب.

## 3) Database + Storage
افتح SQL Editor والصق **كل** ملف `supabase/schema.sql` ثم Run.
هذا ينشئ الجداول والصلاحيات وStorage ودوال تصحيح الامتحان.

## 4) مفاتيح المشروع
تم تجهيز `js/supabase-config.js` في هذه النسخة ببيانات مشروع Supabase الذي تم اختياره.
إذا أعدت استخدام المشروع مع مشروع Supabase آخر، غيّر القيم في هذا الملف إلى Project URL وPublishable key الخاصين بالمشروع الجديد.

ممنوع وضع `service_role` أو Secret key داخل الموقع.

## 5) أول Admin
سجّل حسابًا عاديًا من `elrfaey/register.html`، ثم نفّذ في SQL Editor:

```sql
update public.profiles set role='admin' where phone='+2010XXXXXXXX';
```

بعدها افتح `admin/index.html`.

## 6) بعد ذلك
لن تحتاج تعديل الملفات في كل مرة. الإدارة تتم من لوحة Admin:
- إضافة/حذف فيديوهات وصور ورفع الملفات إلى Storage.
- إنشاء ونشر الامتحانات.
- إضافة الأسئلة من قاعدة البيانات/واجهة الامتحان.
- قبول/رفض طلبات فتح المحتوى.
- مشاهدة النتائج والطلاب.

### إضافة أسئلة امتحان
من SQL Editor يمكن إضافة مجموعة أسئلة مثل:
```sql
insert into public.exam_questions(exam_id,question,options,correct_index,sort_order)
values
(1,'2 + 2 = ؟','["3","4","5","6"]'::jsonb,1,0),
(1,'عاصمة مصر؟','["القاهرة","الإسكندرية","طنطا","أسوان"]'::jsonb,0,1);
```
الطالب لا يحصل على `correct_index`؛ التصحيح يتم داخل Supabase عبر `submit_exam`.
