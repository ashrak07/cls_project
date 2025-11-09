const express = require("express");
const router = express.Router();

const handler = (name) => async (req, res, next) => {
  try {
    const mod = await import("../controllers/customerController.js");
    return mod[name](req, res, next);
  } catch (err) {
    next(err);
  }
};

router.post("/clients", handler("createClient"));
router.get("/clients", handler("getAllClient"));
router.get("/clients/:id", handler("getClientById"));
router.put("/clients/:id", handler("updateClientById"));
router.delete("/clients", handler("deleteAllClient"));
router.delete("/clients/:id", handler("deleteClientById"));

module.exports = router;

