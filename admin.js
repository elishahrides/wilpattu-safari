const adminSupabase=window.sbClient||window.supabase?.createClient?.(window.WILPATTU_SUPABASE_URL,window.WILPATTU_SUPABASE_ANON_KEY);
const loginPanel=document.getElementById('adminLogin');
const dashboard=document.getElementById('adminDashboard');
const loginForm=document.getElementById('adminLoginForm');
const loginMsg=document.getElementById('loginMsg');
const rows=document.getElementById('bookingRows');
const empty=document.getElementById('emptyBookings');
const filter=document.getElementById('statusFilter');
const count=document.getElementById('bookingCount');
const identity=document.getElementById('adminIdentity');
function esc(v){return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;')}
function msg(text,error=false){loginMsg.textContent=text;loginMsg.className='admin-msg '+(error?'admin-error':'admin-success')}
function showDashboard(user){loginPanel.hidden=true;dashboard.hidden=false;identity.textContent=`Signed in as ${user.email||'admin'}`;loadBookings()}
async function loadBookings(){
  rows.innerHTML='';empty.hidden=true;
  let q=adminSupabase.from('safari_bookings').select('*').order('created_at',{ascending:false});
  if(filter.value!=='all')q=q.eq('status',filter.value);
  const {data,error}=await q;
  if(error){rows.innerHTML=`<tr><td colspan="7" class="admin-error">${esc(error.message)}</td></tr>`;count.textContent='';return}
  count.textContent=`${data?.length||0} request${(data?.length||0)===1?'':'s'}`;
  if(!data?.length){empty.hidden=false;return}
  rows.innerHTML=data.map(b=>{
    const created=b.created_at?new Date(b.created_at).toLocaleString():'';
    return `<tr>
      <td><b><span class="new-dot"></span>${esc(b.reference)}</b><small>${esc(b.notes||'')}</small></td>
      <td><b>${esc(b.experience)}</b><small>${esc(b.safari_date)}</small></td>
      <td><b>${esc(b.customer_name)}</b><small>${esc(b.guests)} passenger${Number(b.guests)===1?'':'s'}</small></td>
      <td><a href="https://wa.me/${String(b.whatsapp||'').replace(/\D/g,'')}" target="_blank" rel="noopener">${esc(b.whatsapp)}</a></td>
      <td>${esc(b.pickup||'—')}</td>
      <td><select class="status-select" data-id="${esc(b.id)}"><option value="pending" ${b.status==='pending'?'selected':''}>Pending</option><option value="confirmed" ${b.status==='confirmed'?'selected':''}>Confirmed</option><option value="completed" ${b.status==='completed'?'selected':''}>Completed</option><option value="cancelled" ${b.status==='cancelled'?'selected':''}>Cancelled</option></select><small class="status ${esc(b.status||'pending')}">${esc(b.status||'pending')}</small></td>
      <td>${esc(created)}</td>
    </tr>`}).join('');
  rows.querySelectorAll('.status-select').forEach(s=>s.addEventListener('change',async()=>{
    const {error}=await adminSupabase.from('safari_bookings').update({status:s.value}).eq('id',s.dataset.id);
    if(error){alert(error.message);loadBookings();return}loadBookings();
  }));
}
loginForm?.addEventListener('submit',async e=>{e.preventDefault();msg('Signing in…');const fd=new FormData(loginForm);const {data,error}=await adminSupabase.auth.signInWithPassword({email:String(fd.get('email')).trim(),password:String(fd.get('password'))});if(error){msg(error.message,true);return}showDashboard(data.user)});
document.getElementById('logoutBtn')?.addEventListener('click',async()=>{await adminSupabase.auth.signOut();dashboard.hidden=true;loginPanel.hidden=false;loginForm.reset();msg('Signed out.')});
document.getElementById('refreshBtn')?.addEventListener('click',loadBookings);filter?.addEventListener('change',loadBookings);
(async()=>{if(!adminSupabase){msg('Supabase is not configured.',true);return}const {data}=await adminSupabase.auth.getSession();if(data.session)showDashboard(data.session.user)})();
