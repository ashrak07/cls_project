const express = require("express");
const router = express.Router();

const handler = (name) => async (req, res, next) => {
  try {
    const mod = await import("../controllers/arriveeController.js");
    return mod[name](req, res, next);
  } catch (err) {
    next(err);
  }
};

router.post("/arrivees", handler("createArrivee"));
router.get("/arrivees", handler("getAllArrivee"));
router.get("/arrivees/:id", handler("getArriveeById"));
router.put("/arrivees/:id", handler("updateArriveeById"));
router.delete("/arrivees", handler("deleteAllArrivee"));
router.delete("/arrivees/:id", handler("deleteArriveeById"));

module.exports = router;

