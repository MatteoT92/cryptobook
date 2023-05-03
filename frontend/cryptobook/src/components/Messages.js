import React, {useEffect, useState} from 'react';
import User from './User';

import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

function Messages(props) {

    const [messages, setMessages] = useState(props.data);
    const [key, setKey] = useState("");

    useEffect(() => {
        setMessages(props.data);
    }, [props.data]);

    useEffect(() => {
        setKey(key);
    }, [key]);

    const handleKey = (e) => {
        setKey(e.target.value);
    }

    function decryptMessage(idxMsg) {
        let message = document.getElementById(`ciphered-msg${idxMsg}`).textContent;
        let key = document.getElementById(`fkey${idxMsg}`).value;
        fetch("http://localhost:5000/api/msg/decrypt", {
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
            document.getElementById(`ciphered-msg${idxMsg}`).innerHTML = data.message;
            setKey("");
        })
        .catch(err => console.log(err));
    }

    function toggleVisibility(idxMsg) {
        let key = document.getElementById(`fkey${idxMsg}`);
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
        <div>
            <div>
                <div className="d-inline-flex">
                    <User name={sessionStorage.getItem("friend")} />
                    <i className="bi bi-arrow-left-right h1"></i>
                    <User name={sessionStorage.getItem("user")} />
                </div>
            </div>
            <div className="m-1 col box-messages">
                {messages.map((message, i) => (
                    <div className={message.sender.username === sessionStorage.getItem("user") ? "msg-received float-end mt-1 mb-1 col-7" : "msg-received float-start mt-1 mb-1 col-7"} key={i}>
                        <div className="col d-flex m-1">
                            <i className="bi bi-person-fill"></i><h6 className="ms-1 me-1">{message.sender.username}</h6>
                            <i className="bi bi-clock"></i><h6 className="ms-1">{new Date(message.date).toLocaleString()}</h6>
                        </div>
                        <code className="m-1" id={`ciphered-msg${i}`}>{message.message}</code>
                        <div className="col d-flex m-1">
                            <input className="form-control mb-1" type="password" id={`fkey${i}`} placeholder="Secret Key" value={key} onChange={handleKey} />
                            <button className="btn btn-dark ms-1 mb-1" type="button" onClick={() => toggleVisibility(i)}>
                                <i className="bi bi-eye"></i>
                            </button>
                            <button className="btn btn-warning ms-1 mb-1" type="button" onClick={() => decryptMessage(i)}>
                                <i className="bi bi-unlock"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

}

export default Messages;