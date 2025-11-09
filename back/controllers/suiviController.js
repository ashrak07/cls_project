import SuiviProduit from "../models/SuiviProduit.js";

// ➕ Ajouter un suivi produit
export const createSuiviProduit = async (req, res) => {
  try {
    const {
      produit,
      commande,
      client,
      vendeur,
      quantite,
      prixUnitaire,
      livree,
      dateVente,
      dateLivraison,
      detail,
    } = req.body;

    const suivi = await SuiviProduit.create({
      produit,
      commande,
      client,
      vendeur,
      quantite,
      prixUnitaire,
      livree: livree || false,
      dateVente: dateVente || Date.now(),
      dateLivraison,
      detail,
    });

    res.status(201).json(suivi);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔄 Modifier un suivi produit
export const updateSuiviProduit = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const suivi = await SuiviProduit.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!suivi) return res.status(404).json({ message: "Suivi non trouvé" });

    res.json(suivi);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Supprimer un suivi produit
export const deleteSuiviProduit = async (req, res) => {
  try {
    const { id } = req.params;
    const suivi = await SuiviProduit.findByIdAndDelete(id);
    if (!suivi) return res.status(404).json({ message: "Suivi non trouvé" });

    res.json({ message: "Suivi produit supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📄 Récupérer un suivi produit par ID
export const getSuiviProduitById = async (req, res) => {
  try {
    const { id } = req.params;
    const suivi = await SuiviProduit.findById(id)
      .populate("produit")
      .populate("commande")
      .populate("client")
      .populate("vendeur");

    if (!suivi) return res.status(404).json({ message: "Suivi non trouvé" });

    res.json(suivi);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📋 Récupérer tous les suivis produits
export const getAllSuiviProduits = async (req, res) => {
  try {
    const suivis = await SuiviProduit.find()
      .populate("produit")
      .populate("commande")
      .populate("client")
      .populate("vendeur")
      .sort({ createdAt: -1 });

    res.json(suivis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
