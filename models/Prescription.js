const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const prescriptionSchema = new Schema(
  {
    nom_prenom: { type: String },

    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient", // Reference the User model
      // required: true,
    },

    attributs: [
      {
        attribut: { type: String },
        valeur: { type: String },
      },
    ],
  },
  { timestamps: true } // Add timestamps option
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);

module.exports = Prescription;
