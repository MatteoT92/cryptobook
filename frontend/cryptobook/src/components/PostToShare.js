import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function PostToShare(props) {

    const [show, setShow] = useState(false);
    const [post, setPost] = useState("");
    const [key, setKey] = useState("");

    const handleClose = () => {
        setShow(false);
    }
    
    const handleShow = () => {
        setShow(true);
    }

    const handlePost = (e) => {
        setPost(e.target.value);
    }

    const handleKey = (e) => {
        setKey(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:5000/api/post/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                author: sessionStorage.getItem("user"),
                content: post
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 200) {
                setKey("");
                setPost("");
                alert("Your post has been sent!");
            } else {
                alert("Something went wrong!");
            }
        })
        .catch(err => console.log(err));
    }

    const encryptMessage = (e) => {
        let message = document.getElementById("post").value;
        let key = document.getElementById("key-post").value;
        fetch("http://localhost:5000/api/post/encrypt", {
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
            setPost(data.message);
        })
        .catch(err => console.log(err));
    }

    const toggleVisibility = (e) => {
        let key = document.getElementById("key-post");
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
            <Button variant="dark" onClick={handleShow}>
                <i className="bi bi-sticky-fill me-1"></i>New Post
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>New Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="post">
                            <Form.Control as="textarea" rows={3} placeholder="Write a post ..." value={post} onChange={handlePost} />
                        </Form.Group>
                        <Form.Group controlId="key-post" className="d-flex align-items-center mt-1">
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

export default PostToShare;