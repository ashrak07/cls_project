const express = require("express");
const router = express.Router();

const handler = (name) => async (req, res, next) => {
  try {
    const mod = await import("../controllers/productController.js");
    return mod[name](req, res, next);
  } catch (err) {
    next(err);
  }
};

router.post("/products", handler("createProduct"));
router.get("/products", handler("getAllProduct"));
router.get("/products/:id", handler("getProductById"));
router.put("/products/:id", handler("updateProductById"));
router.delete("/products", handler("deleteAllProduct"));
router.delete("/products/:id", handler("deleteProductById"));

module.exports = router;

