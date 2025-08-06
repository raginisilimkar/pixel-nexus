const Project = require('../models/Project');
const User = require('../models/User');

// Admin: Create new project
exports.createProject = async (req, res) => {
  try {
    const { name, description, deadline, techStack, status } = req.body;  // ✅ Add techStack, status
    const project = await Project.create({ name, description, deadline, techStack, status });  // ✅ Include it here too
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to create project', error: err.message });
  }
};

// Admin: Mark project as completed
exports.markComplete = async (req, res) => {
   console.log('Received markComplete for:', req.params.id);
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status: 'Completed' },
      { new: true }
    );
       if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
     console.error('❌ Error in markComplete:', err); // ✅ Add error log
    res.status(500).json({ msg: 'Could not mark complete', error: err.message });
  }
};

// All Users: View active projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('assignedUsers', 'name'); // 👈 Add this
    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to get projects', error: err.message });
  }
};



// ProjectLead: Assign developer to project
exports.assignDeveloper = async (req, res) => {
  try {
    const { projectId, developerId } = req.body;

    const project = await Project.findById(projectId);
    const developer = await User.findById(developerId);

    if (!project || !developer) {
      return res.status(404).json({ msg: 'Invalid project or developer ID' });
    }

    if (!developer.assignedProjects.includes(projectId)) {
      developer.assignedProjects.push(projectId);
      await developer.save();
    }

    if (!project.assignedUsers.includes(developerId)) {
      project.assignedUsers.push(developerId);
      await project.save();
    }

    res.json({ msg: 'Developer assigned successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Assignment failed', error: err.message });
  }
};


// Developer: Get assigned projects
exports.getAssignedProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const projects = await Project.find({ assignedUsers: userId });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch assigned projects' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.json({ msg: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete project', error: err.message });
  }
};
