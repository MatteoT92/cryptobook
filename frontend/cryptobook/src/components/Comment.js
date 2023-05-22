import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Comment(props) {

    const [author, setAuthor] = useState(props.data.author);
    const [content, setContent] = useState(props.data.content);
    const [date, setDate] = useState(props.data.date);
    const [key, setKey] = useState("");
    const [idxComment, setIdxComment] = useState(props.idx);
    const [username, setUsername] = useState("");

    useEffect(() => {
        setAuthor(props.data.author);
        setContent(props.data.content);
        setDate(props.data.date);
        usernameOfAuthor(props.data.author);
    }, [props.data]);

    useEffect(() => {
        setKey(key);
    }, [key]);

    const handleKey = (e) => {
        setKey(e.target.value);
    }

    function decryptMessage(idxMsg) {
        let message = document.getElementById(`ciphered-comment${idxMsg}`).textContent;
        let key = document.getElementById(`fkey-comment${idxMsg}`).value;
        fetch("http://localhost:5000/api/comment/decrypt", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message,
                key: key
            })
        })
        .then(res => res.json())
        .then(data => {
            document.getElementById(`ciphered-comment${idxMsg}`).innerHTML = data.message;
            setKey("");
        })
        .catch(err => console.log(err));
    }

    function toggleVisibility(idxMsg) {
        let key = document.getElementById(`fkey-comment${idxMsg}`);
        let iconVisibility = document.getElementById(`eye-fkey-comment${idxMsg}`);
        if (key.type === "password") {
            key.type = "text";
            iconVisibility.className = "bi bi-eye-slash";
        } else {
            key.type = "password";
            iconVisibility.className = "bi bi-eye";
        }
    }

    function usernameOfAuthor(id) {
        fetch(`http://localhost:5000/api/users/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(data => {
            setUsername(data.username);
        })
        .catch(err => console.log(err));
    }

    return (
        <Card bg="dark" className="m-1">
            <Card.Body>
                <Card.Title className="d-flex m-1">
                    <i className="bi bi-person-fill"></i><h6 className="ms-1 me-1">{username}</h6>
                    <i className="bi bi-clock"></i><h6 className="ms-1">{new Date(date).toLocaleString()}</h6>
                </Card.Title>
                <Card.Text>
                    <code className="m-1" id={`ciphered-comment${idxComment}`}>{content}</code>
                </Card.Text>
                <div className="col d-flex m-1">
                    <input className="form-control mb-1" type="password" id={`fkey-comment${idxComment}`} placeholder="Secret Key" value={key} onChange={handleKey} />
                    <button className="btn btn-dark ms-1 mb-1" type="button" onClick={() => toggleVisibility(idxComment)}>
                        <i className="bi bi-eye" id={`eye-fkey-comment${idxComment}`}></i>
                    </button>
                    <button className="btn btn-warning ms-1 mb-1" type="button" onClick={() => decryptMessage(idxComment)}>
                        <i className="bi bi-unlock"></i>
                    </button>
                </div>
            </Card.Body>
        </Card>
    )

}

export default Comment;