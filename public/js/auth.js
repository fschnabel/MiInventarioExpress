const form = document.getElementById('fLogin');
const errorMsg = document.getElementById('error');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorMsg.textContent = ""; // limpiar errores

  const fd = new FormData(form);
  const body = Object.fromEntries(fd.entries());

  try {
    const r = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(body)
    });

    const data = await r.json();

    if (r.ok && data.ok) {
      return location.href = '/products.html';
    }

    // Mostrar error general (credenciales inválidas)
    if (data.error) {
      errorMsg.textContent = data.error;
    }

    // Mostrar errores de express-validator
    if (Array.isArray(data.errores)) {
      errorMsg.textContent = data.errores.map(e => e.mensaje).join(" • ");
    }

  } catch (err) {
    console.error(err);
    errorMsg.textContent = "No se pudo contactar al servidor.";
  }
});
