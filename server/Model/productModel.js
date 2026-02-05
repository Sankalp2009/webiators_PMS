import mongoose from "mongoose";

const { Schema } = mongoose;

const productSchema = new Schema(
 {
    metaTitle: {
      type: String,
      required: [true, 'Please provide a meta title'],
      trim: true,
      maxlength: [60, 'Meta title cannot exceed 60 characters'],
    },
    productName: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Please provide a URL slug'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Please provide a valid URL slug'],
    },
    galleryImages: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
        },
        alt: {
          type: String,
          default: '',
        },
      },
    ],
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [0, 'Price cannot be negative'],
    },
    discountedPrice: {
      type: Number,
      min: [0, 'Discounted price cannot be negative'],
      validate: {
        validator: function (value) {
          return value < this.price;
        },
        message: 'Discounted price must be less than the regular price',
      },
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      minlength: [10, 'Description must be at least 10 characters'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

productSchema.index({ productName: 'text', description: 'text' });
productSchema.index({ slug: 1 });
productSchema.index({ createdBy: 1 });

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
