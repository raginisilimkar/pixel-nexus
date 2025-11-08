# 🔐 PixelForge Nexus

PixelForge Nexus is a **secure project management system** built with the **MERN stack** (MongoDB, Express, React, Node.js).  
It enables organizations to manage projects, assign roles, and securely upload and view documents with **role-based access control**.  

---

## ✨ Features

- 🔐 **Secure Authentication**  
  - User signup/login with password hashing (bcrypt)  
  - Role-based access (Admin, Project Lead, Developer)  

- 📊 **Role-based Dashboards**  
  - **Admin**: Create projects, upload documents, view all projects  
  - **Project Lead**: Upload documents, assign developers, view projects  
  - **Developer**: View assigned projects, access project documents  

- 📂 **Project Management**  
  - Create, assign, and track projects  
  - Document upload & viewing per project  

- 🖥️ **Responsive UI**  
  - Styled with **Bootstrap 5, CSS3/5, Font Awesome**  
  - Grid layout, modern design across all pages  

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Bootstrap 5, CSS3/5, Font Awesome  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB (Atlas)  
- **Authentication**: bcrypt (with optional MFA support)  

---

## 📂 Project Structure

pixel-nexus/
├── client/ # React frontend
│ ├── src/
│ └── package.json
│
├── server/ # Node.js backend
│ ├── models/ # Mongoose schemas
│ ├── routes/ # API endpoints
│ ├── index.js # Express server
│ └── package.json
│
└── README.md


---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/pixel-nexus.git
cd pixel-nexus

``` 

### 2️⃣ Setup Backend (Server)
```bash
Copy code
cd server
npm install
npm start
```
### 3️⃣ Setup Frontend (Client)
```bash
Copy code
cd ../client
npm install
npm start
```


## 📜 API Endpoints

### Authentication

POST /register → Register a new user

POST /login → Login user

### Projects
POST /create-project → Create a new project (Admin)

GET /projects → View all projects

GET /my-projects → View assigned projects (Developer)

### Documents
POST /upload-doc → Upload a document to a project

GET /view-docs/:projectId → View documents of a project

### User Management
POST /assign-developer → Assign developer to a project (Project Lead)

## 🌐 Deployment
 [ Vercel](https://pixel-nexus.vercel.app/)

