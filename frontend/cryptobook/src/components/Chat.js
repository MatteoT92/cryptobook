import React, {useEffect, useState} from 'react';
import Messages from './Messages';
import Friends from './Friends';

import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

function Chat(props) {

    const [message, setMessage] = useState("");
    const [key, setKey] = useState("");
    const [friends, setFriends] = useState([]);
    const [messages, setMessages] = useState([]);
    const [friend, setFriend] = useState(sessionStorage.getItem("friend"));

    useEffect(() => {
        setMessage(message);
        setKey(key);
    }, [message, key]);

    useEffect(() => {
        setMessages([]);
        messagesChat();
    }, [friend]);

    useEffect(() => {
        const refresh = setInterval(() => {
          setFriend(sessionStorage.getItem("friend"));
          messagesChat();
          friendsChat();
        }, 1000);
        return () => clearInterval(refresh);
      }, []);

    const handleMessage = (e) => {
        setMessage(e.target.value);
    }

    const handleKey = (e) => {
        setKey(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let message = document.getElementById("message").value;
        fetch("http://localhost:5000/api/msg/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                sender: sessionStorage.getItem("user"),
                receiver: sessionStorage.getItem("friend"),
                message: message
            })
        }).then(res => res.json())
        .then(data => {
            setMessage("");
            setKey("");
            messagesChat();
        })
        .catch(err => console.log(err));
    }

    const messagesChat = () => {
        let user = sessionStorage.getItem("user");
        let friend = sessionStorage.getItem("friend");
        fetch(`http://localhost:5000/api/messages?user=${user}&friend=${friend}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(data => {
            setMessages(data.messages);
        })
        .catch(err => console.log(err));     
    }

    const friendsChat = () => {
        let user = sessionStorage.getItem("user");
        fetch(`http://localhost:5000/api/friends?user=${user}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(data => {
            setFriends(data.friends);
        })
        .catch(err => console.log(err));     
    }

    const encryptMessage = (e) => {
        let message = document.getElementById("message").value;
        let key = document.getElementById("key").value;
        fetch("http://localhost:5000/api/msg/encrypt", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message,
                key: key
            })
        }).then(res => res.json())
        .then(data => {
            setKey("");
            setMessage(data.message);
        })
        .catch(err => console.log(err));
    }

    const toggleVisibility = (e) => {
        let key = document.getElementById("key");
        let iconVisibility = document.getElementsByClassName("bi bi-eye");
        if (key.type === "password") {
            key.type = "text";
            iconVisibility.className = "bi bi-eye-slash";
        } else {
            key.type = "password";
            iconVisibility.className = "bi bi-eye";
        }
    }

    return (
        <div className="d-flex container-fluid">
            <div className="col-4 mt-1 ms-1 border border-dark border-2 rounded-4">
                <Friends data={friends} />
            </div>
            <div className="col-8 mt-1 ms-1 border border-dark border-2 rounded-4">
                <div className="row ms-1 me-1">
                    <Messages data={messages} />
                </div>
                <div className="row ms-1 me-1">
                    <form onSubmit={handleSubmit}>
                        <textarea className="form-control mt-1" id="message" rows="3" placeholder="Write a message ..." value={message} onChange={handleMessage}></textarea>
                        <div className="col text-end d-flex mt-1 mb-1">
                            <input className="form-control" type="password" id="key" placeholder="Secret Key" value={key} onChange={handleKey} />
                            <button className="btn btn-dark ms-1" type="button" onClick={toggleVisibility}>
                                <i className="bi bi-eye"></i>
                            </button>
                            <button className="btn btn-warning ms-1" type="button" onClick={encryptMessage}>
                                <i className="bi bi-lock"></i>
                            </button>
                            <button className="btn btn-success ms-1" type="submit">
                                <i className="bi bi-send"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )

}

export default Chat;