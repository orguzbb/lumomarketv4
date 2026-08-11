import mongoose from 'mongoose';
const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, sparse: true },
  sessionId: { type: String, index: true, sparse: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, min: 1, default: 1 },
    price: Number, name: String, image: String
  }],
  subtotal: { type: Number, default: 0 }
}, { timestamps: true });
export default mongoose.model('Cart', cartSchema);