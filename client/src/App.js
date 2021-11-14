import React, { useState } from "react";

import axios from "axios";
import jwt_decode from "jwt-decode";

import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const refreshToken = async () => {
    try {
      // api request

      const res = await axios.post("/refresh", { token: user.refreshToken });

      setUser({
        ...user,
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      });

      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async config => {
      let currentDate = new Date();

      const decodedToken = jwt_decode(user.accessToken);

      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        const data = await refreshToken();

        config.headers["authorization"] = "Bearer " + data.accessToken;
      }

      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      // api request
      const res = await axios.post("/login", { username, password });

      setUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async id => {
    setSuccess(false);
    setError(false);

    try {
      // api request
      await axiosJWT.delete("/users/" + id, {
        headers: { authorization: "Bearer " + user.accessToken },
      });
      setSuccess(true);
    } catch (error) {
      setError(true);
    }
  };

  return (
    <>
      <div className="container">
        {user ? (
          <div className="home">
            <span>
              Welcome to the <b>{user.isAdmin ? "admin" : "user"}</b> dashborad{" "}
              <b>{user.username}</b>.
            </span>
            <span>Delete Users : </span>
            <button className="deleteButton" onClick={() => handleDelete(1)}>
              Delete John
            </button>
            <button className="deleteButton" onClick={() => handleDelete(2)}>
              Delete Jane
            </button>
            {error && (
              <span className="error">
                Yor are not allowed to delete this user!
              </span>
            )}
            {success && (
              <span className="success">
                User has been deleted successfully...
              </span>
            )}
          </div>
        ) : (
          <div className="login">
            <form onSubmit={handleSubmit}>
              <span className="formTitle">Login</span>
              <input
                type="text"
                placeholder="User Name"
                onChange={e => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                onChange={e => setPassword(e.target.value)}
              />
              <button type="submit" className="submitButton">
                Login
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
