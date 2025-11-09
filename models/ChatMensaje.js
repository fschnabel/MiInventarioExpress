const { Schema, model } = require('mongoose');

const ChatMensajeSchema = new Schema({
  usuario: { type: String, required: true },    
  texto:   { type: String, required: true },     
  ts:      { type: Date, default: Date.now }     
}, { versionKey: false });

module.exports = model('ChatMensaje', ChatMensajeSchema);
