import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function CommentToShare(props) {

    const [show, setShow] = useState(false);
    const [comment, setComment] = useState("");
    const [key, setKey] = useState("");
    const [idPost, setIdPost] = useState(props.idPost);

    useEffect(() => {
        setComment(comment);
        setKey(key);
    }, [comment, key]);

    useEffect(() => {
        setIdPost(props.idPost);
    }, [props.idPost]);

    const handleClose = () => {
        setComment("");
        setKey("");
        setShow(false);
    }
    
    const handleShow = () => {
        setShow(true);
    }

    const handleComment = (e) => {
        setComment(e.target.value);
    }

    const handleKey = (e) => {
        setKey(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:5000/api/comment/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idPost: idPost,
                author: sessionStorage.getItem("user"),
                content: comment
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 200) {
                setKey("");
                setComment("");
                alert("Your comment has been sent!");
                setShow(false);
            } else {
                alert("Something went wrong!");
            }
        })
        .catch(err => console.log(err));
    }

    const encryptMessage = (e) => {
        let message = document.getElementById("comment").value;
        let key = document.getElementById("key-comment").value;
        fetch("http://localhost:5000/api/comment/encrypt", {
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
            setKey("");
            setComment(data.message);
        })
        .catch(err => console.log(err));
    }

    const toggleVisibility = (e) => {
        let key = document.getElementById("key-comment");
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
            <Button variant="primary" className="m-1" onClick={handleShow}>
                <i className="bi bi-pencil-square"></i>
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>New Comment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="comment">
                            <Form.Control as="textarea" rows={3} placeholder="Write a comment ..." value={comment} onChange={handleComment} />
                        </Form.Group>
                        <Form.Group controlId="key-comment" className="d-flex align-items-center mt-1">
                            <Form.Control type="password" placeholder="Secret Key" value={key} onChange={handleKey} />
                            <Button variant="dark" className="ms-1" onClick={toggleVisibility}>
                                <i className="bi bi-eye"></i>
                            </Button>
                            <Button variant="warning" className="ms-1" onClick={encryptMessage}>
                                <i className="bi bi-lock"></i>
                            </Button>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose}>
                        <i className="bi bi-x-circle"></i>
                    </Button>
                    <Button variant="success" onClick={handleSubmit}>
                        <i className="bi bi-send"></i>
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )

}

export default CommentToShare;