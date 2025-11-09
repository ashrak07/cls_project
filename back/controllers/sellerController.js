import Seller from "../models/sellerModel.js";
import bcrypt from "bcryptjs";

// ➕ Créer un vendeur (Seller)
export const createSeller = async (req, res) => {
  try {
    const body = req.body || {};
    const nom = body.nom || body.name;
    const telephone = body.telephone || body.phone;
    const identifiant = body.identifiant;
    const username = body.username;
    const password = body.password;
    const statutRaw = body.statut ?? body.actif; // compat "actif"
    const taux = body.taux;

    if (!nom || !telephone || !identifiant || !username || !password) {
      return res
        .status(400)
        .json({ message: "Champs manquants: nom, telephone, identifiant, username, password" });
    }

    // Vérifier l'unicité de phone et username
    const exists = await Seller.findOne({
      $or: [{ phone: telephone }, { username }],
    });
    if (exists) {
      return res
        .status(400)
        .json({ message: "Téléphone ou nom d'utilisateur déjà utilisé" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const seller = await Seller.create({
      name: nom,
      phone: telephone,
      identifiant,
      username,
      password: hashed,
      statut: typeof statutRaw === "boolean" ? statutRaw : undefined,
      taux,
    });
    res.status(201).json({ ...seller.toObject(), password: undefined });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔄 Mettre à jour un vendeur par ID
export const updateSellerById = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body || {};
    const nom = body.nom || body.name;
    const telephone = body.telephone || body.phone;
    const identifiant = body.identifiant;
    const username = body.username;
    const password = body.password;
    const statutRaw = body.statut ?? body.actif;
    const taux = body.taux;

    const seller = await Seller.findById(id);
    if (!seller) return res.status(404).json({ message: "Vendeur non trouvé" });

    if (nom) seller.name = nom;
    if (telephone) seller.phone = telephone;
    if (typeof identifiant !== "undefined") seller.identifiant = identifiant;
    if (username) seller.username = username;
    if (typeof taux !== "undefined") seller.taux = taux;
    if (typeof statutRaw !== "undefined") seller.statut = !!statutRaw;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      seller.password = await bcrypt.hash(password, salt);
    }

    const updated = await seller.save();
    const { password: _p, ...safe } = updated.toObject();
    res.json(safe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Supprimer un vendeur par ID
export const deleteSellerById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Seller.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Vendeur non trouvé" });
    res.json({ message: "Vendeur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📄 Récupérer un vendeur par ID
export const getSellerById = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await Seller.findById(id).select("-password");
    if (!seller) return res.status(404).json({ message: "Vendeur non trouvé" });
    res.json(seller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📋 Récupérer tous les vendeurs
export const getAllSeller = async (_req, res) => {
  try {
    const sellers = await Seller.find().select("-password").sort({ createdAt: -1 });
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Supprimer tous les vendeurs
export const deleteAllSeller = async (_req, res) => {
  try {
    await Seller.deleteMany({});
    res.json({ message: "Tous les vendeurs ont été supprimés" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Compatibilité avec anciens noms (facultatif)
export const createVendeur = createSeller;
export const updateVendeur = updateSellerById;
export const deleteVendeur = deleteSellerById;
export const getVendeurById = getSellerById;
export const getAllVendeurs = getAllSeller;
