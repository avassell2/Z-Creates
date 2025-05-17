import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { makeRequest } from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import "./UploadPage.scss";



const UploadPage = ({ setOpenUpdate, Currentpage, series, chapterId, fetchPages }) => {
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
    if (file && !(file.type && file.type.startsWith('image/'))) return alert("Please select an image file"); //stop user from uploading non-images


    const formData = new FormData();
    formData.append("pageNumber", pageNumber);
    formData.append("file", file);
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

 


 const uploadUpdate = async (file) => {
    console.log(file)
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post(`/updatePage`, formData);
      return res.data; // should include: { secure_url, public_id }
    } catch (err) {
      console.log(err);
    }
  };

  const mutation = useMutation(
        (page) => {
          return makeRequest.put("/pages", page);
        },
        {
          onSuccess: () => {
           
            // Invalidate and refetch
           
            fetchPages();
            alert("Page updated!");
          },
         
        }
      );

      const handleClickUpdate = async (e) => {
      
    
        e.preventDefault();
    if (!file) return alert("Please select an image file");
    if (file && !(file.type && file.type.startsWith('image/'))) return alert("Please select an image file"); //stop user from uploading non-images


    const cloudinaryRes = file ? await uploadUpdate(file) : null;
const UpdateImgUrl = cloudinaryRes?.secure_url || Currentpage?.imageUrl;



        mutation.mutate({
          imageUrl: cloudinaryRes.secure_url,
          publicId: cloudinaryRes.public_id,
          id: Currentpage.id,
          userId: series?.userId,
        });

      
            
            alert("Page updated!");
         
      } 
      

  

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
