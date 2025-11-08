const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const UsuarioSchema = new Schema({
  usuario: { type: String, unique: true, required: true, trim: true },
  clave:   { type: String, required: true },
  fechaCreacion: { type: Date, default: Date.now }
}, { versionKey: false });

UsuarioSchema.pre('save', async function () {
  if (this.isModified('clave')) this.clave = await bcrypt.hash(this.clave, 10);
});

UsuarioSchema.methods.comparar = function (textoPlano) {
  return bcrypt.compare(textoPlano, this.clave);
};

module.exports = model('Usuario', UsuarioSchema);
