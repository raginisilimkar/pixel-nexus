import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Log.css'; // Ensure you have this CSS file for styling
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await axios.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      // Role-based redirect
      const userRole = res.data.user.role;
      if (userRole === 'admin') {
        navigate('/admin-dashboard');
      } else if (userRole === 'projectlead') {
        navigate('/lead-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      alert('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-container">
            <div className="logo">PM</div>
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to access your project dashboard</p>
        </div>
        
        <form onSubmit={handleLogin} className="auth-form">
          <div className="input-group">
            <div className="input-icon">
              <FaUser />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <div className="input-icon">
              <FaLock />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button 
              type="button" 
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          
         
          <button 
            type="submit" 
            className={`login-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div className="auth-footer">
         
          <div className="role-info">
            <p>Access by role:</p>
            <div className="role-pills">
              <span className="role-pill admin">Admin</span>
              <span className="role-pill lead">Project Lead</span>
              <span className="role-pill dev">Developer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;