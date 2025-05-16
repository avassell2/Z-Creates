import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { makeRequest } from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import "./UploadPage.scss";

const UploadPage = ({ setOpenUpdate, Currentpage, series, chapterId }) => {
  const { chapterNumber } = useParams(); 
  const [pageNumber, setPageNumber] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // =============== CREATE PAGE ===============
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !file.type.startsWith("image/")) return alert("Please select an image file");

    const formData = new FormData();
    formData.append("pageNumber", pageNumber);
    formData.append("chapterId", chapterId);
    formData.append("file", file);

    try {
      await makeRequest.post(`/pages`, formData);
      queryClient.invalidateQueries(["pages"]);
      alert("Page submitted!");
      setPageNumber("");
      setFile(null);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload page.");
    }
  };

  // =============== UPDATE PAGE ===============
  const mutation = useMutation(
    (formData) => makeRequest.put("/pages", formData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["pages"]);
        alert("Page updated!");
        setFile(null);
      },
    }
  );

  const handleClickUpdate = async (e) => {
    e.preventDefault();
    if (!file || !file.type.startsWith("image/")) return alert("Please select an image file");

    const formData = new FormData();
    formData.append("id", Currentpage.id);       // Page ID for update
    formData.append("file", file);               // New image file

    mutation.mutate(formData);
  };

  return (
    <div>
      <h2>Add New Page to Chapter</h2>
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
};

export default UploadPage;
