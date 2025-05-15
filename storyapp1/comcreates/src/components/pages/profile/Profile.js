import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Comics from "../../comics"
import { AuthContext } from "../../authContext";
import { useContext } from "react";
import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../../axios";
import { useParams, Link, useLocation } from "react-router-dom";
import { Button } from "@mui/material";
import Update from "../../update/Update";



const Profile = () => {

  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { userId } = useParams(); 
  //const userId = parseInt(useLocation().pathname.split("/")[2]);
console.log("profile userid " + userId);
  


const {data ,error} =  useQuery({
    queryKey: [],
    queryFn: async () => {
       const res = await makeRequest.get("/users/find/" + userId); 
            return res.data;
        
    },
  });


const getImagePath = (url) => {
  const fallback = "https://res.cloudinary.com/dmvlhxlpe/image/upload/v1747322448/no_image_gb87q1.png";
  
  if (typeof url !== "string") return fallback;

  if (url.startsWith("http")) return url;

  return `https://z-creates-production.up.railway.app/upload/${url}`;
};


  return ( 
    <div className="profile">
      <div className="images">
        
      <img src={getImagePath(data?.coverPic)} alt="Cover" className="cover" />
      <img src= {"https://res.cloudinary.com/dmvlhxlpe/image/upload/v1747322448/no_image_gb87q1.png"} alt="Profile" className="profilePic" />

      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="http://facebook.com">
              <FacebookTwoToneIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <InstagramIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <TwitterIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <LinkedInIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <PinterestIcon fontSize="large" />
            </a>
          </div>
          <div className="center">
            <span>{data?.name}</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                 <span>{data?.city}</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>{data?.website}</span>
              </div>
            </div>
            {Number(userId) === currentUser?.id ?  
            <button onClick={() => setOpenUpdate(true)}>Edit</button> : null}
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
        </div>
        <Comics userId={userId} />
      </div>
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data}/>}
    </div>
  );
};

export default Profile;
