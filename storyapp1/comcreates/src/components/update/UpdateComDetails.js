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
      id: series.id,
      userId: series.userId,
    });
  
    const upload = async (file) => {
      console.log(file)
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await makeRequest.post("/upload", formData);
         return {
      url: res.data.secure_url,
      publicId: res.data.public_id,
    };
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
  if (thumbnail && !(thumbnail.type && thumbnail.type.startsWith('image/'))) return alert("Please select an image file");

  let thumbnailUrl = series?.thumbnail;
  let thumbnailPublicId = series?.thumbnail_Id;

  if (thumbnail) {
    const uploadResult = await upload(thumbnail);
    thumbnailUrl = uploadResult.secure_url;
    thumbnailPublicId = uploadResult.public_id;
  }

  mutation.mutate({ 
    ...texts, 
    thumbnail: thumbnailUrl, 
    thumbnail_Id: thumbnailPublicId 
  });

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
    ? URL.createObjectURL(thumbnail)
    : series?.thumbnail?.startsWith("http")
      ? series.thumbnail
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
