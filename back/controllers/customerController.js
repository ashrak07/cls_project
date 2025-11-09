import Client from "../models/customer.js";

// ➕ Ajouter un client
export const createClient = async (req, res) => {
  try {
    const { nom, pseudoFacebook, CIN, adresse, telephone, email } = req.body;

    // Vérifier si CIN, email ou téléphone existe déjà
    const exists = await Client.findOne({
      $or: [{ CIN }, { email }, { telephone }],
    });
    if (exists) {
      return res
        .status(400)
        .json({ message: "CIN, email ou téléphone déjà utilisé" });
    }

    const client = await Client.create({
      nom,
      pseudoFacebook,
      CIN,
      adresse,
      telephone,
      email,
    });
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔄 Modifier un client par ID
export const updateClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, pseudoFacebook, CIN, adresse, telephone, email } = req.body;

    const client = await Client.findById(id);
    if (!client) return res.status(404).json({ message: "Client non trouvé" });

    if (nom) client.nom = nom;
    if (pseudoFacebook) client.pseudoFacebook = pseudoFacebook;
    if (CIN) client.CIN = CIN;
    if (adresse) client.adresse = adresse;
    if (telephone) client.telephone = telephone;
    if (email) client.email = email;

    const updatedClient = await client.save();
    res.json(updatedClient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Supprimer un client par ID
export const deleteClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findByIdAndDelete(id);
    if (!client) return res.status(404).json({ message: "Client non trouvé" });

    res.json({ message: "Client supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📄 Récupérer un client par ID
export const getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findById(id);
    if (!client) return res.status(404).json({ message: "Client non trouvé" });

    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📋 Récupérer tous les clients
export const getAllClient = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Supprimer tous les clients
export const deleteAllClient = async (_req, res) => {
  try {
    await Client.deleteMany({});
    res.json({ message: "Tous les clients ont été supprimés" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
