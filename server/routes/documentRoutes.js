const router = require('express').Router();
const multer = require('multer');
const path = require('path');

const { uploadDocument, getDocumentsByProject} = require('../controllers/documentController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ dest: 'uploads/' });

// Upload document (Admin or ProjectLead only)
router.post('/upload', auth, authorize('Admin', 'ProjectLead'), upload.single('file'), uploadDocument);

// Get all documents for a project
router.get('/:projectId', auth, getDocumentsByProject);


module.exports = router;
