const mongoose = require("mongoose");

const irmSchema = new mongoose.Schema(
  {
    nom_prenom: { type: String },

    attributs: [
      {
        attribut: { type: String },
        valeur: { type: String },
      },
    ],
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient", // Reference the User model
      // required: true,
    },
  },
  { timestamps: true } // Add timestamps option
);

const Irm = mongoose.model("Irm", irmSchema);

module.exports = Irm;
