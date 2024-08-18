import { FilterQuery, QueryOptions } from "mongoose";
import { IProduct } from "../database/models/productModel.ts";
import config from "../config/config.ts";

export interface ISortOption {
  [index: string]: QueryOptions<IProduct>;
}

export const sortOptions: ISortOption = {
  mostsold: { sort: { salesCount: -1 } },
};



export interface HomeCategory {
  heading: string;
  filter: FilterQuery<IProduct>;
  query: QueryOptions<IProduct>;
}

export const homeCategories: Array<HomeCategory> = [
  {
    heading: "premimumCars",
    filter: { category: "cars" },
    query: {
      sort: { price: 1 },
      limit: config.getProductConfig().limit,
    },
  },
  {
    heading: "featuredTrucks",
    filter: { category: "trucks" },
    query: {
      sort: { salesCount: -1 },
      limit: config.getProductConfig().limit,
    },
  },
];
