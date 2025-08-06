import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import Dashboard from './pages/Dashboard'; // (Create later)
import Projects from './pages/Projects';
import Upload from './pages/Upload';
import ViewDocuments from './pages/ViewDocuments';
import MyProjects from './pages/MyProjects'; // ✅ adjust path if needed
import AssignDeveloper from './pages/AssignDeveloper';
import CreateProject from './pages/CreateProject';
import CreateUser from './pages/CreateUser'; // ✅ adjust path if needed
import ChangePassword from './pages/ChangePassword';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />     
        <Route path="/view-docs/:projectId" element={<ViewDocuments />} />
     <Route path="/assigned" element={<MyProjects />} />
<Route path="/create-user" element={<CreateUser />} />
<Route path="/change-password" element={<ChangePassword />} />
        <Route path="/create-project" element={<CreateProject />} />
<Route path="/assign" element={<AssignDeveloper />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </Router>
  );
}

export default App;
