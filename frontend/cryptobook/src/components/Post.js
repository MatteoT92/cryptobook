import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Post(props) {

    const [author, setAuthor] = useState(props.data.author.username);
    const [content, setContent] = useState(props.data.content);
    const [date, setDate] = useState(props.data.date);
    const [comments, setComments] = useState(props.data.comments);
    const [visibleTo, setVisibleTo] = useState(props.data.visibleTo);
    const [key, setKey] = useState("");
    const [idxPost, setIdxPost] = useState(props.key);

    useEffect(() => {
        setAuthor(props.data.author.username);
        setContent(props.data.content);
        setDate(props.data.date);
        setComments(props.data.comments);
        setVisibleTo(props.data.visibleTo);
    }, [props.data]);

    useEffect(() => {
        setKey(key);
    }, [key]);

    useEffect(() => {
        setIdxPost(props.key);
    }, [props.key]);

    const handleKey = (e) => {
        setKey(e.target.value);
    }

    function decryptMessage(idxMsg) {
        let message = document.getElementById(`ciphered-post${idxMsg}`).textContent;
        let key = document.getElementById(`fkey-post${idxMsg}`).value;
        fetch("http://localhost:5000/api/post/decrypt", {
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
            document.getElementById(`ciphered-post${idxMsg}`).innerHTML = data.message;
            setKey("");
        })
        .catch(err => console.log(err));
    }

    function toggleVisibility(idxMsg) {
        let key = document.getElementById(`fkey-post${idxMsg}`);
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
        <Card>
            <Card.Body>
                <Card.Title>
                    <div className="row d-flex m-1">
                        <i className="bi bi-person-fill"></i><h6 className="ms-1 me-1">{author}</h6>
                        <i className="bi bi-clock"></i><h6 className="ms-1">{new Date(date).toLocaleString()}</h6>
                    </div>
                </Card.Title>
                <Card.Text>
                    <code className="m-1" id={`ciphered-post${idxPost}`}>{content}</code>
                </Card.Text>
                <div className="col d-flex m-1">
                    <input className="form-control mb-1" type="password" id={`fkey-post${idxPost}`} placeholder="Secret Key" value={key} onChange={handleKey} />
                    <button className="btn btn-dark ms-1 mb-1" type="button" onClick={() => toggleVisibility(idxPost)}>
                        <i className="bi bi-eye"></i>
                    </button>
                    <button className="btn btn-warning ms-1 mb-1" type="button" onClick={() => decryptMessage(idxPost)}>
                        <i className="bi bi-unlock"></i>
                    </button>
                </div>
            </Card.Body>
        </Card>
    )

}

export default Post;