// Import the Prescription model and any other necessary modules
const Prescription = require("../models/Prescription");

// Create a new prescription entry
exports.createPrescription = async (req, res) => {
  try {
    const prescription = new Prescription(req.body);

    const savedPrescription = await prescription.save();
    res.status(201).json({ success: "Enregistrement réussi." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Échec de la création de la prescription." });
  }
};

// Update a prescription entry by ID
exports.updatePrescription = async (req, res) => {
  try {
    const prescriptionId = req.params.id;
    const updatedFields = {
      ...req.body,
    };

    const updatedPrescription = await Prescription.findByIdAndUpdate(
      prescriptionId,
      updatedFields,
      {
        new: true,
      }
    );

    if (!updatedPrescription) {
      return res.status(404).json({ error: "Prescription non trouvée." });
    }

    res.status(201).json({ success: "Mise à jour réussie." });
  } catch (error) {
    res.status(500).json({ error: "Échec de la mise à jour." });
  }
};

// Delete a prescription entry by ID
exports.deletePrescription = async (req, res) => {
  try {
    const prescriptionId = req.params.id;
    const deletedPrescription = await Prescription.findByIdAndDelete(
      prescriptionId
    );

    if (!deletedPrescription) {
      return res.status(404).json({ error: "Prescription non trouvée." });
    }

    res.status(201).json({ success: "Prescription est supprimée." });
  } catch (error) {
    res.status(500).json({ error: "Échec de la suppression de prescription." });
  }
};

// Find a prescription entry by ID
exports.findPrescriptionById = async (req, res) => {
  try {
    const prescriptionId = req.params.id;
    const prescription = await Prescription.findById(prescriptionId).populate(
      "patientId"
    );

    if (!prescription) {
      return res.status(404).json({ error: "Prescription non trouvée." });
    }

    res.json(prescription);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Échec de la récupération de la prescription." });
  }
};

// Find all prescription entries with pagination and search
exports.findAllPrescriptions = async (req, res) => {
  try {
    const perPage = parseInt(req.query.perPage) || 10;
    const page = parseInt(req.query.page) || 1;
    const searchQuery = req.query.q || "";

    const query = {};
    if (searchQuery) {
      query.nom_prenom = { $regex: searchQuery, $options: "i" };
    }

    const totalCount = await Prescription.countDocuments(query);
    const totalPages = Math.ceil(totalCount / perPage);
    const prescriptions = await Prescription.find(query)
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("patientId")
      .exec();

    res.json({
      data: prescriptions,
      totalItems: totalCount,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Échec de la récupération des prescriptions." });
  }
};

// Find all prescription entries with pagination and search
exports.findAllPrescriptionsById = async (req, res) => {
  try {
    const patientId = req.params.id;

    const perPage = parseInt(req.query.perPage) || 10;
    const page = parseInt(req.query.page) || 1;

    const totalCount = await Prescription.countDocuments({
      patientId: patientId,
    });
    const totalPages = Math.ceil(totalCount / perPage);
    const prescriptions = await Prescription.find({ patientId: patientId })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("patientId")
      .exec();

    res.json({
      data: prescriptions,
      totalItems: totalCount,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Échec de la récupération des prescriptions." });
  }
};
