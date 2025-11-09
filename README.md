# 🛒 MiInventarioExpress
Aplicación web con Node.js + Express + MongoDB utilizando MVC + Chat en tiempo real con Socket.IO

## 👤 Autor
**Nombre:** Francisco Schnabel  
**Materia:** Aplicaciones Web  
**Universidad:** Universidad Politécnica Salesiana  
**Unidad:** Unidad 2 – Programación del lado del servidor  

---

## 📌 Descripción del proyecto

Este proyecto es una aplicación web completa desarrollada para la **Actividad de la Unidad 2**, cuyo objetivo es aplicar programación del lado del servidor utilizando:

- Node.js
- Express
- MongoDB + Mongoose
- Handlebars (plantillas HTML)
- Multer (carga de imágenes)
- Socket.IO (chat en tiempo real)
- express-session (manejo de sesiones)
- bcrypt (cifrado de contraseñas)
- express-validator (validación de formularios)

Permite gestionar productos (CRUD), autenticación de usuarios y chat entre usuarios logueados.

---

## ✅ Funcionalidades realizadas

| Funcionalidades
|----------------
| Crear repositorio en GitHub con commits separados 
| Estructura MVC (models, views, controllers, routes) 
| CRUD completo para productos 
| Subida de imágenes con Multer 
| Autenticación con sesiones + bcrypt 
| Validaciones con `express-validator` 
| Vistas con Handlebars y layout principal 
| Chat en tiempo real con Socket.IO 
| Estilos visuales CSS 

---

## 🧱 Estructura del proyecto

```
MiInventarioExpress/
│── config/
│── controllers/
│── models/
│── routes/
│── views/
│── uploads/
│── public/
│── server.js
└── README.md
```

---

## 🚀 Instalación

### 1️⃣ Clonar repositorio
```sh
git clone https://github.com/fschnabel/MiInventarioExpress.git
```

### 2️⃣ Instalar dependencias
```sh
npm install
```

### 3️⃣ Configurar `.env`
```
MONGO_URI=mongodb://127.0.0.1:27017/miinventario
SESSION_SECRET=supersecreto
```

### 4️⃣ Ejecutar
```sh
npm start
```

Abrir navegador en:

```
http://localhost:3000
```

---

## ✨ Tecnologías utilizadas

| Tecnología | Uso |
|------------|-----|
| Node.js | Backend |
| Express | Servidor y rutas |
| MongoDB + Mongoose | Base de datos |
| Multer | Carga de imágenes |
| Handlebars | Plantillas HTML |
| Socket.IO | Chat en tiempo real |
| bcrypt | Hash de contraseñas |
| express-session | Manejo de sesiones |
| express-validator | Validación de formularios |

