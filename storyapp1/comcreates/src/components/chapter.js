import "./chapter.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { useContext } from "react";
import { AuthContext } from "./authContext";
import { Button } from './Button';





const Chapter = ({ chapter }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [chapterTitle, setTitle] = useState(chapter.chapterTitle);
  const [chapterNumber, setchapterNumber] = useState(chapter.chapterNumber);
  const { seriesId } = useParams();
  

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
    const confirmed = window.confirm("Are you sure you want to delete your story?");
    if (confirmed) {
      // Proceed with deletion
    deleteMutation.mutate(chapter.id);
    }
  };



  



 



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


const Updatemutation = useMutation(
  (chapter) => {
    return makeRequest.put(`/chapters/+${seriesData.userId}`, chapter);
  },
  {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["chapters"]);
    },
   
  }
);

const handleClick = async (e) => {
Updatemutation.mutate({ 
 
  id: chapter.id,
  chapterTitle: chapterTitle,
  chapterNumber: chapterNumber,
  userId: seriesData.userId, });
};



let intialBtnText = "Edit";

  const [buttonText, setButtonText] = useState(intialBtnText); //same as creating your state variable where "Next" is the default value for buttonText and setButtonText is the setter function for your state variable instead of setState
 
  
  const handleBtnText = () => {
    setButtonText((state) => (state === "x" ? intialBtnText : "x"));
  };


 

  return (
    
    <div className="wrapper">
         <li className="chapterItems" key={chapter.id}>
            <Link to={`/viewer/${chapter.seriesId}/${chapter.chapterNumber}`}>
              {chapter.chapterTitle}
            </Link>

            {Number(seriesData?.userId) === currentUser?.id ? 
            <button className="editChapterBtn" onClick={() =>{ 
                    setMenuOpen(!menuOpen);
                     handleBtnText();
                       }
                      }> {buttonText} </button> 
:null}
          



            {menuOpen && Number(seriesData?.userId) === currentUser?.id ?  
            <div className="containerDelete">
              

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
          
          

          
          <button onClick={handleClick}>Update Chapter</button>
          <button onClick={handleDelete} style={{marginLeft:"100px", backgroundColor:"red", borderRadius:"5px"}}>delete</button>
        </div>
      </div>
      :null}
          </li>
          </div>
  );
};

export default Chapter;



