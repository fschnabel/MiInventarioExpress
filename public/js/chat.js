(async () => {
  // 1) Obtener mi usuario desde la sesión
  const meRes = await fetch('/api/auth/me');
  const me = await meRes.json();
  const usuario = me?.usuario || 'Anon';
  document.getElementById('yo').textContent = usuario || 'Anon';

  // 2) Conectar Socket.io
  const socket = io(); // mismo host/puerto

  const ul = document.getElementById('msgs');
  const input = document.getElementById('m');
  const sendBtn = document.getElementById('send');

  function addMsg(m) {
    const li = document.createElement('li');
    li.textContent = `[${m.hora}] ${m.usuario}: ${m.texto}`;
    ul.appendChild(li);
    ul.scrollTop = ul.scrollHeight;
  }

  // 3) Enviar mensaje
  function enviar() {
    const texto = (input.value || '').trim();
    if (!texto) return;
    socket.emit('chat:msg', { usuario, texto });
    input.value = '';
    input.focus();
  }

  sendBtn.addEventListener('click', enviar);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') enviar();
  });

  // 4) Recibir mensajes
  socket.on('chat:msg', (m) => addMsg(m));
})();
