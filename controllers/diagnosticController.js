const Diagnostic = require("../models/Diagnostic");

// Create a new diagnostic entry
exports.createDiagnostic = async (req, res) => {
  try {
    const diagnostic = new Diagnostic(req.body);

    const savedDiagnostic = await diagnostic.save();
    res.status(201).json({ success: "Enregistrement réussi." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Échec de la création du diagnostic." });
  }
};

// Update a diagnostic entry by ID
exports.updateDiagnostic = async (req, res) => {
  try {
    const diagnosticId = req.params.id;
    const updatedFields = {
      ...req.body,
    };

    const updatedDiagnostic = await Diagnostic.findByIdAndUpdate(
      diagnosticId,
      updatedFields,
      {
        new: true,
      }
    );

    if (!updatedDiagnostic) {
      return res.status(404).json({ error: "Diagnostic non trouvé." });
    }

    res.status(201).json({ success: "Mise à jour réussie." });
  } catch (error) {
    res.status(500).json({ error: "Échec de la mise à jour." });
  }
};

// Delete a diagnostic entry by ID
exports.deleteDiagnostic = async (req, res) => {
  try {
    const diagnosticId = req.params.id;
    const deletedDiagnostic = await Diagnostic.findByIdAndDelete(diagnosticId);

    if (!deletedDiagnostic) {
      return res.status(404).json({ error: "Diagnostic non trouvé." });
    }

    res.status(201).json({ success: "Diagnostic est supprimé" });
  } catch (error) {
    res.status(500).json({ error: "Échec de la suppression de diagnostic" });
  }
};

// Find a diagnostic entry by ID
exports.findDiagnosticById = async (req, res) => {
  try {
    const diagnosticId = req.params.id;
    const diagnostic = await Diagnostic.findById(diagnosticId).populate(
      "patientId"
    );

    if (!diagnostic) {
      return res.status(404).json({ error: "Diagnostic non trouvé." });
    }

    res.json(diagnostic);
  } catch (error) {
    res.status(500).json({ error: "Fchec de la récupération du patient" });
  }
};

// Find all diagnostic entries with pagination and search
exports.findAllDiagnostics = async (req, res) => {
  try {
    const perPage = parseInt(req.query.perPage) || 10;
    const page = parseInt(req.query.page) || 1;
    const searchQuery = req.query.q || "";

    const query = {};
    if (searchQuery) {
      query.nom_prenom = { $regex: searchQuery, $options: "i" };
    }

    const totalCount = await Diagnostic.countDocuments(query);
    const totalPages = Math.ceil(totalCount / perPage);
    const diagnostics = await Diagnostic.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("patientId")
      .exec();

    res.json({
      data: diagnostics,
      totalItems: totalCount,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Échec de la récupération des diagnostics." });
  }
};
exports.findAllDiagnosticsById = async (req, res) => {
  try {
    const patientId = req.params.id;

    const perPage = parseInt(req.query.perPage) || 10;
    const page = parseInt(req.query.page) || 1;

    const totalCount = await Diagnostic.countDocuments({
      patientId: patientId,
    });
    const totalPages = Math.ceil(totalCount / perPage);
    const diagnostics = await Diagnostic.find({ patientId: patientId })
      // const diagnostics = await Diagnostic.find({ patientId: patientId, blocId: { $exists: true, $ne: null } });

      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("patientId")
      .exec();

    res.json({
      data: diagnostics,
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

exports.findAllBlocsDiagnosticsById = async (req, res) => {
  try {
    const patientId = req.params.id;

    const perPage = parseInt(req.query.perPage) || 10;
    const page = parseInt(req.query.page) || 1;

    const totalCount = await Diagnostic.countDocuments({
      patientId: patientId,
      blocId: { $exists: true, $ne: null },
    });
    const totalPages = Math.ceil(totalCount / perPage);
    const diagnostics = await Diagnostic.find({
      patientId: patientId,
      blocId: { $exists: true, $ne: null },
    })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("patientId")
      .exec();

    res.json({
      data: diagnostics,
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
