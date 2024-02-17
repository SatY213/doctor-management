const Bloc = require("../models/Bloc");

// Create a new Bloc entry
exports.createBloc = async (req, res) => {
  try {
    const bloc = new Bloc(req.body);

    const savedBloc = await bloc.save();
    res.status(201).json({ success: "Enregistrement réussi." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Échec de la création du bloc." });
  }
};

// Update a Bloc entry by ID
exports.updateBloc = async (req, res) => {
  try {
    const blocId = req.params.id;
    const updatedFields = {
      ...req.body,
    };

    const updatedBloc = await Bloc.findByIdAndUpdate(blocId, updatedFields, {
      new: true,
    });

    if (!updatedBloc) {
      return res.status(404).json({ error: "Bloc non trouvé." });
    }

    res.status(201).json({ success: "Mise à jour réussie." });
  } catch (error) {
    res.status(500).json({ error: "Échec de la mise à jour." });
  }
};

// Delete a Bloc entry by ID
exports.deleteBloc = async (req, res) => {
  try {
    const blocId = req.params.id;
    const deletedBloc = await Bloc.findByIdAndDelete(blocId);

    if (!deletedBloc) {
      return res.status(404).json({ error: "Bloc non trouvé." });
    }

    res.status(201).json({ success: "Bloc est supprimé" });
  } catch (error) {
    res.status(500).json({ error: "Échec de la suppression de bloc" });
  }
};

// Find a Bloc entry by ID
exports.findBlocById = async (req, res) => {
  try {
    const blocId = req.params.id;
    const bloc = await Bloc.findById(blocId).populate("patientId");

    if (!bloc) {
      return res.status(404).json({ error: "Bloc non trouvé." });
    }

    res.json(bloc);
  } catch (error) {
    res.status(500).json({ error: "Fchec de la récupération du patient" });
  }
};

// Find all Bloc entries with pagination and search
exports.findAllBlocs = async (req, res) => {
  try {
    const perPage = parseInt(req.query.perPage) || 10;
    const page = parseInt(req.query.page) || 1;
    const searchQuery = req.query.q || "";

    const query = {};
    if (searchQuery) {
      query.nom_prenom = { $regex: searchQuery, $options: "i" };
    }

    const totalCount = await Bloc.countDocuments(query);
    const totalPages = Math.ceil(totalCount / perPage);
    const blocs = await Bloc.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("patientId")
      .exec();

    res.json({
      data: blocs,
      totalItems: totalCount,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: "Échec de la récupération des blocs." });
  }
};
exports.findAllBlocsById = async (req, res) => {
  try {
    const patientId = req.params.id;

    const perPage = parseInt(req.query.perPage) || 10;
    const page = parseInt(req.query.page) || 1;

    const totalCount = await Bloc.countDocuments({
      patientId: patientId,
    });
    const totalPages = Math.ceil(totalCount / perPage);
    const blocs = await Bloc.find({ patientId: patientId })
      // const diagnostics = await Diagnostic.find({ patientId: patientId, blocId: { $exists: true, $ne: null } });

      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("patientId")
      .exec();

    res.json({
      data: blocs,
      totalItems: totalCount,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: "Échec de la récupération des blocs." });
  }
};
