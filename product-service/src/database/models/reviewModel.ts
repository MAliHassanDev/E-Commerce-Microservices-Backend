import mongoose, { Schema, model } from "mongoose";
import Product from "./productModel.ts";



export interface IReview{
  user: mongoose.Types.ObjectId,
  product: mongoose.Types.ObjectId,
  stars: number,
  content: string,
  images?: string[]
}

const reviewSchema = new Schema<IReview>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Product,
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  stars: {
    type: Number,
    max: 5,
    min: 1,
    required: true,
  },
  images: {
    type: [
      {
        type: String,
        trim: true,
      }
    ],
    default: [],
  }
}, {
  timestamps: true,
})

const Review = model<IReview>('reviews', reviewSchema);

export default Review;