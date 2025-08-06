// MyProjects.js
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { getToken } from '../utils/auth';
import '../styles/MyProjects.css';
import { FaProjectDiagram, FaFileAlt, FaCalendarAlt, FaCode, FaTasks, FaSearch, FaFilter ,FaArrowLeft} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const MyProjects = () => {
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get('/projects/assigned', {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setAssignedProjects(res.data);
        setFilteredProjects(res.data);
      } catch (err) {
        console.error('Failed to fetch assigned projects:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    let result = assignedProjects;
    
    if (searchTerm) {
      result = result.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'All') {
      result = result.filter(project => project.status === statusFilter);
    }
    
    setFilteredProjects(result);
  }, [searchTerm, statusFilter, assignedProjects]);

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
const navigate = useNavigate();
  const getDeadlineStatus = (deadline) => {
    if (!deadline) return '';
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'overdue';
    if (diffDays <= 3) return 'urgent';
    if (diffDays <= 7) return 'approaching';
    return 'normal';
  };

  return (
    <div className="myprojects-container">
      <div className="myprojects-header">
        <div className="header-left">
            <button className="back-btn" onClick={() => navigate('/dashboard')}>
                              <FaArrowLeft /> Back to Dashboard
                            </button>
          <h1><FaProjectDiagram /> My Assigned Projects</h1>
          <p>View and manage all projects assigned to you</p>
        </div>
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
              <option value="Planning">Planning</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
        <div className="results-count">
          Showing {filteredProjects.length} of {assignedProjects.length} projects
        </div>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your projects...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <FaTasks />
          </div>
          <h3>No assigned projects</h3>
          <p>
            {searchTerm || statusFilter !== 'All' 
              ? 'Try adjusting your search or filter criteria' 
              : 'You don\'t have any projects assigned to you yet'}
          </p>
        </div>
      ) : (
        <div className="project-grid">
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
                  <span>
                    Deadline: 
                    <span className={`deadline ${getDeadlineStatus(project.deadline)}`}>
                      {formatDate(project.deadline)}
                    </span>
                  </span>
                </div>
                <div className="detail-item">
                  <FaCode />
                  <span>
                    Tech: {Array.isArray(project.techStack) ? project.techStack.join(', ') : 'N/A'}
                  </span>
                </div>
              </div>
              
              <div className="card-footer">
                <Link to={`/view-docs/${project._id}`} className="view-docs-btn">
                  <FaFileAlt /> View Documents
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProjects;