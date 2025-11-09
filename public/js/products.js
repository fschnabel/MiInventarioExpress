const $ = (s) => document.querySelector(s);
const tbody = $('#tbl tbody');
const f = $('#fProd');
const msg = $('#msg');

async function load() {
  const r = await fetch('/api/productos');
  if (r.status === 401) return location.href = '/login.html';
  const items = await r.json();
  tbody.innerHTML = items.map(it => `
    <tr data-id="${it._id}">
      <td>${it.imagen ? `<img src="${it.imagen}" width="64">` : ''}</td>
      <td>${it.nombre}</td>
      <td>${Number(it.precio).toFixed(2)}</td>
      <td>
        <button class="edit">Editar</button>
        <button class="del">Eliminar</button>
      </td>
    </tr>
  `).join('');
}
load();

f.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = f.elements['id'].value;
  const fd = new FormData(f);
  const method = id ? 'PUT' : 'POST';
  const url = id ? `/api/productos/${id}` : '/api/productos';
  const r = await fetch(url, { method, body: fd });
  if (!r.ok) return msg.textContent = 'Error al guardar';
  msg.textContent = id ? 'Actualizado ✓' : 'Creado ✓';
  f.reset(); f.elements['id'].value = '';
  load();
});

tbody.addEventListener('click', async (e) => {
  const tr = e.target.closest('tr'); if (!tr) return;
  const id = tr.dataset.id;

  if (e.target.classList.contains('edit')) {
    f.elements['id'].value = id;
    f.elements['nombre'].value = tr.children[1].textContent;
    f.elements['precio'].value = tr.children[2].textContent;
  }

  if (e.target.classList.contains('del')) {
    if (!confirm('¿Eliminar?')) return;
    const r = await fetch(`/api/productos/${id}`, { method: 'DELETE' });
    if (r.ok) tr.remove();
  }
});

$('#logout').addEventListener('click', async () => {
  await fetch('/api/auth/logout', { method: 'POST' });
  location.href = '/login.html';
});
