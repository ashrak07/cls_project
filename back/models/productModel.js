import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true, trim: true },
    caracteristique: { type: mongoose.Schema.Types.Mixed, default: {} },
    prix: { type: Number, required: true, min: 0 },
    photo: { type: String, trim: true, default: "" },
    categorie: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
