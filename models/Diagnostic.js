const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const diagnosticSchema = new Schema(
  {
    nom_prenom: { type: String },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient", // Reference the User model
      // required: true,
    },
    blocId: { type: String },

    attributs: [
      {
        attribut: { type: String },
        valeur: { type: String },
      },
    ],
  },
  { timestamps: true } // Add timestamps option
);

const Diagnostic = mongoose.model("Diagnostic", diagnosticSchema);

module.exports = Diagnostic;
