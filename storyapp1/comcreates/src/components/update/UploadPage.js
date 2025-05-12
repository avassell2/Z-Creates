import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { makeRequest } from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import "./UploadPage.scss";



const UploadPage =({setOpenUpdate,Currentpage,series, chapterId}) => {
const { chapterNumber } = useParams(); 
  const [pageNumber, setPageNumber] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select an image file");

    const formData = new FormData();
    formData.append("pageNumber", pageNumber);
    formData.append("image", file);
    formData.append("chapterId", chapterId);


    try {
           
          const res = await makeRequest.post(`/pages/${chapterId}/upload`, formData);
          queryClient.invalidateQueries(["pages"]);
          alert("Page submitted!");
         }  catch (error) {
      console.error("Upload failed:", error);
    }
  };


  


 


  const queryClient = useQueryClient();

const uploadUpdate = async (file, chapterId) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    // Send chapterId as query param (since backend uses req.query.chapterId)
    const res = await makeRequest.post(`/updatePage?chapterId=${chapterId}`, formData);
    return res.data; // returns filename
  } catch (err) {
    console.log("uploadUpdate error", err);
  }
};

  const mutation = useMutation(
        (page) => {
          return makeRequest.put("/pages", page);
        },
        {
          onSuccess: () => {
            // Invalidate and refetch
           
            queryClient.invalidateQueries(["pages"]);
            alert("Page updated!");
          },
         
        }
      );

     const handleClickUpdate = async (e) => {
  e.preventDefault();
  if (!file) return alert("Please select an image file");

  const UpdateImgUrl = await uploadUpdate(file, chapterId); // 

  mutation.mutate({
    imageUrl: UpdateImgUrl,
    id: Currentpage.id,
  });
};




  

  return (
    <div>
      <h2>Add New Page to Chapter {chapterId}</h2>
      <form className="AddPageContainer" onSubmit={handleSubmit}>
        <input 
          type="number" 
          placeholder="Page Number" 
          value={pageNumber} 
          onChange={(e) => setPageNumber(e.target.value)} 
          required 
        />
        <input type="file" accept="image/*" onChange={handleFileChange} required />
        <button type="submit">Submit New Page</button>
      </form>
       
      <h2>Replace Current Page Image</h2>
      <form className="ChangePageContainer" onSubmit={handleClickUpdate}>
       
        <input type="file" accept="image/*" onChange={handleFileChange} required />
        <button type="submit">Update Image</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default UploadPage;
