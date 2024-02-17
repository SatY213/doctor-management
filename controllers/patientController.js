const Patient = require("../models/Patient");
const mongoose = require("mongoose");
const Diagnostic = require("../models/Diagnostic");
const Prescription = require("../models/Prescription");
const Bloc = require("../models/Bloc");
const Irm = require("../models/Irm");

// Create a new user
exports.createPatient = async (req, res) => {
  try {
    const patient = new Patient(req.body);

    const savedPatient = await patient.save();
    res.status(201).json({ success: "Enregistrement réussi." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Échec de la création du patient." });
  }
};

// Update a patient by ID
exports.updatePatient = async (req, res) => {
  try {
    const patientId = req.params.id;
    const updatedFields = {
      ...req.body,
    };

    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      updatedFields,
      {
        new: true,
      }
    );

    if (!updatedPatient) {
      return res.status(404).json({ error: "Patient non trouvé." });
    }

    res.status(201).json({ success: "Mise à jour réussie." });
  } catch (error) {
    res.status(500).json({ error: "Échec de la mise à jour." });
  }
};

// Delete a patient by ID
exports.deletePatient = async (req, res) => {
  try {
    const patientId = req.params.id;
    const deletedPatient = await Patient.findByIdAndDelete(patientId);

    if (!deletedPatient) {
      return res.status(404).json({ error: "Patient non trouvé." });
    }

    // Log patient deletion
    console.log(`Deleted patient with ID: ${patientId}`);

    // Remove related diagnostics
    const deletedDiagnostics = await Diagnostic.deleteMany({
      patientId: patientId,
    });
    if (deletedDiagnostics) {
      console.log(
        `Deleted ${deletedDiagnostics.deletedCount} diagnostics related to patient`
      );
    }

    // Remove related prescriptions
    const deletedPrescriptions = await Prescription.deleteMany({
      patientId: patientId,
    });
    if (deletedPrescriptions) {
      console.log(
        `Deleted ${deletedPrescriptions.deletedCount} prescriptions related to patient`
      );
    }
    const deletedIrms = await Irm.deleteMany({
      patientId: patientId,
    });
    if (deletedIrms) {
      console.log(
        `Deleted ${deletedIrms.deletedCount} irms related to patient`
      );
    }

    const deletedBlocs = await Bloc.deleteMany({
      patientId: patientId,
    });
    if (deletedBlocs) {
      console.log(
        `Deleted ${deletedBlocs.deletedCount} irms related to patient`
      );
    }
    res.status(201).json({ success: "Patient est supprimé" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Échec de la suppression de patient" });
  }
};

exports.findPatientById = async (req, res) => {
  try {
    const patientId = req.params.id;
    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ error: "Patient non trouvé." });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: "Échec de la récupération du patient" });
  }
};

// Find all patients with pagination and search
exports.findAllPatients = async (req, res) => {
  try {
    const perPage = parseInt(req.query.perPage) || 8;
    const page = parseInt(req.query.page) || 1;
    const searchQuery = req.query.q || "";

    const query = {};
    if (searchQuery) {
      query.nom_prenom = { $regex: searchQuery, $options: "i" };
    }

    const totalCount = await Patient.countDocuments(query);
    const totalPages = Math.ceil(totalCount / perPage);
    const patients = await Patient.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    res.json({
      data: patients,
      totalItems: totalCount,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: "Échec de la récupération des patients" });
  }
};
