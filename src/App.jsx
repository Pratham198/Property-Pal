import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Navbar from './components/Navbar';
import Homepage from './components/pages/Homepage';
import Signup from './components/pages/Signup';
import Login from './components/pages/Login';
// import AboutUs from './components/pages/AboutUs';
import ForgotPassword from './components/ForgotPassword';
import PrivateRoute from './components/PrivateRoute';
import './App.css'; // Import global styles

const App = () => {
  return (
    <Router>
      <div className="App">
        {/* Navbar will be present on all pages */}
        {/* <Navbar /> */}
        <Routes>
          {/* Route for the homepage */}
          <Route path="/" element={<Homepage />} />
          {/* <Route path="/aboutus" element={<AboutUs />} /> */}
          {/* Route for the Signup page */}
          <Route path="/signup" element={<PrivateRoute><Signup /></PrivateRoute>} />
          <Route path="/login" element={<PrivateRoute><Login /></PrivateRoute>} />
          <Route path="/forgot-password" element={<PrivateRoute><ForgotPassword /></PrivateRoute>} /> {/* Add the new route */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
