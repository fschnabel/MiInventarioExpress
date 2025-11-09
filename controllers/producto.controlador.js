const Producto = require('../models/Producto');

exports.listar = async (_req, res) => {
  const items = await Producto.find().sort({ fechaCreacion: -1 });
  res.json(items);
};

exports.crear = async (req, res) => {
  const { nombre, precio, descripcion } = req.body;
  if (!nombre || precio == null) return res.status(400).json({ error: 'Nombre y precio son requeridos' });
  const imagen = req.file ? `/uploads/${req.file.filename}` : '';
  const saved = await Producto.create({ nombre, precio, descripcion, imagen });
  res.status(201).json(saved);
};

exports.actualizar = async (req, res) => {
  const { nombre, precio, descripcion } = req.body;
  const update = { nombre, precio, descripcion };
  if (req.file) update.imagen = `/uploads/${req.file.filename}`;
  const saved = await Producto.findByIdAndUpdate(req.params.id, update, { new: true });
  res.json(saved);
};

exports.eliminar = async (req, res) => {
  await Producto.findByIdAndDelete(req.params.id);
  res.status(204).end();
};
