import { useState } from "react";
import { makeRequest } from "../../axios";
import "./update.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";


const UpdateComDetails = ({setOpenUpdate, series}) => {
    const [thumbnail, setThumbnail] = useState(null);
    const [texts, setTexts] = useState({
      title: series.title,
      desc: series.desc,
      thumbnail_Id: series.thumbnail_Id,
      id: series.id,
      userId: series.userId,
    });
  
    const upload = async (file) => {
      console.log(file)
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await makeRequest.post("/upload", formData);
        return res.data;
      } catch (err) {
        console.log(err);
      }
    };
  
    const handleChange = (e) => {
      setTexts((prev) => ({ ...prev, [e.target.name]: [e.target.value] }));
    };
  
    const queryClient = useQueryClient();
  
    const mutation = useMutation(
      (series) => {
        return makeRequest.put("/series", series);
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
    if (!thumbnail) return alert("Please select an image file");
    if (thumbnail && !(thumbnail.type && thumbnail.type.startsWith('image/'))) return alert("Please select an image file"); //stop user from uploading non-images
  
      //TODO: find a better way to get image URL
      
      let thumbnailUrl;
      thumbnailUrl = thumbnail ? await upload(thumbnail) : series?.thumbnail;
   
      
      mutation.mutate({ ...texts, thumbnail: thumbnailUrl });
      setOpenUpdate(false);
      setThumbnail(null);
    };
    
    return (
      <div className="update">
        <div className="wrapper">
          <h1>Update Your Profile</h1>
          <form>
            <div className="files">
              <label htmlFor="thumbnail">
                <span>Series Thumbnail</span>
                <div className="imgContainer">
                  <img
                    src={
                      thumbnail
                        ? URL?.createObjectURL(thumbnail)
                        : "https://z-creates-production.up.railway.app/upload/" + series?.thumbnail
                    }
                    alt=""
                  />
                  <CloudUploadIcon className="icon" />
                </div>
              </label>
              <input
                type="file"
                accept="image/*"
                id="thumbnail"
                style={{ display: "none" }}
                onChange={(e) => setThumbnail(e.target.files[0])}
              />

           
              
            </div>

            <label>Series Title</label>
            <input
              type="text"
              value={texts.title}
              name="title"
              onChange={handleChange}
            />

            <label>Description</label>
            <input
              type="text"
              value={texts.desc}
              name="desc"
              onChange={handleChange}
            />
           
           
           
            <button onClick={handleClick}>Update</button>
          </form>
          <button className="close" onClick={() => setOpenUpdate(false)}>
            close
          </button>
        </div>
      </div>
    );
}


export default UpdateComDetails;
