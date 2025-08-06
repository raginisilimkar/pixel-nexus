const router = require('express').Router();
const {
  createProject,
  markComplete,
  getProjects,
  assignDeveloper,
  getAssignedProjects,
  deleteProject
} = require('../controllers/projectController');

const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

// Admin: Create project
router.post('/create', auth, authorize('Admin'), createProject);

// ✅ FIXED: Moved this above module.exports
router.put('/complete/:id', auth, authorize('Admin'), markComplete);

// All Users: View active projects
router.get('/all', auth, getProjects);

// ProjectLead: Assign developer to project
router.post('/assign', auth, authorize('ProjectLead'), assignDeveloper);
router.get('/assigned', auth, authorize('Developer'), getAssignedProjects);


// ✅ DELETE a project by ID (Admin only)
router.delete('/:id', auth, authorize('Admin'), deleteProject);


module.exports = router;
