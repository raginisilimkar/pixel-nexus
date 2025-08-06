// AssignDeveloper.js
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { getToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/AssignDeveloper.css';
import { FaUserPlus, FaProjectDiagram, FaUsers, FaArrowLeft, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';

const AssignDeveloper = () => {
  const [projects, setProjects] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedDev, setSelectedDev] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const projectRes = await axios.get('/projects/all', {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setProjects(projectRes.data);
        
        const devRes = await axios.get('/auth/developers', {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setDevelopers(devRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setStatus('❌ Failed to load data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAssign = async () => {
    if (!selectedProject || !selectedDev) {
      setStatus('❌ Please select both project and developer.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await axios.post(
        '/projects/assign',
        { projectId: selectedProject, developerId: selectedDev },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setStatus('✅ Developer assigned successfully!');
      // Reset form after successful assignment
      setSelectedProject('');
      setSelectedDev('');
    } catch (err) {
      console.error('Error assigning developer:', err);
      setStatus('❌ Assignment failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProjectName = () => {
    if (!selectedProject) return '';
    const project = projects.find(p => p._id === selectedProject);
    return project ? project.name : '';
  };

  const getDeveloperName = () => {
    if (!selectedDev) return '';
    const developer = developers.find(d => d._id === selectedDev);
    return developer ? developer.name : '';
  };

  return (
    <div className="assign-container">
      <div className="assign-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h1>Assign Developer</h1>
        <p>Assign a developer to a project</p>
      </div>
      
      <div className="assign-card">
        <div className="card-header">
          <div className="card-icon">
            <FaUserPlus />
          </div>
          <h2>Developer Assignment</h2>
          <p>Select a project and developer to create an assignment</p>
        </div>
        
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner">
              <FaSpinner className="spinner" />
            </div>
            <p>Loading projects and developers...</p>
          </div>
        ) : (
          <div className="assign-form">
            <div className="form-group">
              <label htmlFor="project">
                <FaProjectDiagram /> Select Project
              </label>
              <select
                id="project"
                className="form-select"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                <option value="">-- Choose Project --</option>
                {projects.map((proj) => (
                  <option key={proj._id} value={proj._id}>
                    {proj.name}
                  </option>
                ))}
              </select>
              {selectedProject && (
                <div className="selection-info">
                  Selected: <span>{getProjectName()}</span>
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="developer">
                <FaUsers /> Select Developer
              </label>
              <select
                id="developer"
                className="form-select"
                value={selectedDev}
                onChange={(e) => setSelectedDev(e.target.value)}
              >
                <option value="">-- Choose Developer --</option>
                {developers.map((dev) => (
                  <option key={dev._id} value={dev._id}>
                    {dev.name} ({dev.email})
                  </option>
                ))}
              </select>
              {selectedDev && (
                <div className="selection-info">
                  Selected: <span>{getDeveloperName()}</span>
                </div>
              )}
            </div>
            
            <div className="form-actions">
              <button 
                className="assign-btn" 
                onClick={handleAssign}
                disabled={isSubmitting || !selectedProject || !selectedDev}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="spinner" /> Assigning...
                  </>
                ) : (
                  <>
                    <FaUserPlus /> Assign Developer
                  </>
                )}
              </button>
            </div>
            
            {status && (
              <div className={`status-message ${status.includes('✅') ? 'success' : 'error'}`}>
                {status.includes('✅') ? <FaCheck /> : <FaTimes />}
                {status}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="assignment-info">
        <h3>How Assignment Works</h3>
        <div className="info-steps">
          <div className="step">
            <div className="step-number">1</div>
            <p>Select a project that needs a developer</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <p>Choose a developer from the available list</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <p>Click assign to link the developer to the project</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignDeveloper;