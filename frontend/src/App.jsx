import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import React from 'react';
import RegistrationForm from './components/Registration.jsx';
import LoginForm from './components/Login.jsx';
import DashboardLayout from './components/DashboardLayout.jsx';

function App() {
  return (
    <>
      {/* <div className="App"> */}
        <Router>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/dashboard" element={<DashboardLayout />} />
            <Route path="/" exact element={<h1>Welcome Home</h1>} />
          </Routes>
        </Router>
      {/* </div> */}
    </>
  )
}

export default App
