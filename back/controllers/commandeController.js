import Commande from "../models/commande.js";

// ➕ Créer une commande
export const createOrder = async (req, res) => {
  try {
    const body = req.body || {};
    const code = body.code;
    const pageFacebook = body.pageFacebook;
    const client = body.client;
    const vendeur = body.vendeur;
    const produits = Array.isArray(body.produits) ? body.produits : [];
    const statutLivraison = body.statutLivraison ?? body.statut;
    const livree = body.livree;
    const dateLivraison = body.dateLivraison;
    const adresse = body.adresse;
    const detail = body.detail;
    const image = body.image;

    if (!code || !client || !vendeur || !adresse || produits.length === 0) {
      return res.status(400).json({
        message: "Champs requis: code, client, vendeur, adresse, produits",
      });
    }

    const exists = await Commande.findOne({ code });
    if (exists) {
      return res.status(400).json({ message: "Code déjà utilisé" });
    }

    const lignes = produits.map((p) => ({
      produit: p.produit || p.product,
      caracteristique: p.caracteristique || p.characteristic || p.details || {},
      caracteristiques: p.caracteristiques || [],
      description: p.description || "",
      quantite: typeof p.quantite === "number" ? p.quantite : 1,
      prixUnitaire:
        typeof p.prixUnitaire === "number"
          ? p.prixUnitaire
          : typeof p.prix === "number"
          ? p.prix
          : undefined,
      image: p.image || "",
      arrivee: !!p.arrivee,
    }));

    if (lignes.some((l) => !l.produit || typeof l.prixUnitaire === "undefined")) {
      return res.status(400).json({
        message: "Chaque produit doit contenir 'produit' et 'prixUnitaire'",
      });
    }

    const commande = await Commande.create({
      code,
      pageFacebook,
      client,
      vendeur,
      produits: lignes,
      statutLivraison: typeof statutLivraison === "string" ? statutLivraison : undefined,
      livree: typeof livree === "boolean" ? livree : undefined,
      dateLivraison,
      adresse,
      detail,
      image,
    });

    res.status(201).json(commande);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📋 Récupérer toutes les commandes
export const getAllOrder = async (_req, res) => {
  try {
    const commandes = await Commande.find().sort({ createdAt: -1 });
    res.json(commandes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📄 Récupérer une commande par ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const commande = await Commande.findById(id);
    if (!commande) return res.status(404).json({ message: "Commande non trouvée" });
    res.json(commande);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔄 Mettre à jour une commande par ID
export const updateOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body || {};

    const commande = await Commande.findById(id);
    if (!commande) return res.status(404).json({ message: "Commande non trouvée" });

    // Validation unicité code si modification
    if (typeof body.code !== "undefined" && body.code !== commande.code) {
      const dup = await Commande.findOne({ code: body.code });
      if (dup) return res.status(400).json({ message: "Code déjà utilisé" });
      commande.code = body.code;
    }

    if (typeof body.pageFacebook !== "undefined") commande.pageFacebook = body.pageFacebook;
    if (typeof body.client !== "undefined") commande.client = body.client;
    if (typeof body.vendeur !== "undefined") commande.vendeur = body.vendeur;
    if (typeof body.statutLivraison !== "undefined") commande.statutLivraison = body.statutLivraison;
    if (typeof body.livree !== "undefined") commande.livree = !!body.livree;
    if (typeof body.dateLivraison !== "undefined") commande.dateLivraison = body.dateLivraison;
    if (typeof body.adresse !== "undefined") commande.adresse = body.adresse;
    if (typeof body.detail !== "undefined") commande.detail = body.detail;
    if (typeof body.image !== "undefined") commande.image = body.image;

    if (Array.isArray(body.produits)) {
      commande.produits = body.produits.map((p) => ({
        produit: p.produit || p.product,
        caracteristique: p.caracteristique || p.characteristic || p.details || {},
        caracteristiques: p.caracteristiques || [],
        description: p.description || "",
        quantite: typeof p.quantite === "number" ? p.quantite : 1,
        prixUnitaire:
          typeof p.prixUnitaire === "number"
            ? p.prixUnitaire
            : typeof p.prix === "number"
            ? p.prix
            : undefined,
        image: p.image || "",
        arrivee: !!p.arrivee,
      }));
      if (commande.produits.some((l) => !l.produit || typeof l.prixUnitaire === "undefined")) {
        return res.status(400).json({
          message: "Chaque produit doit contenir 'produit' et 'prixUnitaire'",
        });
      }
    }

    const updated = await commande.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Supprimer toutes les commandes
export const deleteAllOrder = async (_req, res) => {
  try {
    await Commande.deleteMany({});
    res.json({ message: "Toutes les commandes ont été supprimées" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Supprimer une commande par ID
export const deleteOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Commande.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Commande non trouvée" });
    res.json({ message: "Commande supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
