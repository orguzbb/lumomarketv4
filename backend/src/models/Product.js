import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  description: { type: String, required: true },
  images: [{ url: String, alt: String }],
  price: { type: Number, required: true, min: 0 },
  oldPrice: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  brand: { type: String, default: '' },
  sku: { type: String, unique: true, sparse: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  variants: [{ color: String, size: String, stock: Number, sku: String }],
  stock: { type: Number, required: true, min: 0, default: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewsCount: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'active', 'archived'], default: 'draft' }
}, { timestamps: true });
productSchema.index({ name: 'text', brand: 'text', description: 'text' });
productSchema.index({ category: 1, seller: 1, status: 1 });
productSchema.pre('save', function(next) {
  if (!this.slug) this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  next();
});
export default mongoose.model('Product', productSchema);