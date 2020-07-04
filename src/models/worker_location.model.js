
import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

const WorkerSchema = new Schema({
    coordinates: { type: Object, required: true },
    is_active: { type: Boolean, required: true },
    duration:  { type: Number, required: true },
    worker_id:  { type: Number, required: true },
    created_at: { type: Date, default: new Date },
    added_date: { type: Date },
});

export default model('WorkerLocations', WorkerSchema);