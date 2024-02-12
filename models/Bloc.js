const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blocSchema = new Schema(
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

const Bloc = mongoose.model("Bloc", blocSchema);

module.exports = Bloc;
