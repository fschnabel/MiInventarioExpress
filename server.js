require('dotenv').config();
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const conectarDB = require('./config/db');

const http = require('http');
const { Server } = require('socket.io');

const { asegurarSesion } = require('./middleware/auth');

const app = express();

const httpServer = http.createServer(app);         
const io = new Server(httpServer);            

const exphbs = require('express-handlebars');

const ChatMensaje = require('./models/ChatMensaje');

app.engine('hbs', exphbs.engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir:  path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials'),
  helpers: {
    moneda: v => Number(v || 0).toFixed(2),
    or: (a,b) => a || b,
    eq: (a,b) => a == b,
    not: v => !v
  }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares base
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Sesiones
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'supersecreto',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { maxAge: 1000*60*60*2 }
});
app.use(sessionMiddleware);

// ...después de crear io:
io.engine.use((req, res, next) => sessionMiddleware(req, res, next));

// Rutas (MVC)
app.use('/api/auth', require('./routes/auth.rutas'));
app.use('/api/productos', require('./routes/producto.rutas'));

app.get('/v/chat', asegurarSesion, (_req, res) => {
  res.render('chat', { title: 'Chat' });
});


// Vista raíz
app.get('/', (req, res) => {
  if (req.session?.userId) return res.redirect('/v/productos');
  res.render('index', { title: 'Inicio' });
});



app.use((err, req, res, next) => {
  console.error("[ERROR GLOBAL]", err);
  res.status(500).json({ ok: false, error: "Error interno del servidor" });
});

app.use(require('./routes/vistas.rutas')); // después de sesiones y estáticos

app.use('/api/chat', require('./routes/chat.rutas'));




io.on('connection', (socket) => {
  const usuario = socket.request?.session?.usuario || 'anónimo';
  console.log('🟢 [WS] Cliente conectado:', socket.id, 'usuario=', usuario);

  socket.on('chat:msg', async (payload) => {
    const texto = (payload?.texto || '').toString().slice(0, 500).trim();
    if (!texto) return;

    const msg = { usuario, texto, ts: new Date() };

    try { await ChatMensaje.create(msg); } catch (e) { console.error('CHAT save err:', e); }

    io.emit('chat:msg', { ...msg, hora: msg.ts.toLocaleTimeString() });
  });

  socket.on('disconnect', () => {
    console.log('🔴 [WS] Cliente desconectado:', socket.id);
  });
});


// Arranque
(async () => {
  await conectarDB(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/miinventario');
  const port = process.env.PORT || 3000;
  httpServer.listen(port, () => console.log(`🚀 http://localhost:${port}`));
})();