// CreateProject.js
import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateProject.css';
import { FaProjectDiagram, FaCalendarAlt, FaCode, FaSave, FaArrowLeft } from 'react-icons/fa';

const CreateProject = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    deadline: '',
    techStack: '',
    status: 'Active'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await axios.post('/projects/create', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('Project created successfully');
      navigate('/projects');
    } catch (err) {
      alert('Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-project-container">
      <div className="create-project-header">
        <button className="back-btn" onClick={() => navigate('/projects')}>
          <FaArrowLeft /> Back to Projects
        </button>
        <h1>Create New Project</h1>
      </div>
      
      <div className="create-project-card">
        <div className="card-header">
          <div className="card-icon">
            <FaProjectDiagram />
          </div>
          <h2>Project Details</h2>
         <p className="instruction-text">Fill in the information below to create a new project. All fields required.</p>
        </div>
        
        <form onSubmit={handleCreate} className="create-project-form">
          <div className="form-group">
            <label htmlFor="name">Project Name </label>
            <div className="input-container">
              <div className="input-icon">
                <FaProjectDiagram />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter project name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Project Description </label>
            <div className="input-container">
              <textarea
                id="description"
                name="description"
                placeholder="Describe the project goals, scope, and objectives"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="deadline">Deadline </label>
              <div className="input-container">
                <div className="input-icon">
                  <FaCalendarAlt />
                </div>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <div className="input-container">
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
               
                >
                  <option value="Active">Active</option>
                 
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="techStack">Tech Stack </label>
            <div className="input-container">
              <div className="input-icon">
                <FaCode />
              </div>
              <input
                type="text"
                id="techStack"
                name="techStack"
                placeholder="e.g., React, Node.js, MongoDB"
                value={formData.techStack}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate('/projects')}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner"></span> Creating...
                </>
              ) : (
                <>
                  <FaSave /> Create Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;