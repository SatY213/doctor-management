const mongoose = require("mongoose");
const Diagnostic = require("./Diagnostic"); // Import the Diagnostic model
const Prescription = require("./Prescription"); // Import the Diagnostic model
const Irm = require("./Irm"); // Import the Diagnostic model

const patientSchema = new mongoose.Schema(
  {
    nom_prenom: {
      type: String,
    },

    date_naissance: {
      type: String,
    },
    adresse: {
      type: String,
    },
    telephone: {
      type: String,
    },
  },
  { timestamps: true } // Add timestamps option
);
// Add the pre middleware to handle related documents removal

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
