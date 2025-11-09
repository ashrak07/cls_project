const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const router = express.Router();

// Multer storage for product images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "..", "uploads", "products");
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, safeName);
  },
});

const fileFilter = (req, file, cb) => {
  if (/^image\/(png|jpe?g|gif|webp)$/.test(file.mimetype)) return cb(null, true);
  cb(new Error("Invalid image type"));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 4 * 1024 * 1024 } });

const handler = (name) => async (req, res, next) => {
  try {
    const mod = await import("../controllers/productController.js");
    return mod[name](req, res, next);
  } catch (err) {
    next(err);
  }
};

router.post("/products", upload.single("photo"), handler("createProduct"));
router.get("/products", handler("getAllProduct"));
router.get("/products/:id", handler("getProductById"));
router.put("/products/:id", upload.single("photo"), handler("updateProductById"));
router.delete("/products", handler("deleteAllProduct"));
router.delete("/products/:id", handler("deleteProductById"));

module.exports = router;
