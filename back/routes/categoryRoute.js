const express = require("express");
const router = express.Router();

const handler = (name) => async (req, res, next) => {
  try {
    const mod = await import("../controllers/categoryController.js");
    return mod[name](req, res, next);
  } catch (err) {
    next(err);
  }
};

router.post("/categories", handler("createCategory"));
router.get("/categories", handler("getAllCategory"));
router.get("/categories/:id", handler("getCategoryById"));
router.put("/categories/:id", handler("updateCategoryById"));
router.delete("/categories", handler("deleteAllCategory"));
router.delete("/categories/:id", handler("deleteCategoryById"));

module.exports = router;

