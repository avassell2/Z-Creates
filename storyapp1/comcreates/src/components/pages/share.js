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
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return {
        url: res.data.secure_url,
        publicId: res.data.public_id,
      };
    } catch (err) {
      console.log("Upload error:", err);
      return null;
    }
  };

  const mutation = useMutation(
    (newPost) => makeRequest.post("/series", newPost),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["series"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();

    if (!title.trim()) return alert("Please enter a title");
    if (!file || !file.type.startsWith("image/")) return alert("Please select a valid image file");

    const uploadResult = await upload();
    if (!uploadResult) return alert("Image upload failed");

    mutation.mutate({
      title,
      desc,
      thumbnail: uploadResult.url,
      thumbnail_Id: uploadResult.publicId,
    });

    setTitle("");
    setDesc("");
    setFile(null);

    alert("Series created!");
    navigate(`/profile/${currentUser.id}`);
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="x">
            <input
              type="text"
              placeholder="Title of story"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              style={{ margin: "5px" }}
            />
          </div>

          <div className="left">
            <img
              src={
                currentUser?.profilePic?.startsWith("http")
                  ? currentUser.profilePic
                  : "/upload/" + currentUser.profilePic
              }
              alt=""
            />
            <input
              style={{ margin: "5px" }}
              type="text"
              placeholder="Description"
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
            />
          </div>
        </div>

        <hr />

        <div className="bottom">
          <span style={{ margin: "5px" }}>Add Thumbnail Image</span>

          <div className="left">
            <input
              type="file"
              id="file"
              accept="image/*"
              style={{ margin: "5px" }}
              onChange={(e) => setFile(e.target.files[0])}
            />

            <div className="right">
              {file && (
                <img
                  className="file"
                  alt=""
                  src={URL.createObjectURL(file)}
                />
              )}
            </div>
          </div>

          <div className="right">
            <button
              onClick={handleClick}
              style={{ margin: "5px", padding: "5px" }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
