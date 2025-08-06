import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { getToken } from '../utils/auth';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../styles/Project.css';
import { FaProjectDiagram, FaSearch, FaFilter, FaCalendarAlt, FaUsers, FaCode, FaCheckCircle, FaTrash, FaFolderOpen, FaPlus , FaArrowLeft} from 'react-icons/fa';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
 const navigate = useNavigate();
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get('/projects/all', {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        setProjects(res.data);
        setFilteredProjects(res.data);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    let result = projects;
    
    if (searchTerm) {
      result = result.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (statusFilter !== 'All') {
      result = result.filter(project => project.status === statusFilter);
    }
    
    setFilteredProjects(result);
  }, [searchTerm, statusFilter, projects]);

  const handleComplete = async (projectId) => {
    try {
      await axios.put(`/projects/complete/${projectId}`, {}, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      alert("Project marked as completed.");
      setProjects(projects.map(p => 
        p._id === projectId ? { ...p, status: 'Completed' } : p
      ));
    } catch (err) {
      alert("Could not mark project as complete.");
    }
  };

  const handleDelete = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await axios.delete(`/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        alert("Project deleted.");
        setProjects(projects.filter(p => p._id !== projectId));
      } catch (err) {
        alert("Failed to delete project.");
      }
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'active';
      case 'Completed': return 'completed';
      case 'Planning': return 'planning';
      case 'On Hold': return 'onhold';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="projects-container">
      <div className="projects-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
                    <FaArrowLeft /> Back to Dashboard
                  </button>
          <h1><FaProjectDiagram /> All Projects</h1>
          <p>Manage and track all your projects in one place</p>
        </div>
        {user.role === 'Admin' && (
          <Link to="/create-project" className="create-project-btn">
            <FaPlus /> Create Project
          </Link>
        )}
      </div>

      <div className="projects-controls">
        <div className="search-container">
          <div className="search-input">
            <FaSearch />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-container">
            <FaFilter />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
           
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
        <div className="results-count">
          Showing {filteredProjects.length} of {projects.length} projects
        </div>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading projects...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <FaProjectDiagram />
          </div>
          <h3>No projects found</h3>
          <p>
            {searchTerm || statusFilter !== 'All' 
              ? 'Try adjusting your search or filter criteria' 
              : 'Get started by creating your first project'}
          </p>
          {user.role === 'Admin' && (
            <Link to="/create-project" className="create-project-btn">
              <FaPlus /> Create Project
            </Link>
          )}
        </div>
      ) : (
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <div key={project._id} className="project-card">
              <div className="card-header">
                <h3>{project.name}</h3>
                <span className={`status-badge ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
              
              {project.description && (
                <p className="project-description">
                  {project.description.length > 100 
                    ? `${project.description.substring(0, 100)}...` 
                    : project.description}
                </p>
              )}
              
              <div className="project-details">
                <div className="detail-item">
                  <FaCalendarAlt />
                  <span>Deadline: {formatDate(project.deadline)}</span>
                </div>
                <div className="detail-item">
                  <FaCode />
                  <span>Tech: {Array.isArray(project.techStack) ? project.techStack.join(', ') : 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <FaUsers />
                  <span>
                    Developers: {Array.isArray(project.assignedUsers) && project.assignedUsers.length > 0
                      ? project.assignedUsers.map(dev => dev.name || "Developer").join(', ')
                      : 'None'}
                  </span>
                </div>
              </div>
              
              <div className="card-actions">
                <Link to={`/view-docs/${project._id}`} className="view-docs-btn">
                  <FaFolderOpen /> View Documents
                </Link>
                
                {user.role === 'Admin' && (
                  <div className="admin-actions">
                    {project.status !== 'Completed' && (
                      <button 
                        onClick={() => handleComplete(project._id)} 
                        className="complete-btn"
                        title="Mark as completed"
                      >
                        <FaCheckCircle />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(project._id)} 
                      className="delete-btn"
                      title="Delete project"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;