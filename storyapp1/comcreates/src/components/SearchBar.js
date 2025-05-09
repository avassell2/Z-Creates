import React from 'react';
import { useState, useEffect, useRef } from "react";
import { makeRequest } from "../axios";
import { useNavigate } from "react-router-dom";
import './SearchBar.css';


const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ comics: [], users: [] });
  const navigate = useNavigate();
  const searchRef = useRef();


  const handleSearch = async () => {
    try {
      const res = await makeRequest.get(`/search?q=${query}`); // ✅ notice ?q not ?query
      const allResults = res.data;
  
      const comics = allResults.filter((item) => item.type === "comic");
      const users = allResults.filter((item) => item.type === "user");
  
      setResults({ comics, users });
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const handleNavigate = (type, id) => {
    if (type === "comic") {
      navigate(`/comic/${id}`);
    } else {
      navigate(`/profile/${id}`);
    }
  
    // Clear the input and results
    setQuery("");
    setResults({ comics: [], users: [] });
  };



// Hide results on outside click
useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setResults({ comics: [], users: [] });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);











  return (
    <div className="searchBar"  ref={searchRef}>
      <input
        type="text"
        placeholder="Search comics or users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <button onClick={handleSearch}>Search</button>

      <div className="results">
        
        {results.comics.map((comic) => (
          <div key={comic.id} onClick={() => handleNavigate("comic", comic.id)}>
            📘 {comic.name}
          </div>
        ))}

       
        {results.users.map((user) => (
          <div key={user.id} onClick={() => handleNavigate("user", user.id)}>
            👤 {user.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;