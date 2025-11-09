import mongoose from "mongoose";

const arriveeSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    mode: {
      type: String,
      enum: ["plane", "ship"],
      default: "ship",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Arrivee", arriveeSchema);
