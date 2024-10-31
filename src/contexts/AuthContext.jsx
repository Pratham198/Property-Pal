import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [avatarColor, setAvatarColor] = useState('#000');


  useEffect(() => {
    // Handle the URL parameters for token and user
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const user = params.get('user');

    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', user);
      login(token, JSON.parse(user)); // Assuming `login` is available
      window.history.replaceState({}, document.title, window.location.pathname); // Clear URL params
    } else {
      // Normal flow for checking local storage
      const storedToken = localStorage.getItem('token');
      const storedUserData = localStorage.getItem('user');

      if (storedToken && storedUserData) {
        try {
          const user = JSON.parse(storedUserData);
          setIsAuthenticated(true);
          setUserName(user.firstName);
          generateAvatarColor(user.id);
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
  }, []);

  

  const generateAvatarColor = (identifier) => {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#9B59B6'];
    const colorIndex = Math.floor(Math.random() * colors.length);
    setAvatarColor(colors[colorIndex]);
  };

  const login = (token, user) => {
    if (!token || !user) {
      console.error('Invalid login data');
      return;
    }
  
    try {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
  
      setIsAuthenticated(true);
      setUserName(user.firstName);
      generateAvatarColor(user.id); // Generate a new color each login
      
      
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUserName('');
    setAvatarColor('#000');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userName, avatarColor, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
