(() => {
  const msgs = document.getElementById('msgs');
  const form = document.getElementById('fChat');
  const texto = document.getElementById('texto');
  const socket = io();

  function escapeHtml(s='') {
    return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function addMsg({ usuario, texto, ts, hora }) {
    const time = hora || (ts ? new Date(ts).toLocaleTimeString() : '');
    const el = document.createElement('div');
    el.style.marginBottom = '8px';
    el.innerHTML = `<strong>${escapeHtml(usuario)}</strong> <small>${time}</small><br>${escapeHtml(texto)}`;
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
  }

  // historial (si montaste /api/chat/historial)
  fetch('/api/chat/historial').then(r => r.json()).then(arr => arr.forEach(addMsg)).catch(()=>{});

  // recibir mensajes
  socket.on('chat:msg', addMsg);

  // enviar
  form.addEventListener('submit', e => {
    e.preventDefault();
    const txt = (texto.value || '').trim();
    if (!txt) return;
    socket.emit('chat:msg', { texto: txt }); // el server le pone el usuario desde sesión
    texto.value = '';
  });
})();
