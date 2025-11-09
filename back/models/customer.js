import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
      trim: true,
    },
    pseudoFacebook: {
      type: String,
      trim: true,
      default: "",
    },
    CIN: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    adresse: {
      type: String,
      trim: true,
      default: "",
    },
    telephone: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Customer", customerSchema);
