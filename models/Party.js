import mongoose from 'mongoose';

const partySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  date: { type: Date },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ticketPrice: { type: Number, required: true },
  cost: { type: Number, required: true },
  revenue: { type: Number, required: true },
});

export default mongoose.model('Party', partySchema);
