import React, {useEffect, useState} from 'react';
import User from './User';
import Settings from './Settings';
import Users from './Users';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Posts from './Posts';

function Log(props) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(props.user);

    useEffect(() => {
      setUser(user);
      setUsername(user);
    }, [user]);

    const handleSubmit = (e) => {
      e.preventDefault();
      fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: e.target.username.value,
          password: e.target.password.value
        })
      }).then(res => res.json())
        .then(data => {
          setUser(data.username);
          sessionStorage.setItem("user", data.username);
        })
        .catch(err => console.log(err));
    }

    const handleChangeInputUsername = (e) => {
      setUsername(e.target.value);
    }

    const handleChangeInputPassword = (e) => {
      setPassword(e.target.value);
    }

    const logout = (e) => {
      setUser(null);
      setUsername(null);
      setPassword(null);
      sessionStorage.clear();
    }

    const toggleVisibility = (e) => {
      let password = document.getElementById("password");
      let iconVisibility = document.getElementsByClassName("bi bi-eye");
      if (password.type === "password") {
          password.type = "text";
          iconVisibility.className = "bi bi-eye-slash";
      } else {
          password.type = "password";
          iconVisibility.className = "bi bi-eye";
      }
    }

    if (user) {
      return (
        <div>
          <div className="d-flex">
            <User name={username} />
            <Posts />
            <Users />
            <Settings />
            <button className="btn" onClick={logout}>
              <i className="bi bi-x-circle-fill h1 logout"></i>
            </button>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <form className="d-flex" onSubmit={handleSubmit}>
            <input type="text" className="form-control me-2" id="username" placeholder="Username" value={username} onChange={handleChangeInputUsername} />
            <input type="password" className="form-control me-2" id="password" placeholder="Password" value={password} onChange={handleChangeInputPassword} />
            <button className="btn btn-dark ms-1" type="button" onClick={toggleVisibility}>
              <i className="bi bi-eye"></i>
            </button>
            <button className="btn" type="submit">
              <i className="bi bi-box-arrow-in-right h1 login"></i>
            </button>
          </form>
        </div>
      )
    }

}

export default Log;