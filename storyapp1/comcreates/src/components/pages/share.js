import { useContext, useState } from "react";
import { AuthContext } from "../authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useNavigate } from "react-router-dom";

const Share = () => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const [title, setTitle] = useState("");
   const navigate = useNavigate();
  
  


  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newPost) => {
      return makeRequest.post("/series", newPost);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["series"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) imgUrl = await upload();
    mutation.mutate({ title, desc, thumbnail: imgUrl });
    setTitle("");
    setDesc("");
    setFile(null);
    alert("Series created!")
    navigate(`/profile/${currentUser.id}`);
    
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
        <div className="x">
          <input
              type="text"
              placeholder={`Title of story`}
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              style={{margin: "5px"}}
            />
          </div>
         
         
          <div className="left">
            <img src={"/upload/" + currentUser.profilePic} alt="" />
            <input
            style={{margin: "5px"}}
              type="text"
              placeholder={`Description`}
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
            />
            
          </div>
        </div>
        <hr />
        <div className="bottom">
        <span style={{margin: "5px"}}>Add Thumbnail Image </span>

          <div className="left">
            <input
              type="file"
              id="file"
              style={{margin: "5px"}}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
              </div>
            </label>
           
            <div className="right">
            {file && (
              <img className="file" alt="" src={URL.createObjectURL(file)} />
            )}
          </div>
            
          </div>
          <div className="right">
            <button onClick={handleClick} style={{margin: "5px", padding:"5px"}}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;