const Document = require('../models/Document');
const path = require('path');

exports.uploadDocument = async (req, res) => {
  try {
    const { projectId } = req.body;
     console.log('BODY:', req.body);
    console.log('FILE:', req.file);
    console.log('USER:', req.user);
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const document = new Document({
      projectId,
      uploader: req.user.id,
      originalName: req.file.originalname,
      filePath: req.file.path
    });

    await document.save();

    res.status(201).json({ msg: 'File uploaded successfully', document });
  } catch (err) {
    res.status(500).json({ msg: 'Upload failed', error: err.message });
  }
};

exports.getDocumentsByProject = async (req, res) => {
  try {
    const documents = await Document.find({ projectId: req.params.projectId });
    res.json(documents);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to retrieve documents' });
  }
};
