const $ = (s) => document.querySelector(s);
const tbody = $('#tbl tbody');
const f = $('#fProd');
const msg = $('#msg');
const logoutBtn = $('#logout');

async function load() {
  const r = await fetch('/api/productos');

  if (r.status === 401) {
    return location.href = '/login.html';
  }

  const items = await r.json();

  tbody.innerHTML = items.map(it => `
    <tr data-id="${it._id}">
      <td>${it.imagen ? `<img src="${it.imagen}" width="64">` : ''}</td>
      <td>${it.nombre}</td>
      <td>${parseFloat(it.precio).toFixed(2)}</td>
      <td>
        <button class="edit">Editar</button>
        <button class="del">Eliminar</button>
      </td>
    </tr>
  `).join('');
}

f.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg.textContent = ""; // limpiar mensajes previos

  const fd = new FormData(f);
  const id = f.elements['id'].value;
  const method = id ? 'PUT' : 'POST';
  const url = id ? `/api/productos/${id}` : '/api/productos';

  try {
    const r = await fetch(url, { method, body: fd });
    const data = await r.json().catch(() => ({}));

    if (!r.ok) {
      if (data.error) msg.textContent = data.error;
      if (Array.isArray(data.errores)) {
        msg.textContent = data.errores.map(e => e.mensaje).join(" • ");
      }
      return;
    }

    msg.classList.remove("err");
    msg.classList.add("ok");
    msg.textContent = id ? "✅ Producto actualizado" : "✅ Producto creado";

    f.reset();
    f.elements['id'].value = "";
    load();

  } catch (err) {
    console.error(err);
    msg.textContent = "No se pudo contactar al servidor.";
  }
});

// Editar y eliminar
tbody.addEventListener('click', async (e) => {
  const tr = e.target.closest('tr');
  if (!tr) return;
  const id = tr.dataset.id;

  if (e.target.classList.contains('edit')) {
    f.elements['id'].value = id;
    f.elements['nombre'].value = tr.children[1].textContent;
    f.elements['precio'].value = tr.children[2].textContent;
  }

  if (e.target.classList.contains('del')) {
    if (!confirm('¿Eliminar?')) return;
    await fetch(`/api/productos/${id}`, { method: 'DELETE' });
    tr.remove();
  }
});

logoutBtn.addEventListener('click', async () => {
  await fetch('/api/auth/logout', { method: 'POST' });
  location.href = '/login.html';
});

load();
