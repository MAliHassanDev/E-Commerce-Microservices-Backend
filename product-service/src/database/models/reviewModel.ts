import mongoose, { Schema, model } from "mongoose";
import Product from "./productModel.ts";


export interface IReviewer {
  _id: string,
  name: string,
  avatar: string,
  email: string,
}

export interface IReview{
  reviewerId: mongoose.Types.ObjectId,
  productId: mongoose.Types.ObjectId,
  stars: number,
  content: string,
  images?: string[]
}


const reviewSchema = new Schema<IReview>({
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
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
  versionKey: false,
})

const Review = model<IReview>('reviews', reviewSchema);

export default Review;