import { NextFunction, Request, Response } from "express";
import { ParsedUrlQuery } from "querystring";
import Product, { IProduct } from "../database/models/productModel.ts";
import { FilterQuery, ProjectionType, QueryOptions } from "mongoose";
import { sortOptions } from "../utils/productUtils.ts";
import config from "../config/config.ts";
import { homeCategories } from "../utils/productUtils.ts";

interface IQuery extends ParsedUrlQuery {
  category?: string;
  quantity?: string;
  sort?: string;
}

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  const { quantity, sort } = req.query as IQuery;

  const sortOption = sort ? sortOptions[sort] : {};
  const limit = quantity ? Number(quantity) : config.getProductConfig().limit;

  const filter: FilterQuery<IProduct> = {};
  const projection: ProjectionType<IProduct> = {"__v": 0};
  const options: QueryOptions = { limit, ...sortOption };

  try {
    const products = await Product.find(filter, projection, options);

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
    const product = await Product.findOne({ _id: id },{"__v": 0}).lean();
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

  const sortOption = sortOptions[sort] || {};
  const limit = quantity ? Number(quantity) : config.getProductConfig().limit;

  const filter: FilterQuery<IProduct> = { category };
  const projection: ProjectionType<IProduct> = {"__v": 0};
  const options: QueryOptions = { limit, ...sortOption };

  try {
    const products = await Product.find(filter, projection, options).lean();
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
    const categories = await Product.distinct("category");
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
        const products = await Product.find(filter, {'__v': 0}, query).lean().exec();
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
