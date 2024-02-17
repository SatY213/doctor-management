const Irm = require("../models/Irm");

// Create a new IRM entry
exports.createIRM = async (req, res) => {
  try {
    const irm = new Irm(req.body);

    const savedIRM = await irm.save();
    res.status(201).json({ success: "Enregistrement réussi." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Échec de la création de l'IRM." });
  }
};

// Update an IRM entry by ID
exports.updateIRM = async (req, res) => {
  try {
    const irmId = req.params.id;
    const updatedFields = {
      ...req.body,
    };

    const updatedIRM = await Irm.findByIdAndUpdate(irmId, updatedFields, {
      new: true,
    });

    if (!updatedIRM) {
      return res.status(404).json({ error: "IRM non trouvé." });
    }

    res.status(201).json({ success: "Mise à jour réussie." });
  } catch (error) {
    res.status(500).json({ error: "Échec de la mise à jour de l'IRM." });
  }
};

// Delete an IRM entry by ID
exports.deleteIRM = async (req, res) => {
  try {
    const irmId = req.params.id;
    const deletedIRM = await Irm.findByIdAndDelete(irmId);

    if (!deletedIRM) {
      return res.status(404).json({ error: "IRM non trouvé." });
    }

    res.status(201).json({ success: "IRM est supprimé" });
  } catch (error) {
    res.status(500).json({ error: "Échec de la suppression de l'IRM." });
  }
};

// Find an IRM entry by ID
exports.findIRMById = async (req, res) => {
  try {
    const irmId = req.params.id;
    const irm = await Irm.findById(irmId).populate("patientId");

    if (!irm) {
      return res.status(404).json({ error: "IRM non trouvé." });
    }

    res.json(irm);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Échec de la récupération de l'IRM.", error });
  }
};

// Find all IRM entries with pagination and search
exports.findAllIRMs = async (req, res) => {
  try {
    const perPage = parseInt(req.query.perPage) || 10;
    const page = parseInt(req.query.page) || 1;
    const searchQuery = req.query.q || "";

    const query = {};
    if (searchQuery) {
      query.nom_prenom = { $regex: searchQuery, $options: "i" };
    }

    const totalCount = await Irm.countDocuments(query);
    const totalPages = Math.ceil(totalCount / perPage);
    const irms = await Irm.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("patientId") // Populate the patientId field to get patient details
      .exec();

    res.json({
      data: irms,
      totalItems: totalCount,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Échec de la récupération des IRMs." });
  }
};

exports.findAllIrmsById = async (req, res) => {
  try {
    const patientId = req.params.id;

    const perPage = parseInt(req.query.perPage) || 10;
    const page = parseInt(req.query.page) || 1;

    const totalCount = await Irm.countDocuments({
      patientId: patientId,
    });
    const totalPages = Math.ceil(totalCount / perPage);
    const irms = await Irm.find({ patientId: patientId })
      // const diagnostics = await Diagnostic.find({ patientId: patientId, blocId: { $exists: true, $ne: null } });

      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("patientId")
      .exec();

    res.json({
      data: irms,
      totalItems: totalCount,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: "Échec de la récupération des irms." });
  }
};
