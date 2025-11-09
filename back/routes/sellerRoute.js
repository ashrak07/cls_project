const express = require("express");
const router = express.Router();

const handler = (name) => async (req, res, next) => {
  try {
    const mod = await import("../controllers/sellerController.js");
    return mod[name](req, res, next);
  } catch (err) {
    next(err);
  }
};

router.post("/sellers", handler("createSeller"));
router.get("/sellers", handler("getAllSeller"));
router.get("/sellers/:id", handler("getSellerById"));
router.put("/sellers/:id", handler("updateSellerById"));
router.delete("/sellers", handler("deleteAllSeller"));
router.delete("/sellers/:id", handler("deleteSellerById"));

module.exports = router;

