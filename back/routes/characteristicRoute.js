const express = require("express");
const router = express.Router();

const handler = (name) => async (req, res, next) => {
  try {
    const mod = await import("../controllers/characteristicController.js");
    return mod[name](req, res, next);
  } catch (err) {
    next(err);
  }
};

router.post("/characteristics", handler("createCharacteristic"));
router.get("/characteristics", handler("getAllCharacteristic"));
router.get("/characteristics/:id", handler("getCharacteristicById"));
router.put("/characteristics/:id", handler("updateCharacteristicById"));
router.delete("/characteristics", handler("deleteAllCharacteristic"));
router.delete("/characteristics/:id", handler("deleteCharacteristicById"));

module.exports = router;

