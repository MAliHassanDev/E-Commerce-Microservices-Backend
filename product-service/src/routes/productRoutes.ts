import { Router } from "express";
import { getProducts, getProductById, getProductByCategory, getProductCategories } from "../controllers/controller.ts";
import { validateIdParam } from "../middlewares/validate.ts";
import { getHomePageProducts } from "../controllers/controller.ts";

const router = Router();

router.get("/", getProducts);

router.get("/categories", getProductCategories);

router.get("/category/:category", getProductByCategory);

router.get("/pages/home", getHomePageProducts);

router.get("/:id", validateIdParam, getProductById);

export default router;
