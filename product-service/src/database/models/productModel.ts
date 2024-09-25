import { Schema, model } from "mongoose";

export interface IProduct {
  title: string;
  description: string;
  salesCount: number;
  rating?: IRating;
  category: string;
  variations: Array<IVariant>;
}

export interface IVariant {
  color: string;
  price: number;
  stock: number;
  images: Array<string>;
}

export interface IRating {
  totalReviews: number;
  oneStar: number;
  twoStar: number;
  threeStar: number;
  fourStar: number;
  fiveStar: number;
}

const variantSchema = new Schema<IVariant>({
  color: {
    type: String,
    required: true,
    trim: true,
  },
  images: [
    {
      type: String,
      required: true,
      trim: true,
    },
  ],
  stock: {
    type: Number,
    required: true,
    trim: true,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
    trim: true,
  },
});

const productSchema = new Schema<IProduct>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  variations: [variantSchema],
  salesCount: {
    type: Number,
    required: true,
    trim: true,
    default: 0,
  },
  category: {
    type: String,
    required: true,
    trim: true,
    enum: ["trucks", "trailors", "helicopters", "trains", "drones", "tanks", "cars", "boats", "bikes", "planes"],
  },
  rating: {
    totalReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    oneStar: {
      type: Number,
      required: true,
      default: 0,
    },
    twoStar: {
      type: Number,
      required: true,
      default: 0,
    },
    threeStar: {
      type: Number,
      required: true,
      default: 0,
    },
    fourStar: {
      type: Number,
      required: true,
      default: 0,
    },
    fiveStar: {
      type: Number,
      required: true,
      default: 0,
    },
  },
});

const Product = model<IProduct>("products", productSchema);

export default Product;
