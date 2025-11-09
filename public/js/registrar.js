const form = document.getElementById("fReg");
const usuario = document.getElementById("usuario");
const clave = document.getElementById("clave");
const errorMsg = document.getElementById("error");
const successMsg = document.getElementById("success");
const eUsuario = document.getElementById("eUsuario");
const eClave = document.getElementById("eClave");
const toggle = document.getElementById("toggle");

toggle.addEventListener("click", () => {
  clave.type = clave.type === "password" ? "text" : "password";
  toggle.textContent = clave.type === "password" ? "👁️" : "🙈";
});

function clearMessages() {
  errorMsg.textContent = "";
  successMsg.textContent = "";
  eUsuario.textContent = "";
  eClave.textContent = "";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearMessages();

  const body = {
    usuario: usuario.value.trim(),
    clave: clave.value
  };

  const r = await fetch("/api/auth/registrar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await r.json().catch(() => ({}));

  if (r.status === 201 && data.ok) {
    successMsg.textContent = `✅ Usuario creado: ${data.usuario}`;
    form.reset();
    return;
  }

  if (Array.isArray(data.errores)) {
    data.errores.forEach(err => {
      if (err.campo === "usuario") eUsuario.textContent = err.mensaje;
      if (err.campo === "clave") eClave.textContent = err.mensaje;
    });
    errorMsg.textContent = data.errores.map(e => e.mensaje).join(" • ");
    return;
  }

  if (data.error) {
    errorMsg.textContent = data.error;
    return;
  }

  errorMsg.textContent = "Error inesperado";
});
