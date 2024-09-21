import mongoose, { Schema, model } from "mongoose";
import Product from "./productModel.ts";



interface IReview{
  user: mongoose.Types.ObjectId,
  product: mongoose.Types.ObjectId,
  score: number,
  content: string,
  images: Array<String>
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
  score: {
    type: Number,
    max: 5,
    min: 0,
    required: true,
  },
  images: [
    {
      type: String,
      trim: true,
    }
  ]
})

const Review = model<IReview>('reviews', reviewSchema);

export default Review;