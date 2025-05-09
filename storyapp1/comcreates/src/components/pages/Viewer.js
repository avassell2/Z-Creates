import React from "react";
import { useParams,useNavigate } from "react-router-dom";
import { useState, useEffect, useRef  } from "react";
import dummyComics from "../dummyComics"; // Import dummy data
import UploadPage from "../update/UploadPage";
import { makeRequest } from "../../axios";
import './Viewer.scss';
import { AuthContext } from "../authContext";
import { useContext } from "react";
import { useLocation } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";



const Viewer = () => {
 
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
 const { currentUser } = useContext(AuthContext);
 const [menuOpen, setMenuOpen] = useState(false);
 const queryClient = useQueryClient();
  const [openUpdate, setOpenUpdate] = useState(false);
  const [chapters, setChapters] = useState([]);


const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
 

 const navigate = useNavigate();

 const usePreviousParams = () => {
  const params = useParams();
  const prevParamsRef  = useRef(null);

  useEffect(() => {
    prevParamsRef .current = params;
  }, [params]);

 
  return prevParamsRef .current;
};

const prevParams  = usePreviousParams();
const seriesId = prevParams?.seriesId; // 👈 Extract directly
const {chapterId} = useParams(); //This is actually the chapterNumber in the URL
//const  chapterId  = chapters[currentChapterIndex]?.id;
console.log(`chaps id:   ${chapters[currentChapterIndex]?.id}` )

console.log("aaaaaaaaa"+seriesId);


  
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await makeRequest.get(`/pages?chapterId=${chapters[currentChapterIndex]?.id}`);
        setPages(res.data); // Store pages in state
        queryClient.invalidateQueries(["pages"])
      } catch (error) {
        console.error("Error fetching pages:", error);
      }
    };

    fetchPages();
  }, [chapters[currentChapterIndex]?.id]);

  const nextPage = () => {
    if (currentPage < pages.length - 1) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" && currentPage < pages.length - 1) {
        setCurrentPage((prev) => prev + 1);
      } else if (e.key === "ArrowLeft" && currentPage > 0) {
        setCurrentPage((prev) => prev - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, pages.length]);


  
  
  
  
  
  
  
  const { data: seriesData, error: seriesError } = useQuery({
    queryKey: ["series", seriesId],
    queryFn: async () => {
      const res = await makeRequest.get(`/series/find/${seriesId}`);
      
      return res.data;
    },
  });



  const handleNextChapter = () => {
    if (currentChapterIndex < chapters?.length - 1) {
      const nextChapter = chapters[currentChapterIndex + 1];
      setCurrentPage(0); //start at 1st page upon entering a new chapter
      navigate(`/viewer/${seriesId}/${nextChapter.chapterNumber}`);
    }
  };
  
  const handlePreviousChapter = () => {
    if (currentChapterIndex > 0) {
      const prevChapter = chapters[currentChapterIndex - 1];
     setCurrentPage(0); //start at 1st page upon entering a new chapter
      navigate(`/viewer/${seriesId}/${prevChapter.chapterNumber}`);
    }
  };


  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const res = await makeRequest.get(`/chapters?seriesId=${seriesId}`);
        
        const fetchedChapters = res.data;
  
        // Reverse only for navigation logic
        const reversedChapters = [...fetchedChapters].reverse();
        setChapters(reversedChapters);
  
        const index = reversedChapters.findIndex((c) => c.chapterNumber === parseInt(chapterId));
        if (index !== -1) {
          setCurrentChapterIndex(index);
          console.log("ssssssssssaaaaaaa "+ index );
        }
      } catch (err) {
        console.error("Error fetching chapters:", err);
      }
    };
  
    fetchChapters();
  }, [seriesId, chapterId]);

  
  const deleteMutation = useMutation(
    (pageId) => {
      return makeRequest.delete("/pages/" + pageId);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["pages"]);
      },
    }
  );

  const handleDelete = () => {
    const confirmed = window.confirm("Are you sure you want to delete this page?");
    if (confirmed) {
      // Proceed with deletion
    deleteMutation.mutate(pages[currentPage].id);
    alert("Page deleted successfully!");
    navigate(0); // Navigates to the current route
    }
  };


  const getImagePath = (imageName) => {
    
      return require(`../../chapterPages/${imageName}`);
    
  };
  
  let intialBtnText = "Edit";
  
    const [buttonText, setButtonText] = useState(intialBtnText); //same as creating your state variable where "Next" is the default value for buttonText and setButtonText is the setter function for your state variable instead of setState
   
    
    const handleBtnText = () => {
      setButtonText((state) => (state === "x" ? intialBtnText : "x"));
    };


    const handleTitcleClick = () => {
      
      
        // Proceed with deletion
      
        navigate(`/comic/${seriesId}`);
      
    };
  

  return (
    
    <div className="container">

{Number(seriesData?.userId) === currentUser?.id ?  
<button onClick={() =>{ 
  
  
  setMenuOpen(!menuOpen);
  handleBtnText();
}
}> {buttonText} </button> 
:null}



      {menuOpen && Number(seriesData?.userId) === currentUser?.id ?  
      <div className="uploadContainer">
       {<UploadPage setOpenUpdate={setOpenUpdate} Currentpage={pages[currentPage]} series ={seriesData} chapterId={chapters[currentChapterIndex]?.id} />}
       <button className="deletaPageBtn" onClick={handleDelete}>Delete Current Page</button>
       </div> :null}
       
      <h1>Chapter {chapterId}</h1>
      {pages.length > 0 ? (
        <div className="viwerContainer">

<div>
 


 <div className="btnContainerChap">
 <button className="seriesButton" onClick={handleTitcleClick}>{chapters[currentChapterIndex]?.title || "Loading..."}</button>
  <button className="prevBtnChap" onClick={handlePreviousChapter} disabled={currentChapterIndex === 0}>
    Previous Chapter
  </button>

  <h1 className="pageNum" >Page: {currentPage + 1}</h1>

  <button className="nextBtnChap" onClick={handleNextChapter} disabled={currentChapterIndex === chapters.length - 1}>
    Next Chapter
  </button>
  </div>
</div>

         
         <div className="btnContainer">
            <button className="prevBtn" onClick={prevPage} disabled={currentPage === 0}>Previous</button>
            <button className="nextBtn" onClick={nextPage} disabled={currentPage === pages.length - 1}>Next</button>
          </div>

          <img className="Page"
 src={getImagePath(pages[currentPage]?.imageUrl)}
  alt=""
  onClick={nextPage} disabled={currentPage === pages.length - 1}
/> 



          <div className="btnContainer">
            <button className="prevBtn" onClick={prevPage} disabled={currentPage === 0}>Previous</button>
            <button className="nextBtn" onClick={nextPage} disabled={currentPage === pages.length - 1}>Next</button>
          </div>

          <div>
 


 <div className="btnContainerChap">
 <button className="seriesButton" onClick={handleTitcleClick}>{chapters[currentChapterIndex]?.title || "Loading..."}</button>
  <button className="prevBtnChap" onClick={handlePreviousChapter} disabled={currentChapterIndex === 0}>
    Previous Chapter
  </button>

  <h1 className="pageNum" >Page: {currentPage + 1}</h1>

  <button className="nextBtnChap" onClick={handleNextChapter} disabled={currentChapterIndex === chapters.length - 1}>
    Next Chapter
  </button>
  </div>
</div>



        </div>
      ) : (
        <p>No pages available</p>
      )}
    </div>
  );
}

export default Viewer;