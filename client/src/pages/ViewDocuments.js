// ViewDocuments.js
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth';
import '../styles/ViewDocument.css';
import { 
  FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, FaFileImage, FaFileAlt, 
  FaArrowLeft, FaSearch, FaDownload, FaCalendarAlt, FaTrash, FaCloudUploadAlt, 
  FaFolderOpen, FaInfoCircle 
} from 'react-icons/fa';

const ViewDocuments = () => {
  const { projectId } = useParams();
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [project, setProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [projectError, setProjectError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectAndDocs = async () => {
      setIsLoading(true);
      try {
        // Try to fetch project details
        try {
          const projectRes = await axios.get(`/projects/${projectId}`, {
            headers: { Authorization: `Bearer ${getToken()}` },
          });
          setProject(projectRes.data);
        } catch (err) {
          console.log('Project details endpoint not available, using fallback');
          setProjectError(true);
          // Set a minimal project object with just the ID
          setProject({ _id: projectId, name: `Project ${projectId.substring(projectId.length - 6)}` });
        }

        // Fetch documents
        const docsRes = await axios.get(`/docs/${projectId}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setDocuments(docsRes.data);
        setFilteredDocuments(docsRes.data);
      } catch (err) {
        console.error('Failed to fetch data', err);
        // If documents can't be fetched either, show error state
        setProjectError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjectAndDocs();
  }, [projectId]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = documents.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDocuments(filtered);
    } else {
      setFilteredDocuments(documents);
    }
  }, [searchTerm, documents]);

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FaFilePdf className="file-icon pdf" />;
      case 'doc':
      case 'docx':
        return <FaFileWord className="file-icon word" />;
      case 'xls':
      case 'xlsx':
        return <FaFileExcel className="file-icon excel" />;
      case 'ppt':
      case 'pptx':
        return <FaFilePowerpoint className="file-icon powerpoint" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FaFileImage className="file-icon image" />;
      default:
        return <FaFileAlt className="file-icon default" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getFileSize = (size) => {
    if (!size) return 'Unknown size';
    if (size < 1024) return size + ' bytes';
    if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
    return (size / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleDelete = async (docId) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await axios.delete(`/docs/${docId}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setDocuments(documents.filter(doc => doc._id !== docId));
        alert("Document deleted successfully");
      } catch (err) {
        alert("Failed to delete document");
      }
    }
  };

  const handleUpload = () => {
    navigate(`/upload?projectId=${projectId}`);
  };

  return (
    <div className="view-docs-container">
      <div className="docs-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <div className="header-content">
          <h1>Project Documents</h1>
          {project && (
            <div className="project-info">
              <p className="project-name">{project.name}</p>
              {projectError && (
                <div className="error-notice">
                  <FaInfoCircle /> Limited project information available
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="docs-controls">
        <div className="search-container">
          <div className="search-input">
            <FaSearch />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="upload-btn" onClick={handleUpload}>
            <FaCloudUploadAlt /> Upload Document
          </button>
        </div>
        <div className="results-count">
          {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''}
        </div>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading documents...</p>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <FaFolderOpen />
          </div>
          <h3>No documents found</h3>
          <p>
            {searchTerm 
              ? 'Try adjusting your search criteria' 
              : 'No documents have been uploaded to this project yet'}
          </p>
          <button className="upload-btn" onClick={handleUpload}>
            <FaCloudUploadAlt /> Upload Your First Document
          </button>
        </div>
      ) : (
        <div className="docs-grid">
          {filteredDocuments.map((doc) => (
            <div key={doc._id} className="doc-card">
              <div className="doc-header">
                {getFileIcon(doc.filePath)}
                <h3>{doc.title}</h3>
              </div>
              
              <div className="doc-details">
                <div className="detail-item">
                  <FaCalendarAlt />
                  <span>Uploaded: {formatDate(doc.uploadedAt)}</span>
                </div>
                <div className="detail-item">
                  <span>Size: {getFileSize(doc.fileSize)}</span>
                </div>
              </div>
              
              <div className="doc-actions">
                <a
                  href={`http://localhost:5000/${doc.filePath.replace(/\\/g, '/')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="view-btn"
                >
                  View
                </a>
                <a
                  href={`http://localhost:5000/${doc.filePath.replace(/\\/g, '/')}`}
                  download
                  className="download-btn"
                >
                  <FaDownload />
                </a>
                {/* <button 
                  className="delete-btn" 
                  onClick={() => handleDelete(doc._id)}
                  title="Delete document"
                >
                  <FaTrash />
                </button> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewDocuments;