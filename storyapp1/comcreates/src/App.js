import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import './App.css';
import Home from './components/pages/Home';
import Login from './components/pages/login';
import Share from './components/pages/share';
import Register from './components/pages/register';
import Footer from './components/Footer';
import "./style.scss";
import { useContext } from "react";
import { DarkModeContext } from "./components/darkModeContext";
import { AuthContext } from "./components/authContext";
import Profile from "./components/pages/profile/Profile";
import ComicDetails from "./components/pages/ComicDetails";
import Viewer from "./components/pages/Viewer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";





function App() {
 
  const { currentUser } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
    <div className={`theme-${darkMode ? "dark" : "light"}`}>
      <HashRouter>
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/comic/:seriesId" element={<ComicDetails />} />
          <Route path="/viewer/:seriesId/:chapterId" element={<Viewer />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/share" element={<Share />} />
          
        </Routes>
        <Footer/>
      </HashRouter>
      
    </div>
    </QueryClientProvider>
   
  );
}

export default App;