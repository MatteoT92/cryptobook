import React, {useEffect, useState} from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

function Chat(props) {

    const [message, setMessage] = useState("");
    const [key, setKey] = useState("");

    useEffect(() => {
        setMessage(message);
        setKey(key);
    }, [message, key]);

    const handleMessage = (e) => {
        setMessage(e.target.value);
    }

    const handleKey = (e) => {
        setKey(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
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
            setMessage(data.message);
            setKey("");
        })
        .catch(err => console.log(err));
    }

    return (
        <div className="d-flex container-fluid">
            <div className="col-4" style={{backgroundColor: "red"}}>
                Ciao
            </div>
            <div className="col-8">
                <div className="row" style={{backgroundColor: "blue"}}>
                    Miao
                </div>
                <div className="row" style={{backgroundColor: "yellow"}}>
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