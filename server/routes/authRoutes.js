const router = require('express').Router();
const { register, login } = require('../controllers/authController');
const { changePassword } = require('../controllers/authController');

// const auth = require('../middleware/auth');
// const authorizeRole = require('../middleware/role');
const express = require('express');
const User = require('../models/User');
// Only admin can register new users
// router.post('/register', auth, authorizeRole('Admin'), register);
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');
router.post('/register', auth, authorize('Admin'), register); // Secure again
router.put('/change-password', auth, changePassword);

router.post('/login', login);
// Fetch all developers
router.get('/developers', auth, authorize('ProjectLead'), async (req, res) => {
  try {
    const devs = await User.find({ role: 'Developer' }, 'name email');
    res.json(devs);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch developers' });
  }
});
module.exports = router;
