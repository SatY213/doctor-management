const express = require("express");
const { check, body } = require("express-validator");
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const patientController = require("../controllers/patientController");
const diagnosticController = require("../controllers/diagnosticController");
const prescriptionController = require("../controllers/prescriptionController");
const blocController = require("../controllers/blocController");

const irmController = require("../controllers/IrmController");

const authenticate = require("../middleware/authMiddleware");
const upload = require("../middleware/fileMiddleware");

router.post("/auth/logout", authenticate, authController.logout);

router.post(
  "/auth/register",
  [
    check("username", "Username is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  authController.register
);

// Login
router.post(
  "/auth/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  authController.login
);

//UpdateUser
router.put(
  "/auth/update",
  [
    check("email", "Please include a valid email").optional().isEmail(),
    check("password", "Password must be at least 8 characters long")
      .optional()
      .isLength({ min: 8 })
      .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/, "i")
      .withMessage(
        "Password must contain at least one special character and one number"
      ),
  ],
  authenticate,
  authController.updateUser
);

// AUTH ROUTES-------------------------------------------FIN

// USER ROUTES
router.post(
  "/users",
  [
    check("username", "Username is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
    check("subscriptionId", "Subscription ID is required").isMongoId(),
  ],
  userController.createUser
);

router.put(
  "/users/:id",
  [
    check("username", "Username is required").optional().not().isEmpty(),
    check("email", "Please include a valid email").optional().isEmail(),
    check("password", "Password must be at least 8 characters long")
      .optional()
      .isLength({ min: 8 })
      .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/, "i")
      .withMessage(
        "Password must contain at least one special character and one number"
      ),
  ],
  authenticate,
  userController.updateUser
);

router.delete("/users/:id", authenticate, userController.deleteUser);

router.get("/users/:id", userController.findUserById);
router.get("/users", userController.findAllUsers);
/////////////////////////

// Patient ROUTES
router.post("/patients", patientController.createPatient);

router.put(
  "/patients/:id",

  authenticate,
  patientController.updatePatient
);

router.delete("/patients/:id", authenticate, patientController.deletePatient);

router.get("/patients/:id", patientController.findPatientById);
router.get("/patients", patientController.findAllPatients);
/////////

// Diagnostic ROUTES
router.post("/diagnostics", diagnosticController.createDiagnostic);

router.put(
  "/diagnostics/:id",

  authenticate,
  diagnosticController.updateDiagnostic
);

router.delete(
  "/diagnostics/:id",
  authenticate,
  diagnosticController.deleteDiagnostic
);

router.get("/diagnostics/:id", diagnosticController.findDiagnosticById);
router.get("/diagnostics", diagnosticController.findAllDiagnostics);
router.get("/diagnostics/id/:id", diagnosticController.findAllDiagnosticsById);
router.get(
  "/diagnostics/bloc/id/:id",
  diagnosticController.findAllBlocsDiagnosticsById
);

/////////

// Prescription ROUTES
router.post("/prescriptions", prescriptionController.createPrescription);

router.put(
  "/prescriptions/:id",

  authenticate,
  prescriptionController.updatePrescription
);

router.delete(
  "/prescriptions/:id",
  authenticate,
  prescriptionController.deletePrescription
);

router.get("/prescriptions/:id", prescriptionController.findPrescriptionById);
router.get("/prescriptions", prescriptionController.findAllPrescriptions);
router.get(
  "/prescriptions/id/:id",
  prescriptionController.findAllPrescriptionsById
);

/////////

// IRM ROUTES
router.post("/irms", irmController.createIRM);

router.put(
  "/irms/:id",

  authenticate,
  irmController.updateIRM
);

router.delete("/irms/:id", authenticate, irmController.deleteIRM);
router.get("/irms/id/:id", irmController.findAllIrmsById);

router.get("/irms/:id", irmController.findIRMById);
router.get("/irms", irmController.findAllIRMs);
/////////

// Bloc ROUTES
router.post("/blocs", blocController.createBloc);

router.put(
  "/blocs/:id",

  authenticate,
  blocController.updateBloc
);

router.delete("/blocs/:id", authenticate, blocController.deleteBloc);

router.get("/blocs/:id", blocController.findBlocById);
router.get("/blocs/id/:id", blocController.findAllBlocsById);

router.get("/blocs", blocController.findAllBlocs);
/////////

module.exports = router;
