
import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

const SiteSchema = new Schema({
    name: { type: String, required: true, minlength: 2, maxlength: 30 },
    client_id: { type: Schema.Types.ObjectId, required: true, ref: 'Clients' },
    email:  { type: String, required: true },
    timezone:  { type: String, required: true },
    starting_time:  { type: String, required: true },
    ending_time:  { type: String, required: true },
    late_threshold:  { type: Number, required: true },

    created_at: { type: Date,default: new Date },
    updated_at: { type: Date,default: new Date }
});



export default model('Sites', SiteSchema);