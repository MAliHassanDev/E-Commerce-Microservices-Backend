import { NextFunction, Request, Response } from "express";
import { ParsedUrlQuery } from "querystring";
import mongoose from "mongoose";
import { aggregateProducts, sortOptions } from "../utils/productUtils.ts";
import config from "../config/config.ts";
import { homeCategories } from "../utils/productUtils.ts";
import Category from "../database/models/categoryModel.ts";

interface IQuery extends ParsedUrlQuery {
  category?: string;
  quantity?: string;
  sort?: string;
}

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  const { quantity, sort } = req.query as IQuery;

  const sortOption = sort ? sortOptions[sort] : {};
  const limit = quantity ? Number(quantity) : config.getProductConfig().limit;

  try {
    const products = await aggregateProducts({},{},{limit,...sortOption});

    if (products.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Products retrieved successfully",
        data: products,
      });
    }

    res.status(404).json({
      success: false,
      message: "No products found matching the specified criteria",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const aggregateProductArray = await aggregateProducts({_id: new mongoose.Types.ObjectId(id)});
    const product = aggregateProductArray[0];
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        data: null,
      });
    }
    res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductByCategory = async (req: Request, res: Response, next: NextFunction) => {
  const { category } = req.params;
  const { quantity, sort } = req.query as IQuery;

  const sortOption = (sort && sortOptions[sort]) || {};
  const limit = quantity ? Number(quantity) : config.getProductConfig().limit;

  try {
    const products = await aggregateProducts({category},{},{limit,...sortOption});
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found matching the specified criteria",
        data: null,
      });
    }
    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await Category.find({}, { __v: 0, _id: 0 });
    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const getHomePageProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productsByCategory = await Promise.all(
      homeCategories.map(async ({ heading, filter, query }) => {
        const products = await aggregateProducts(filter, { }, query);
        return { heading, products };
      })
    );

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: productsByCategory,
    });
  } catch (error) {
    next(error);
  }
};
