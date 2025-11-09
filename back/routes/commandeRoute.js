const express = require("express");
const router = express.Router();

const handler = (name) => async (req, res, next) => {
  try {
    const mod = await import("../controllers/commandeController.js");
    return mod[name](req, res, next);
  } catch (err) {
    next(err);
  }
};

router.post("/orders", handler("createOrder"));
router.get("/orders", handler("getAllOrder"));
router.get("/orders/:id", handler("getOrderById"));
router.put("/orders/:id", handler("updateOrderById"));
router.delete("/orders", handler("deleteAllOrder"));
router.delete("/orders/:id", handler("deleteOrderById"));

module.exports = router;

