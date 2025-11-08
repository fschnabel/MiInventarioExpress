require('dotenv').config();
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const conectarDB = require('./config/db');

const app = express();

// Middlewares base
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Sesiones
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecreto',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { maxAge: 1000*60*60*2 }
}));

// Rutas (MVC)
app.use('/api/auth', require('./routes/auth.rutas'));

// Vista raíz
app.get('/', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// Arranque
(async () => {
  await conectarDB(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/miinventario');
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`🚀 http://localhost:${port}`));
})();
