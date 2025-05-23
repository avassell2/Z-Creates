import { useState } from "react";
import { makeRequest } from "../../axios";
import "./update.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";


const Update = ({setOpenUpdate, user}) => {
    const [cover, setCover] = useState(null);
    const [profile, setProfile] = useState(null);
    const [texts, setTexts] = useState({
      email: user.email,
      password: user.password,
      name: user.name,
      city: user.city,
      website: user.website,
    });








  
   const upload = async (file) => {
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
      (user) => {
        return makeRequest.put("/users", user);
      },
      {
        onSuccess: () => {
          alert("Profile updated!");
          // Invalidate and refetch
          queryClient.invalidateQueries(["user"]);
        },
       
      }
    );

    
  
   const handleClick = async (e) => {
  e.preventDefault();

  if ((cover && !(cover.type && cover.type.startsWith('image/'))))  
    return alert("Please select an image file for the cover picture");
  if ((profile && !(profile.type && profile.type.startsWith('image/')))) 
    return alert("Please select an image file for the profile picture");

  let coverData = cover ? await upload(cover) : { 
    url: user?.coverPic, 
    publicId: user?.coverPicId 
  };

  let profileData = profile ? await upload(profile) : { 
    url: user?.profilePic, 
    publicId: user?.profilePicId 
  };

  mutation.mutate({
    ...texts,
    coverPic: coverData.url,
    coverPicId: coverData.publicId,
    profilePic: profileData.url,
    profilePicId: profileData.publicId,
  });

  setOpenUpdate(false);
  setCover(null);
  setProfile(null);
};



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
  
  
    
    return (
      <div className="update">
        <div className="wrapper">
          <h1>Update Your Profile</h1>
          <form>
            <div className="files">
              <label htmlFor="cover">
                <span>Cover Picture</span>
                <div className="imgContainer">
                  <img
                    src={
                      cover
                        ? URL?.createObjectURL(cover)
                        : getImagePath(user?.coverPic)
                    }
                    alt=""
                  />
                  <CloudUploadIcon className="icon" />
                </div>
              </label>
              <input
                type="file"
                accept="image/*"
                id="cover"
                style={{ display: "none" }}
                onChange={(e) => setCover(e.target.files[0])}
                required
              />
              <label htmlFor="profile">
                <span>Profile Picture</span>
                <div className="imgContainer">
                  <img
                    src={
                      profile
                        ? URL?.createObjectURL(profile)
                        : getImagePath(user?.profilePic)
                    }
                    alt=""
                  />
                  <CloudUploadIcon className="icon" />
                </div>
              </label>
              <input
                type="file"
                accept="image/*"
                id="profile"
                style={{ display: "none" }}
                onChange={(e) => setProfile(e.target.files[0])}
                required
              />
            </div>
            <label>Email</label>
            <input
              type="text"
              value={texts.email}
              name="email"
              onChange={handleChange}
            />
            <label>Password</label>
            <input
              type="text"
              value={texts.password}
              name="password"
              onChange={handleChange}
            />
            <label>Name</label>
            <input
              type="text"
              value={texts.name}
              name="name"
              onChange={handleChange}
            />
            <label>Country / City</label>
            <input
              type="text"
              name="city"
              value={texts.city}
              onChange={handleChange}
            />
            <label>Website</label>
            <input
              type="text"
              name="website"
              value={texts.website}
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


export default Update;
