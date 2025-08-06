// src/pages/CreateUser.js
import React, { useState } from 'react';
import axios from '../api/axios';
import { getToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateUser.css';
import { FaUserPlus, FaUser, FaEnvelope, FaLock, FaUserShield, FaArrowLeft, FaSave } from 'react-icons/fa';

const CreateUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Developer',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await axios.post('/auth/register', formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      alert('User created successfully');
      navigate('/dashboard');
    } catch (err) {
      alert('User creation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleColor = () => {
    switch(formData.role) {
      case 'Admin': return 'admin';
      case 'ProjectLead': return 'lead';
      case 'Developer': return 'dev';
      default: return 'default';
    }
  };

  return (
    <div className="create-user-container">
      <div className="create-user-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h1>Create New User</h1>
      </div>
      
      <div className="create-user-card">
        <div className="card-header">
          <div className="card-icon">
            <FaUserPlus />
          </div>
          <h2>User Information</h2>
          <p>Fill in the details to create a new user account .All fields required. </p>
        </div>
        
        <form className="create-user-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-container">
              <div className="input-icon">
                <FaUser />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-container">
              <div className="input-icon">
                <FaEnvelope />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-container">
              <div className="input-icon">
                <FaLock />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="role">User Role</label>
            <div className="input-container">
              <div className="input-icon">
                <FaUserShield />
              </div>
              <select 
                id="role" 
                name="role" 
                value={formData.role} 
                onChange={handleChange}
                className={getRoleColor()}
              >
                <option value="Admin">Admin</option>
                <option value="ProjectLead">Project Lead</option>
                <option value="Developer">Developer</option>
              </select>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate('/dashboard')}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner"></span> Creating...
                </>
              ) : (
                <>
                  <FaSave /> Create User
                </>
              )}
            </button>
          </div>
        </form>
        
        <div className="role-info">
          <h3>Role Permissions</h3>
          <div className="role-permissions">
            <div className="permission-item">
              <span className="role-badge admin">Admin</span>
              <p>Full system access, user management</p>
            </div>
            <div className="permission-item">
              <span className="role-badge lead">Project Lead</span>
              <p>Project management, task assignment</p>
            </div>
            <div className="permission-item">
              <span className="role-badge dev">Developer</span>
              <p>Task execution, limited access</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;