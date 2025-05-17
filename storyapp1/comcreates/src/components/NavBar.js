import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Link,useNavigate } from 'react-router-dom';
import './Navbar.scss';
import { useContext } from "react";
import { DarkModeContext } from "./darkModeContext";
import { AuthContext } from "./authContext";
import { makeRequest } from "../axios";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import  SearchBar from './SearchBar';





function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate()


  const handleLogout = async () => {
    try {
      await makeRequest.post("/auth/logout");
      console.log("User logged out successfully.");
      // Redirect or update UI after logout
      localStorage.clear();
      window.location.reload(); // Refresh page or use navigate() if using React Router
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };


  const handleLoginBtn = async () => {
    navigate("/login")
  };


const queryClient = useQueryClient();

  const {data ,error} =  useQuery({
      queryKey: ["user"],
      queryFn: async () => {
         const res = await makeRequest.get("/users/find/" + currentUser.id); 
              return res.data;
          
      },
    });

    


 const getImagePath = (url) => {
  if (!url) {
    return "https://res.cloudinary.com/dmvlhxlpe/image/upload/v1747322448/no_image_gb87q1.png";
  }

  // If it's already a full URL (e.g., Cloudinary)
  if (url.startsWith("http")) {
    return url;
  }

  // Fallback to local (for legacy support)
  return `https://z-creates-production.up.railway.app/upload/${url}`;
};


  const handleClick = () => setClick(!click); {/* handles clicking states*/}
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener('resize', showButton);

  console.log(currentUser);


  return (
    <>
   <nav class="navbar">
     <div class='navbar-container'>
       <Link to='/' className='navbar-logo'>
            Z-CREATES <i class='fab fa-typo3' />
          </Link>
       <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'ri-skip-right-line' : 'ri-menu-line'} /> {/*menu is default(!click/false) state when clicked switches true/click stae */}
          </div>
        
          
              
         
         
        </div>

       
        <div className="right">
        <div className="user">
        <div className='searchbar'> <SearchBar></SearchBar></div>
       
              <Link to='/'  className='nav-links' onClick={closeMobileMenu} style={{ textDecoration: "none" }}>
                Home
              </Link>
             
              {currentUser !== null?
              
              <Link to='/share' className='nav-links' onClick={closeMobileMenu} style={{ textDecoration: "none" }} >
                Upload
              </Link>
             
 :null
}
        {currentUser !== null?
        <Link to={`/profile/${currentUser?.id}`} style={{ textDecoration: "none" }}> <img src={getImagePath(currentUser?.profilePic)} alt="Profile" className="profilePic" /> </Link>
        :null
      }

           <Link to={`/profile/${currentUser?.id}`} style={{ textDecoration: "none" }}>
           {currentUser !== null?
           <span>{currentUser?.username}</span>
           :null
      }
        </Link> 
        {currentUser !== null ?  //not logged in is a guest display login button if logged in display logout
           <Button onClick={handleLogout} buttonStyle='btn--outline'>Logout</Button> :    <Button onClick={handleLoginBtn} buttonStyle='btn--outline'>Login</Button>
          
        }
         
        </div>
      </div>
      </nav>
    </>
  );
}

export default Navbar;
