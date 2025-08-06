// ChangePassword.js
import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import '../styles/ChangePassword.css';
import { FaLock, FaKey, FaEye, FaEyeSlash, FaShieldAlt, FaArrowLeft, FaCheck, FaTimes } from 'react-icons/fa';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Calculate password strength when new password changes
    if (name === 'newPassword') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthLabel = () => {
    switch (passwordStrength) {
      case 0: return { label: 'Very Weak', color: '#e74c3c' };
      case 1: return { label: 'Weak', color: '#e67e22' };
      case 2: return { label: 'Medium', color: '#f1c40f' };
      case 3: return { label: 'Strong', color: '#2ecc71' };
      case 4: return { label: 'Very Strong', color: '#27ae60' };
      default: return { label: '', color: '' };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmNewPassword } = formData;
    
    if (newPassword !== confirmNewPassword) {
      setStatus({ type: 'error', message: 'New passwords do not match' });
      return;
    }
    
    if (passwordStrength < 2) {
      setStatus({ type: 'error', message: 'Password is too weak. Please use a stronger password.' });
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await axios.put('/auth/change-password', { currentPassword, newPassword }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setStatus({ type: 'success', message: res.data.msg || 'Password updated successfully' });
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
      setPasswordStrength(0);
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.msg || 'Password update failed' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const strengthInfo = getPasswordStrengthLabel();

  return (
    <div className="change-password-container">
      <div className="password-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h1>Change Password</h1>
        <p>Update your account password</p>
      </div>
      
      <div className="password-card">
        <div className="card-header">
          <div className="card-icon">
            <FaShieldAlt />
          </div>
          <h2>Security Settings</h2>
          <p>Create a strong password to protect your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="change-password-form">
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <div className="input-container">
              <div className="input-icon">
                <FaLock />
              </div>
              <input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                placeholder="Enter your current password"
                value={formData.currentPassword}
                onChange={handleChange}
                required
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <div className="input-container">
              <div className="input-icon">
                <FaKey />
              </div>
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                placeholder="Enter your new password"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            
            {formData.newPassword && (
              <div className="password-strength">
                <div className="strength-meter">
                  <div 
                    className="strength-meter-fill" 
                    style={{ 
                      width: `${passwordStrength * 25}%`,
                      backgroundColor: strengthInfo.color
                    }}
                  ></div>
                </div>
                <div className="strength-label" style={{ color: strengthInfo.color }}>
                  {strengthInfo.label}
                </div>
              </div>
            )}
            
            <div className="password-requirements">
              <p>Password must contain:</p>
              <ul>
                <li className={formData.newPassword.length >= 8 ? 'valid' : ''}>
                  At least 8 characters
                </li>
                <li className={/[A-Z]/.test(formData.newPassword) ? 'valid' : ''}>
                  At least one uppercase letter
                </li>
                <li className={/[0-9]/.test(formData.newPassword) ? 'valid' : ''}>
                  At least one number
                </li>
                <li className={/[^A-Za-z0-9]/.test(formData.newPassword) ? 'valid' : ''}>
                  At least one special character
                </li>
              </ul>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmNewPassword">Confirm New Password</label>
            <div className="input-container">
              <div className="input-icon">
                <FaKey />
              </div>
              <input
                id="confirmNewPassword"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmNewPassword"
                placeholder="Confirm your new password"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                required
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            
            {formData.confirmNewPassword && formData.newPassword && (
              <div className={`password-match ${formData.newPassword === formData.confirmNewPassword ? 'match' : 'no-match'}`}>
                {formData.newPassword === formData.confirmNewPassword ? (
                  <><FaCheck /> Passwords match</>
                ) : (
                  <><FaTimes /> Passwords do not match</>
                )}
              </div>
            )}
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span> Updating...
                </>
              ) : (
                'Update Password'
              )}
            </button>
          </div>
          
          {status.message && (
            <div className={`status-message ${status.type}`}>
              {status.type === 'success' ? <FaCheck /> : <FaTimes />}
              {status.message}
            </div>
          )}
        </form>
      </div>
      
      <div className="security-tips">
        <h3>Password Security Tips</h3>
        <div className="tips-container">
          <div className="tip">
            <div className="tip-icon">1</div>
            <p>Use a combination of letters, numbers, and symbols</p>
          </div>
          <div className="tip">
            <div className="tip-icon">2</div>
            <p>Avoid using personal information like birthdays</p>
          </div>
          <div className="tip">
            <div className="tip-icon">3</div>
            <p>Don't reuse passwords across different accounts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;