import React, {useEffect, useState} from 'react';
import Messages from './Messages';
import Friends from './Friends';

import 'bootstrap/dist/css/bootstrap.min.css';

function Chat(props) {

    const [message, setMessage] = useState("");
    const [key, setKey] = useState("");
    const [friends, setFriends] = useState([]);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        setMessage(message);
        setKey(key);
    }, [message, key]);

    useEffect(() => {
        messagesChat();
        friendsChat();
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
                receiver: sessionStorage.getItem("user"),
                message: message,
                date: new Date().toISOString()
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
        let username = sessionStorage.getItem("user");
        fetch(`http://localhost:5000/api/messages?username=${username}`, {
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
        let username = sessionStorage.getItem("user");
        fetch(`http://localhost:5000/api/friends?username=${username}`, {
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
                        <textarea className="form-control mt-1" id="message" rows="5" placeholder="Write a message ..." value={message} onChange={handleMessage}></textarea>
                        <div className="col text-end d-flex mt-1 mb-1">
                            <input className="form-control" id="key" placeholder="Secret Key" value={key} onChange={handleKey} />
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