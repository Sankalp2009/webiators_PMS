import express from "express";
import * as ProductController from "../Controller/productController.js";
import { Protected } from "../Middleware/Protected.js";
import { validateProduct, validateProductUpdate } from "../Middleware/validation.js";

const router = express.Router();

router.use(Protected);

router
  .route("/")
  .get(ProductController.getAllProduct)
  .post(validateProduct, ProductController.createProduct);
router
  .route("/:id")
  .get(ProductController.getProductById)
  .patch(validateProductUpdate, ProductController.updateProduct)
  .delete(ProductController.deleteProduct);

export default router;