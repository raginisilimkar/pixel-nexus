import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { getToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/upload.css';
import { FaUpload, FaFileAlt, FaFolderOpen, FaArrowLeft, FaSave, FaTrash } from 'react-icons/fa';

const UploadDocument = () => {
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('/projects/all', {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        setProjects(res.data);
      } catch (err) {
        console.error('Failed to load projects');
      }
    };
    fetchProjects();
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit');
      return;
    }
    
    // Check file type
    const allowedTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'image/jpeg',
      'image/png'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      alert('Unsupported file type. Please upload a PDF, Word, Excel, PowerPoint, text file, or image.');
      return;
    }
    
    setFile(file);
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please choose a file');
    if (!projectId) return alert('Please select a project');
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('projectId', projectId);
    formData.append('title', title);
    formData.append('file', file);
    
    try {
      await axios.post('/docs/upload', formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('File uploaded successfully');
      setTitle('');
      setFile(null);
      setProjectId('');
    } catch (err) {
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const getProjectName = () => {
    if (!projectId) return '';
    const project = projects.find(p => p._id === projectId);
    return project ? project.name : '';
  };

  const getFileSize = (size) => {
    if (size < 1024) return size + ' bytes';
    if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
    return (size / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="upload-container">
      <div className="upload-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h1>Upload Document</h1>
        <p>Share files with your project team</p>
      </div>
      
      <div className="upload-card">
        <div className="card-header">
          <div className="card-icon">
            <FaUpload />
          </div>
          <h2>Document Upload</h2>
          <p className="instruction-text">Fill in the information below to create a new project.  All fields required. </p>
        </div>
        
        <form onSubmit={handleUpload} className="upload-form">
          <div className="form-group">
            <label htmlFor="project">Select Project</label>
            <div className="input-container">
              <div className="input-icon">
                <FaFolderOpen />
              </div>
              <select 
                id="project"
                value={projectId} 
                onChange={(e) => setProjectId(e.target.value)} 
                required
              >
                <option value="">Choose a project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="title">Document Title</label>
            <div className="input-container">
              <div className="input-icon">
                <FaFileAlt />
              </div>
              <input
                id="title"
                type="text"
                placeholder="Enter document title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Upload File</label>
            <div 
              className={`file-upload-area ${dragActive ? 'active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="upload-icon">
                <FaUpload />
              </div>
              <p>Drag & drop your file here</p>
              <p className="upload-text">or</p>
              <label className="file-label">
                Browse Files
                <input 
                  type="file" 
                  onChange={handleFileChange} 
                  required 
                  style={{ display: 'none' }}
                />
              </label>
              <p className="file-info">Supported formats: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, JPG, PNG (Max 10MB)</p>
            </div>
            
            {file && (
              <div className="file-preview">
                <div className="file-info">
                  <div className="file-icon">
                    <FaFileAlt />
                  </div>
                  <div className="file-details">
                    <div className="file-name">{file.name}</div>
                    <div className="file-size">{getFileSize(file.size)}</div>
                  </div>
                </div>
                <button type="button" className="remove-file" onClick={removeFile}>
                  <FaTrash />
                </button>
              </div>
            )}
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate('/dashboard')}>
              Cancel
            </button>
            <button type="submit" className="upload-btn" disabled={isUploading || !file}>
              {isUploading ? (
                <>
                  <span className="spinner"></span> Uploading...
                </>
              ) : (
                <>
                  <FaSave /> Upload Document
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadDocument;