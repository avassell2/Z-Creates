import "./comic.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { useContext } from "react";
import { AuthContext } from "./authContext";
import { Button } from './Button';





const Comic = ({ comic }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate()


 const { data: Userdata, error: userError } = useQuery({
    queryKey: ["user", comic?.userId],
    queryFn: async () => {
      const res = await makeRequest.get(`/users/find/+${comic?.userId}`);
      return res.data;
    },
  });

  

  const deleteMutation = useMutation(
    (seriesId) => {
      return makeRequest.delete("/series/" + seriesId);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["series"]);
      },
    }
  );

  const handleDelete = () => {
    const confirmed = window.confirm("Are you sure you want to delete your story?");
    if (confirmed) {
      // Proceed with deletion
    deleteMutation.mutate(comic.id);
    }
  };

  const handleAuthorBtn = async () => {
    navigate(`/profile/${comic.userId}`)
  };

  let intialBtnText = "...";

  const [buttonText, setButtonText] = useState(intialBtnText); //same as creating your state variable where "Next" is the default value for buttonText and setButtonText is the setter function for your state variable instead of setState
 
  
  const handleBtnText = () => {
    setButtonText((state) => (state === "x" ? intialBtnText : "x"));
  };


  return (
    
    <div className="wrapper">
         <div className="comic-card">
         
            <div className="container">
            <div className="user"> 
           
          
          {menuOpen && comic.userId === currentUser.id && (
            <button className="deleteBtn" onClick={handleDelete}>delete</button>
          )}
            

            {Number(comic.userId) === currentUser?.id ?  
            <button className="editComicCardBtn" onClick={() =>{ 
              setMenuOpen(!menuOpen);
               handleBtnText();
                 }
                }> {buttonText} </button>  :null}

            <h3 className="seriesTitle">{comic.title}</h3>

          


           

            <div className="container2">
            <Link to={`/comic/${comic.id}`} key={comic.id}>
           <img
  className="seriesThumbnail"
  src={
    comic?.thumbnail
      ? comic.thumbnail.startsWith("http")
        ? comic.thumbnail
        : `https://z-creates-production.up.railway.app/upload/${comic.thumbnail}`
      : "https://res.cloudinary.com/dmvlhxlpe/image/upload/v1747322448/no_image_gb87q1.png"
  }
  alt=""
/>  </Link>       

              
             
              </div>
              <h3>
                Author: </h3>
                <img
  className="authorThumbnail"
  src={
    Userdata?.profilePic
      ? Userdata.profilePic.startsWith("http")
        ? Userdata.profilePic
        : `https://z-creates-production.up.railway.app/upload/${Userdata.profilePic}`
      : "https://res.cloudinary.com/dmvlhxlpe/image/upload/v1747322448/no_image_gb87q1.png"
  }
  alt=""
/> <div className="authorName"><Button className="authorName" onClick={handleAuthorBtn} >{Userdata?.username}</Button></div>
</div> 
            </div>
            </div>
          </div>
  );
};

export default Comic;



