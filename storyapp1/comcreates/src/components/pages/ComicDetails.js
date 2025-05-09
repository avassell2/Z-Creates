import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import dummyComics from "../dummyComics"; // Import dummy data
import Chapter from "../chapter";
import "./ComicDetails.scss";
import UpdateComDetails from "../update/UpdateComDetails";
import { Button } from '../Button';
//import Chapters from "../chapters.js";
import React from 'react';

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";



import { AuthContext } from "../authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";









const ComicDetails = ({}) => {
  const { seriesId } = useParams(); 
  console.log("Series ID from URL:", seriesId);
  const [chapterNumber, setchapterNumber] = useState("");
  const [chapterTitle, setTitle] = useState("");
  const [openUpdate, setOpenUpdate] = useState(false);
const { currentUser } = useContext(AuthContext);
const [menuOpen, setMenuOpen] = useState(false);
const navigate = useNavigate()














const { data: chapters = [] } = useQuery({
  queryKey: ["chapters", seriesId],
  queryFn: async () => {
    const res = await makeRequest.get(`/chapters?seriesId=${seriesId}`);
    return res.data;
  },
});







const { data: seriesData, error: seriesError } = useQuery({
  queryKey: ["series", seriesId],
  queryFn: async () => {
    const res = await makeRequest.get(`/series/find/${seriesId}`);
    return res.data;
  },
});



const { data: userData, error: userError } = useQuery({
  queryKey: ["user", seriesData?.userId],
  queryFn: async () => {
    const res = await makeRequest.get(`/users/find/+${seriesData.userId}`);
    return res.data;
  },
});

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newChapter) => {
      return makeRequest.post("/chapters", newChapter);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["chapters"]);
      },
    }
  );



  const handleClick = async (e) => {
    e.preventDefault();
    
    
    mutation.mutate({ chapterTitle, chapterNumber, seriesId });
    setTitle("");
    setchapterNumber("");
    alert("Chapter submitted!")
    
  };



  const deleteMutation = useMutation(
    (chapterId) => {
      return makeRequest.delete("/chapters/" + chapterId);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["chapters"]);
      },
    }
  );

  const handleDelete = () => {
    deleteMutation.mutate(chapters[0].id);
  };


  const getImagePath = (imageName) => {
    try {
      return require(`../../upload/${imageName}`);
    } catch (error) {
      return require("../../upload/no_image.jpg"); // Default fallback image
    }
  };
  

  let intialBtnText = "Add Chapter";

  const [buttonText, setButtonText] = useState(intialBtnText); //same as creating your state variable where "Next" is the default value for buttonText and setButtonText is the setter function for your state variable instead of setState
 
  
  const handleBtnText = () => {
    setButtonText((state) => (state === "x" ? intialBtnText : "x"));
  };


  const handleAuthorBtn = async () => {
    navigate(`/profile/${seriesData?.userId}`)
  };


    

  return (
    <div className="container">


{Number(seriesData?.userId) === currentUser?.id ?  
<button onClick={() =>{ 
  
  
  setMenuOpen(!menuOpen);
  handleBtnText();
}
}> {buttonText} </button> 
:null}


{menuOpen && Number(seriesData?.userId) === currentUser?.id ?  
<div className="chapterssubmit">
      <div className="containerx">
        <div className="top">
          <div className="left">
            
            <input
              type="text"
              placeholder={`Chapter Title?`}
              onChange={(e) => setTitle(e.target.value)}
              value={chapterTitle}
            />
            
          </div>
          <div className="right">
            
          </div>
          <div className="x">
          <input
              type="text"
              placeholder={`Chapter Number?`}
              onChange={(e) => setchapterNumber(e.target.value)}
              value={chapterNumber}
            />
          </div>
        </div>
        <hr />
        <div className="bottom">
          
          <div className="right">
            <button onClick={handleClick}>Submit Chapter</button>
          </div>

         
        </div>
      </div>
     



      
    </div>


: null}




















   




<div className="container2">




   <img
 className="seriesThumbnail"
 src={getImagePath(seriesData?.thumbnail)}
 alt="Series Thumbnail"
/>


<div className="keyDetails">
{Number(seriesData?.userId) === currentUser?.id ?  
            <button onClick={() => setOpenUpdate(true)}>Edit</button> : null}


<h1 className="seriesTitle">{seriesData?.title}</h1>

<div className="authorContainer">


<h3 className="author">Author: </h3>
  


  <button className="btn" onClick={handleAuthorBtn} >
    
    
  <img
 className="authorProfilePic"
 src={
  userData?.profilePic
     ? require(`../../upload/${userData?.profilePic}`)
     : require("../../upload/no_image.jpg")
 }
 alt="Author Profile"
/>
    <h3 className="authorUsername">{userData?.username}</h3></button>
</div>


<h3 className="descHeader">Description</h3>
<p className="description"> {seriesData?.desc}</p>
                    
        
      
  <div className="chaptersContainer">     
      <h3>Chapters</h3>
      <ul>
  {/* Show author/series thumbnail once */}
 

  {/* List of chapters */}
  {console.log("this is size:" +chapters.length)}



  {chapters.length > 0 ? (
   
    
          chapters?.map((chapter) => <Chapter chapter={chapter} key={chapter.id} />)
        
      ) : (
        <p>No chapters available</p>
      )}





 
     </ul>
     </div>
   </div>
</div>

     




     



{openUpdate && <UpdateComDetails setOpenUpdate={setOpenUpdate} series={seriesData}/>}


    </div>


















  );
}

export default ComicDetails;