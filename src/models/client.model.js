import { Schema as _Schema, model } from 'mongoose';

const Schema = _Schema;

const ClientSchema = new Schema({
  name: {
    type: String, required: true, minlength: 2, maxlength: 30,
  },

  // is_active: { type: Boolean,default: true },
  created_at: { type: Date, default: new Date() },
});

export default model('Clients', ClientSchema);
