const stage = document.getElementById('stage'), grade = document.getElementById('grade');
const grades = {
  'ابتدائية':['الأول الابتدائي','الثاني الابتدائي','الثالث الابتدائي','الرابع الابتدائي','الخامس الابتدائي','السادس الابتدائي'],
  'إعدادية':['الأول الإعدادي','الثاني الإعدادي','الثالث الإعدادي'],
  'ثانوية':['الأول الثانوي','الثاني الثانوي','الثالث الثانوي']
};
function fillGrades(){if(!grade)return;grade.innerHTML='<option value="">اختار الصف</option>';(grades[stage?.value]||[]).forEach(g=>grade.insertAdjacentHTML('beforeend',`<option value="${window.ELR.escape(g)}">${window.ELR.escape(g)}</option>`));grade.disabled=!stage?.value;}
stage?.addEventListener('change',fillGrades); fillGrades();
function msg(t,ok=false){const e=document.getElementById('authMsg');if(e){e.textContent=t;e.className='auth-msg '+(ok?'ok':'bad');}}
function validName(n){return n.split(/\s+/).filter(Boolean).length===4;}
function validPass(p){return /^[A-Za-z0-9]{20}$/.test(p);}
async function passEmail(password){const bytes=new TextEncoder().encode(password);const hash=await crypto.subtle.digest('SHA-256',bytes);const hex=[...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,'0')).join('');return `student_${hex}@accounts.elrfaey.local`;}
async function ready(){if(!window.elrfaeySupabase){msg('ضع بيانات Supabase في js/supabase-config.js');return false}return true;}

document.getElementById('registerForm')?.addEventListener('submit',async e=>{
 e.preventDefault(); if(!(await ready()))return;
 const name=document.getElementById('fullName').value.trim(),p=document.getElementById('password').value,g=grade?.value||'',s=stage?.value||'';
 if(!validName(name)){msg('اكتب الاسم الرباعي كاملًا، 4 أسماء.');return}
 if(!s||!g){msg('اختار المرحلة والصف الدراسي.');return}
 if(!validPass(p)){msg('كلمة السر لازم تكون 20 حرف أو رقم بالضبط، بدون رموز.');return}
 msg('جاري إنشاء الحساب...');
 const email=await passEmail(p);
 const {data,error}=await window.elrfaeySupabase.auth.signUp({email,password:p,options:{data:{full_name:name,stage:s,grade:g}}});
 if(error){console.error(error);msg(error.message?.includes('already')?'كلمة السر دي مستخدمة بالفعل، اختار كلمة سر مختلفة.':'لم يتم إنشاء الحساب: '+(error.message||'خطأ غير معروف'));return}
 if(data.session){msg('تم إنشاء الحساب وتسجيل الدخول بنجاح.',true);location.href='dashboard.html';}
 else msg('تم إنشاء الحساب. تأكد من إيقاف Email Confirmation في Supabase حتى يتم الدخول مباشرة.',true);
});

document.getElementById('loginForm')?.addEventListener('submit',async e=>{
 e.preventDefault(); if(!(await ready()))return;
 const password=document.getElementById('loginPass').value;
 if(!validPass(password)){msg('اكتب كلمة السر المكونة من 20 حرف أو رقم.');return}
 msg('جاري تسجيل الدخول...');
 const email=await passEmail(password);
 const {data,error}=await window.elrfaeySupabase.auth.signInWithPassword({email,password});
 if(error){console.error(error);msg('كلمة السر غير صحيحة أو الحساب غير موجود.');return}
 location.href=new URLSearchParams(location.search).has('admin')?'../admin/index.html':'dashboard.html';
});
