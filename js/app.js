(() => {
  window.ELR = window.ELR || {};
  window.ELR.escape = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  window.normalizeEgyptianPhone = value => {
    let phone = String(value || '').replace(/[\s()\-]/g, '');
    if (phone.startsWith('00')) phone = '+' + phone.slice(2);
    if (phone.startsWith('01')) phone = '+20' + phone.slice(1);
    if (/^20(10|11|12|15)\d{8}$/.test(phone)) phone = '+' + phone;
    return phone;
  };
  window.requireAuth = async function (admin=false) {
    if (!window.elrfaeySupabase) {
      alert('اربط Supabase من js/supabase-config.js أولًا.');
      return null;
    }
    const {data,error} = await window.elrfaeySupabase.auth.getUser();
    if (error || !data?.user) {
      location.href = admin ? '../elrfaey/login.html?admin=1' : 'login.html';
      return null;
    }
    if (admin) {
      const {data: p, error: pe} = await window.elrfaeySupabase.from('profiles').select('role,full_name').eq('id',data.user.id).single();
      if (pe || p?.role !== 'admin') { alert('هذه الصفحة متاحة للإدارة فقط.'); location.href='../elrfaey/dashboard.html'; return null; }
      window.currentProfile=p;
    }
    return data.user;
  };
  window.toast = (msg, ok=true) => { const el=document.getElementById('toast'); if(el){el.textContent=msg;el.className='toast show '+(ok?'ok':'bad');setTimeout(()=>el.className='toast',3000);} else alert(msg); };
  window.formatDate = value => value ? new Intl.DateTimeFormat('ar-EG',{dateStyle:'medium',timeStyle:'short'}).format(new Date(value)) : '—';
  window.signOut = async () => { if(window.elrfaeySupabase) await window.elrfaeySupabase.auth.signOut(); location.href='../elrfaey/login.html'; };
})();