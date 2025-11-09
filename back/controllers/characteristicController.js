import ProductCharacteristic from "../models/productCharacteristicModel.js";

// ➕ Créer une caractéristique produit
export const createCharacteristic = async (req, res) => {
  try {
    const body = req.body || {};
    const name = body.name;
    const valeur = body.valeur ?? body.value;
    const produit = body.produit ?? body.product;

    if (!name || !valeur || !produit) {
      return res.status(400).json({ message: "Champs requis: name, valeur, produit" });
    }

    const exists = await ProductCharacteristic.findOne({ name, valeur, produit });
    if (exists) {
      return res.status(400).json({ message: "Caractéristique déjà existante pour ce produit" });
    }

    const characteristic = await ProductCharacteristic.create({ name, valeur, produit });
    res.status(201).json(characteristic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📋 Liste des caractéristiques
export const getAllCharacteristic = async (_req, res) => {
  try {
    const list = await ProductCharacteristic.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📄 Détail caractéristique par ID
export const getCharacteristicById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await ProductCharacteristic.findById(id);
    if (!item) return res.status(404).json({ message: "Caractéristique non trouvée" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔄 Mise à jour caractéristique par ID
export const updateCharacteristicById = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body || {};

    const item = await ProductCharacteristic.findById(id);
    if (!item) return res.status(404).json({ message: "Caractéristique non trouvée" });

    if (typeof body.name !== "undefined") item.name = body.name;
    if (typeof body.valeur !== "undefined" || typeof body.value !== "undefined") item.valeur = body.valeur ?? body.value;
    if (typeof body.produit !== "undefined" || typeof body.product !== "undefined") item.produit = body.produit ?? body.product;

    const saved = await item.save();
    res.json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Supprimer toutes les caractéristiques
export const deleteAllCharacteristic = async (_req, res) => {
  try {
    await ProductCharacteristic.deleteMany({});
    res.json({ message: "Toutes les caractéristiques ont été supprimées" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Supprimer une caractéristique par ID
export const deleteCharacteristicById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ProductCharacteristic.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Caractéristique non trouvée" });
    res.json({ message: "Caractéristique supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Alias FR pour compatibilité
export const createCaracteristique = createCharacteristic;
export const getAllCaracteristiques = getAllCharacteristic;
export const getCaracteristiqueById = getCharacteristicById;
export const updateCaracteristique = updateCharacteristicById;
export const deleteCaracteristique = deleteCharacteristicById;

