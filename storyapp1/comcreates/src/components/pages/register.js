import React from 'react';
import '../../App.css';
import { useState } from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import "./register.css";
import { makeRequest } from "../../axios";


  const Register = () => {
    const navigate = useNavigate();


    const [inputs, setInputs] = useState({
      username: "",
      email: "",
      password: "",
      name: "",
    });
    const [err, setErr] = useState(null);


    const handleChange = (e) => {
      setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
  
    const handleClick = async (e) => {
      e.preventDefault();
  
      try {
        // await axios.post("http://localhost:8800/api/auth/register", inputs);
        await makeRequest.post("/auth/register", inputs);
        alert("Account created!")
        navigate(`/login`);
      } catch (err) {
        setErr(err.response.data);
      }
    };
  
    console.log(err)



  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Z-Creates</h1>
          <p>
            Register now and post your graphic novel or comic for all to see!
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
          <button>Login</button>
          </Link>
        </div>
        <div className="right">
        <h1>Register</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Name"
              name="name"
              onChange={handleChange}
            />
            {err && err}
            <button onClick={handleClick}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
