import React from 'react';
import '../../App.css';
import './home.scss';
import './../comics.scss';
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Comic from "../comic";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
const Home = ({userId}) => {
  const { data =[] } =  useQuery({
    queryKey: ["series"],
    queryFn: async () => {
       const res = await makeRequest.get("/series?userId="+userId); 
            return res.data;
        
    },
  });
  

  return (
    <div className="posts">
      
      {
      data?.map((comic) => <Comic comic={comic} key={comic.userId} />)
}</div>
  );
};



export default Home;

