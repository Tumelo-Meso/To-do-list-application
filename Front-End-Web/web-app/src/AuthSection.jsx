// AuthSection.jsx
import React, { useState } from "react";
import "./css/AuthSection.css";
import Footer from "./components/footer.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";

const AuthSection = () => {
  const [activeTab, setActiveTab] = useState("login"); // 'login' or 'register'

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const baseUrl = "https://to-do-list-application-production.up.railway.app";

  const [reqData, setReqData] = useState("");
  const handleLogin = async () => {
    
    if(!loginEmail || !loginPassword){
        alert("Fill in all the required fields")
    }
    else if(!emailRegex.test(loginEmail)){
        alert("Enter a valid email address")
    }

    try {
        
        const email = loginEmail;
        const password = loginPassword;
        const response = await fetch(baseUrl+"/login",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email,password
            })
        })

        const data = await response.json();

        if(!response.ok){
            return setReqData(data.message)
        }

        localStorage.setItem("token",JSON.stringify(data))


    } catch (error) {
        console.log(error)
        
    }

  };

  const handleRegister = async () => {
    
    if(!regName || !regPassword || !regEmail){
        alert("Fill in all the required fields")
    }
    else if(!emailRegex.test(regEmail)){
        alert("Enter a valid email address")
    }


  };

  return (
    <>
        <div className="auth-container">

            <div className="head-section">
                   <h1 >To Do Pro 
                    
                    </h1>
                <FontAwesomeIcon icon={faList}  style={{fontSize:"28px"}}/>

                <p>{reqData}</p>
            </div>
         
      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "login" ? "active" : ""}
          onClick={() => setActiveTab("login")}
        >
          Login
        </button>
        <button
          className={activeTab === "register" ? "active" : ""}
          onClick={() => setActiveTab("register")}
        >
          Register
        </button>
      </div>

      {/* Login Form */}
      {activeTab === "login" && (
        <div className="form-container">
             <h2>Welcome Back</h2>
             <h3>Login to your account</h3>
          <input
            type="email"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      )}

      {/* Register Form */}
      {activeTab === "register" && (
        <div className="form-container">
          <input
            type="text"
            placeholder="Full Name"
            value={regName}
            onChange={(e) => setRegName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={regEmail}
            onChange={(e) => setRegEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
          />
          <button onClick={handleRegister}>Register</button>
        </div>
      )}


    </div>

    <Footer></Footer>
    </>

  );
};

export default AuthSection;