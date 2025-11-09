import Arrivee from "../models/arrivee.js";

// ➕ Ajouter une arrivée
export const createArrivee = async (req, res) => {
  try {
    const { nom, date, mode } = req.body;

    // Vérifier si l'arrivée existe déjà
    const exists = await Arrivee.findOne({ nom });
    if (exists) {
      return res.status(400).json({ message: "Cette arrivée existe déjà" });
    }

    const arrivee = await Arrivee.create({ nom, date, mode });
    res.status(201).json(arrivee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔄 Modifier une arrivée
export const updateArriveeById = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, date, mode } = req.body;

    const arrivee = await Arrivee.findById(id);
    if (!arrivee)
      return res.status(404).json({ message: "Arrivée non trouvée" });

    if (nom) arrivee.nom = nom;
    if (date) arrivee.date = date;
    if (mode) arrivee.mode = mode;

    const updatedArrivee = await arrivee.save();
    res.json(updatedArrivee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Supprimer une arrivée
export const deleteArriveeById = async (req, res) => {
  try {
    const { id } = req.params;
    const arrivee = await Arrivee.findByIdAndDelete(id);
    if (!arrivee)
      return res.status(404).json({ message: "Arrivée non trouvée" });

    res.json({ message: "Arrivée supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📄 Récupérer une arrivée par ID
export const getArriveeById = async (req, res) => {
  try {
    const { id } = req.params;
    const arrivee = await Arrivee.findById(id);
    if (!arrivee)
      return res.status(404).json({ message: "Arrivée non trouvée" });

    res.json(arrivee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📋 Récupérer toutes les arrivées
export const getAllArrivee = async (req, res) => {
  try {
    const arrivees = await Arrivee.find().sort({ date: -1 });
    res.json(arrivees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Supprimer toutes les arrivées
export const deleteAllArrivee = async (_req, res) => {
  try {
    await Arrivee.deleteMany({});
    res.json({ message: "Toutes les arrivées ont été supprimées" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Alias pour compatibilité avec anciens noms
export const updateArrivee = updateArriveeById;
export const deleteArrivee = deleteArriveeById;
export const getAllArrivees = getAllArrivee;
