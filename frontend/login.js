// Simple client-side login/register helper
document.addEventListener('DOMContentLoaded', ()=>{
  const showLogin = document.getElementById('show-login');
  const showRegister = document.getElementById('show-register');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const regRole = document.getElementById('reg-role');
  const studentExtra = document.getElementById('student-extra');

  showLogin.addEventListener('click', ()=>{
    loginForm.style.display = '';
    registerForm.style.display = 'none';
    showLogin.style.background = '#0b5ed7'; showLogin.style.color = '#fff';
    showRegister.style.background = '#eee'; showRegister.style.color = '#333';
  });
  showRegister.addEventListener('click', ()=>{
    loginForm.style.display = 'none';
    registerForm.style.display = '';
    showRegister.style.background = '#0b5ed7'; showRegister.style.color = '#fff';
    showLogin.style.background = '#eee'; showLogin.style.color = '#333';
  });

  regRole.addEventListener('change', ()=>{
    if(regRole.value === 'student') studentExtra.style.display = '';
    else studentExtra.style.display = 'none';
  });

  // Login submit
  loginForm.addEventListener('submit', async (ev)=>{
    ev.preventDefault();
    const u = document.getElementById('login-username').value.trim();
    const p = document.getElementById('login-password').value;
    const role = document.getElementById('login-role').value;
    const msg = document.getElementById('login-msg');
    msg.textContent = 'Signing in...';
    try{
      const res = await fetch('/api/auth/login', {method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({username:u,password:p})});
      const data = await res.json();
      if(!res.ok) throw new Error(data.error || 'Login failed');
      localStorage.setItem('dbt_token', data.token);
      localStorage.setItem('dbt_user', JSON.stringify(data.user));
      msg.textContent = 'Login successful. You can now close this page.';
    }catch(err){
      console.error(err);
      msg.textContent = 'Login failed: ' + err.message;
    }
  });

  // Register submit
  registerForm.addEventListener('submit', async (ev)=>{
    ev.preventDefault();
    const role = document.getElementById('reg-role').value;
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value;
    const name = document.getElementById('reg-name').value;
    const aadhaar = document.getElementById('reg-aadhaar').value;
    const fatherName = document.getElementById('reg-fatherName').value;
    const fatherAadhaar = document.getElementById('reg-fatherAadhaar').value;
    const schoolId = document.getElementById('reg-schoolId').value;
    const msg = document.getElementById('reg-msg');
    msg.textContent = 'Registering...';
    try{
      const payload = { username, password, role };
      if(role === 'student') Object.assign(payload, { name, aadhaar, fatherName, fatherAadhaar, schoolId });
      const res = await fetch('/api/auth/register', {method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(payload)});
      const data = await res.json();
      if(!res.ok) throw new Error(data.error || 'Registration failed');
      localStorage.setItem('dbt_token', data.token);
      localStorage.setItem('dbt_user', JSON.stringify(data.user));
      msg.textContent = 'Registered and logged in.';
    }catch(err){
      console.error(err);
      msg.textContent = 'Registration failed: ' + err.message;
    }
  });
});
