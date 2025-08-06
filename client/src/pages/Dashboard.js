// Dashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import { FaProjectDiagram, FaUserPlus, FaSignOutAlt, FaFileUpload, FaTasks, FaUserShield, FaChartLine, FaUsers, FaCog } from 'react-icons/fa';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const getRoleColor = () => {
    switch(user.role) {
      case 'Admin': return 'admin';
      case 'ProjectLead': return 'lead';
      case 'Developer': return 'dev';
      default: return 'default';
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome, <span>{user.name}</span> 👋</h1>
          <div className={`role-badge ${getRoleColor()}`}>
            {user.role}
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt /> Logout
        </button>
      </div>

    
         
        
      
   

      {/* Security Card */}
      <div className="security-card">
        <div className="security-info">
          <div className="security-icon">
            <FaUserShield />
          </div>
          <div>
            <h3>Account Security</h3>
            <p>Last updated: 15 days ago</p>
          </div>
        </div>
        <button className="update-password-btn" onClick={() => navigate('/change-password')}>
          <FaCog /> Update Password
        </button>
      </div>

      {/* Dashboard Actions */}
      <div className="dashboard-actions">
        {/* Admin Actions */}
        {user.role === 'Admin' && (
          <>
            <div className="action-card" onClick={() => navigate('/create-project')}>
              <div className="action-icon admin">
                <FaProjectDiagram />
              </div>
              <h3>Create Project</h3>
              <p>Start a new project</p>
            </div>
            <div className="action-card" onClick={() => navigate('/create-user')}>
              <div className="action-icon admin">
                <FaUserPlus />
              </div>
              <h3>Create User</h3>
              <p>Add team members</p>
            </div>
          </>
        )}
        
        {/* Admin & ProjectLead Actions */}
        {(user.role === 'Admin' || user.role === 'ProjectLead') && (
          <div className="action-card" onClick={() => navigate('/upload')}>
            <div className="action-icon upload">
              <FaFileUpload />
            </div>
            <h3>Upload Document</h3>
            <p>Share project files</p>
          </div>
        )}
        
        {/* ProjectLead Actions */}
        {user.role === 'ProjectLead' && (
          <div className="action-card" onClick={() => navigate('/assign')}>
            <div className="action-icon lead">
              <FaTasks />
            </div>
            <h3>Assign Developer</h3>
            <p>Allocate tasks</p>
          </div>
        )}
        
        {/* All Users Actions */}
        <div className="action-card" onClick={() => navigate('/projects')}>
          <div className="action-icon all">
            <FaProjectDiagram />
          </div>
          <h3>View Projects</h3>
          <p>Browse all projects</p>
        </div>
        
        {/* Developer Actions */}
        {user.role === 'Developer' && (
          <div className="action-card" onClick={() => navigate('/assigned')}>
            <div className="action-icon dev">
              <FaTasks />
            </div>
            <h3>My Projects</h3>
            <p>View assigned tasks</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;