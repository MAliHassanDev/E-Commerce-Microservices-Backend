import { Schema, model } from 'mongoose';


export interface ICategory{
  title: string,
  image: string,
}



const categorySchema = new Schema<ICategory>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
    trim: true,
  }
}, {
  versionKey: false,
})


const Category = model<ICategory>('categories', categorySchema);

export default Category;