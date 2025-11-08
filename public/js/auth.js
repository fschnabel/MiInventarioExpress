const form = document.getElementById('fLogin');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(form);
  const body = Object.fromEntries(fd.entries());
  const r = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(body)
  });
  if (r.ok) location.href = '/products.html';
  else document.getElementById('error').textContent = 'Usuario o clave inválidos';
});
