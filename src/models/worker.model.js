
import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

const WorkerSchema = new Schema({
    name: { type: String, required: true, minlength: 2, maxlength: 30 },
    site_id: { type: Schema.Types.ObjectId, required: true, ref: 'Sites' },
    worker_id:  { type: Number, required: true },
    created_at: { type: Date,default: new Date },
    updated_at: { type: Date,default: new Date }
});



export default model('Workers', WorkerSchema);