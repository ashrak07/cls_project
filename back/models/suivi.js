import mongoose from "mongoose";

const suiviProduitSchema = new mongoose.Schema(
  {
    produit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    commande: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Commande",
      required: true,
    },
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
    quantite: {
      type: Number,
      required: true,
      default: 1,
    },
    prixUnitaire: {
      type: Number,
      required: true,
    },
    livree: {
      type: Boolean,
      default: false,
    },
    dateVente: {
      type: Date,
      default: Date.now,
    },
    dateLivraison: {
      type: Date,
    },
    detail: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("SuiviProduit", suiviProduitSchema);
