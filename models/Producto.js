const { Schema, model } = require('mongoose');

const ProductoSchema = new Schema({
  nombre: { type: String, required: true, trim: true },
  precio: { type: Number, required: true, min: 0 },
  descripcion: { type: String, default: '' },
  imagen: { type: String, default: '' },
  fechaCreacion: { type: Date, default: Date.now }
}, { versionKey: false });

ProductoSchema.index({ fechaCreacion: -1 }, { name: 'idx_productos_fecha_desc' });

module.exports = model('Producto', ProductoSchema);
