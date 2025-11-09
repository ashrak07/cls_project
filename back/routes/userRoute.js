const express = require("express");
const {
  registerUser,
  loginUser,
  createUser,
  getAllUser,
  getUserById,
  updateUserById,
  deleteAllUser,
  deleteUserById,
} = require("../controllers/userController.js");

const router = express.Router();

// Auth
router.post("/users/register", registerUser);
router.post("/users/login", loginUser);

// CRUD Users
router.post("/users", createUser);
router.get("/users", getAllUser);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUserById);
router.delete("/users", deleteAllUser);
router.delete("/users/:id", deleteUserById);

// Compat anciennes routes
router.post("/user/register", registerUser);
router.post("/user/login", loginUser);
router.get("/user/:id", getUserById);

module.exports = router;
