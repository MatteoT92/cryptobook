import React, {useEffect, useState} from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

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

    const decryptMessage = (e) => {
        let message = document.getElementById("ciphered-msg").textContent;
        let key = document.getElementById("fkey").value;
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
            document.getElementById("ciphered-msg").innerHTML = data.message;
            setKey("");
        })
        .catch(err => console.log(err));
    }

    return (
        <div className="m-1 col-6">
            {messages.map((message, i) => (
                <div className="msg-received" key={i}>
                    <div className="col d-flex m-1">
                        <i className="bi bi-person"></i><h6 className="ms-1 me-1">{message.sender}</h6>
                        <i className="bi bi-clock"></i><h6 className="ms-1">{new Date(message.date).toLocaleString()}</h6>
                    </div>
                    <h6 id="ciphered-msg">{message.message}</h6>
                    <div className="col d-flex m-1">
                        <input className="form-control" id="fkey" placeholder="Secret Key" value={key} onChange={handleKey} />
                        <button className="btn btn-warning ms-1" type="button" onClick={decryptMessage}>
                            <i className="bi bi-unlock"></i>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )

}

export default Messages;