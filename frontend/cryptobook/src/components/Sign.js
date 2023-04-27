import React, {useEffect, useState} from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

function Sign(props) {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        setUsername(username);
        setEmail(email);
        setPassword(password);
    }, [username, email, password]);

    const handleUsername = (e) => {
        setUsername(e.target.value);
    }

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:5000/sign", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: e.target.username.value,
                email: e.target.email.value,
                password: e.target.password.value
            })
        }).then(res => res.json())
        .then(data => {
            if (data.status === 200) {
                alert("Sign up successful!");
            } else {
                alert("Sign up failed!");
            }
            setUsername("");
            setEmail("");
            setPassword("");
        })
    }

    const toggleVisibility = (e) => {
        let password = document.getElementById("pwd");
        let iconVisibility = document.getElementsByClassName("bi bi-eye");
        if (password.type === "password") {
            password.type = "text";
            iconVisibility.className = "bi bi-eye-slash";
        } else {
            password.type = "password";
            iconVisibility.className = "bi bi-eye";
        }
    }

    const backgroundImage = {
        backgroundImage: "url(" + process.env.PUBLIC_URL + "10.webp)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat"
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center align-items-center">
                <form className="col-6 ml-auto sign" onSubmit={handleSubmit} style={backgroundImage}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" className="form-control" id="username" placeholder="Username" value={username} onChange={handleUsername} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" value={email} onChange={handleEmail} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="d-flex">
                            <input type="password" className="form-control" id="pwd" placeholder="Password" value={password} onChange={handlePassword} />
                            <button className="btn btn-light" type="button" onClick={toggleVisibility}>
                                <i className="bi bi-eye"></i>
                            </button>
                        </div>
                    </div>
                    <div className="col text-center mt-2">
                        <button type="submit" className="btn btn-primary">Sign me!</button>
                    </div>
                    <div className="row text-center">
                        <p>You are already signed? <strong><u>Then log in!</u></strong></p>
                    </div>
                </form>
            </div>
        </div>
    )

}

export default Sign;