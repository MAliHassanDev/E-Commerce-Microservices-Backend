import { Router } from "express";
import {
  getProducts,
  getProductById,
  getPrdoductByCategory,
  getProductCategories,
} from "../controllers/controller.ts";
import { validateIdParam } from "../middlewares/validate.ts";
import { getHomePageProducts } from "../controllers/controller.ts";

const router = Router();

router.get("/", getProducts);

router.get("/categories",getProductCategories);

router.get("/category/:category", getPrdoductByCategory);

router.get('/home', getHomePageProducts);

router.get("/:id", validateIdParam, getProductById);



export default router;


