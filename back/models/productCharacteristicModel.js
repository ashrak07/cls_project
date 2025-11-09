import mongoose from "mongoose";

const characteristicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    valeur: {
      type: String,
      required: true,
      trim: true,
    },
    produit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ProductCharacteristic", characteristicSchema);
