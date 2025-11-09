const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// Inscription (utilisateur self-service)
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Tous les champs sont obligatoires");
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ success: false, message: "Utilisateur déjà enregistré" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, role, password: hashed });
  return res.status(201).json({ success: true, data: user });
});

// Connexion → délivre un JWT
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Email et mot de passe requis");
  }

  const user = await User.findOne({ email });
  const ok = user && (await bcrypt.compare(password, user.password));
  if (!ok) {
    return res.status(401).json({ success: false, message: "Email ou mot de passe invalide" });
  }

  const token = jwt.sign(
    { user: { id: user.id, role: user.role } },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
  return res.status(200).json({ success: true, data: user, token });
});

// Création (par admin)
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Tous les champs sont obligatoires");
  }
  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ success: false, message: "Email déjà utilisé" });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, role, password: hashed });
  return res.status(201).json({ success: true, data: user });
});

// Liste
const getAllUser = asyncHandler(async (_req, res) => {
  const users = await User.find();
  return res.json({ success: true, data: users, count: users.length });
});

// Détail
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
  }
  return res.json({ success: true, data: user });
});

// Mise à jour par ID
const updateUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
  }

  if (name) user.name = name;
  if (email) user.email = email;
  if (role) user.role = role;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
  }

  const saved = await user.save();
  return res.json({ success: true, message: "Utilisateur mis à jour", data: saved });
});

// Suppression de tous les utilisateurs
const deleteAllUser = asyncHandler(async (_req, res) => {
  await User.deleteMany({});
  return res.json({ success: true, message: "Tous les utilisateurs ont été supprimés" });
});

// Suppression par ID
const deleteUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await User.findByIdAndDelete(id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
  }
  return res.json({ success: true, message: "Utilisateur supprimé" });
});

// Aliases pour compatibilité avec les routes existantes
const getAllUsers = getAllUser;
const updateUser = updateUserById;
const deleteUser = deleteUserById;

module.exports = {
  // Noms demandés
  registerUser,
  loginUser,
  createUser,
  getAllUser,
  getUserById,
  updateUserById,
  deleteAllUser,
  deleteUserById,
  // Compat existante
  getAllUsers,
  updateUser,
  deleteUser,
};
