import Product from "../models/productModel.js";

// ➕ Créer un produit
export const createProduct = async (req, res) => {
  try {
    const body = req.body || {};
    const nom = body.nom || body.name;
    const caracteristique = body.caracteristique || body.characteristic || body.caracteristiques || {};
    const prix = body.prix || body.prixVente || body.price;
    const photo = body.photo || (Array.isArray(body.images) ? body.images[0] : body.images);
    const categorie = body.categorie;

    if (!nom || typeof prix === "undefined" || typeof categorie === "undefined") {
      return res.status(400).json({ message: "Champs requis: nom, prix, categorie" });
    }

    const product = await Product.create({ nom, caracteristique, prix, photo, categorie });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📋 Liste des produits
export const getAllProduct = async (_req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📄 Détail produit par ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Produit non trouvé" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔄 Mise à jour produit par ID
export const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body || {};

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Produit non trouvé" });

    if (typeof body.nom !== "undefined" || typeof body.name !== "undefined") {
      product.nom = body.nom || body.name;
    }
    if (typeof body.caracteristique !== "undefined" || typeof body.characteristic !== "undefined" || typeof body.caracteristiques !== "undefined") {
      product.caracteristique = body.caracteristique || body.characteristic || body.caracteristiques;
    }
    if (typeof body.prix !== "undefined" || typeof body.prixVente !== "undefined" || typeof body.price !== "undefined") {
      product.prix = body.prix ?? body.prixVente ?? body.price;
    }
    if (typeof body.photo !== "undefined" || typeof body.images !== "undefined") {
      product.photo = body.photo || (Array.isArray(body.images) ? body.images[0] : body.images);
    }
    if (typeof body.categorie !== "undefined") {
      product.categorie = body.categorie;
    }

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Supprimer tous les produits
export const deleteAllProduct = async (_req, res) => {
  try {
    await Product.deleteMany({});
    res.json({ message: "Tous les produits ont été supprimés" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Supprimer un produit par ID
export const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Produit non trouvé" });
    res.json({ message: "Produit supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Alias pour compatibilité avec anciens noms
export { getAllProduct as getAllProducts, updateProductById as updateProduct, deleteProductById as deleteProduct };
