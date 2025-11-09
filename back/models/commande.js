import mongoose from "mongoose";

const commandeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, trim: true },
    pageFacebook: { type: String, trim: true, default: "" },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    vendeur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendeur",
      required: true,
    },

    // Articles de la commande
    produits: [
      {
        produit: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        // Nouveau: prise en charge d'un objet caractéristique libre
        caracteristique: { type: mongoose.Schema.Types.Mixed, default: {} },
        // Ancien (conservé pour compatibilité): références de caractéristiques
        caracteristiques: [
          { type: mongoose.Schema.Types.ObjectId, ref: "Caracteristique" },
        ],
        description: { type: String, default: "" },
        quantite: { type: Number, default: 1, min: 1 },
        prixUnitaire: { type: Number, required: true, min: 0 },
        image: { type: String, default: "" },
        arrivee: { type: Boolean, default: false },
      },
    ],

    // Statut de livraison
    statutLivraison: {
      type: String,
      enum: ["en attente", "en cours", "livree", "annulée"],
      default: "en attente",
    },
    // Champs existants conservés
    statut: {
      type: String,
      enum: ["en attente", "en cours", "livree", "annulée"],
      default: "en attente",
    },
    livree: { type: Boolean, default: false },

    // Dates et informations complémentaires
    dateCreation: { type: Date, default: Date.now },
    dateCommande: { type: Date, default: Date.now },
    dateLivraison: { type: Date },
    adresse: { type: String, required: true, trim: true },
    detail: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Commande", commandeSchema);
