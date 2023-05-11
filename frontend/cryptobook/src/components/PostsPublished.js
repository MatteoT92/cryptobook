import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Post from './Post';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function PostsPublished() {

    const [show, setShow] = useState(false);
    const [posts, setPosts] = useState([]);
    const [key, setKey] = useState("");

    useEffect(() => {
        const refresh = setInterval(() => {
            postsPublished();
        }, 1000);
        return () => clearInterval(refresh);
      }, []);

    useEffect(() => {
        setPosts(posts);
    }, [posts]);

    useEffect(() => {
        setKey(key);
    }, [key]);

    const handleClose = () => {
        setShow(false);
    }
    
    const handleShow = () => {
        setShow(true);
    }

    const handleKey = (e) => {
        setKey(e.target.value);
    }

    const postsPublished = (e) => {
        fetch(`http://localhost:5000/api/posts/${sessionStorage.getItem("user")}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(data => {
            setPosts(data);
        })
        .catch(err => console.log(err));
    }

    if (posts.length > 0) {
        return (
            <div>
                <Button variant="dark" onClick={handleShow}>
                    <i className="bi bi-stickies-fill me-1"></i>Posts Published
                </Button>
                <Modal show={show} onHide={handleClose} fullscreen={true}>
                    <Modal.Header closeButton>
                        <Modal.Title>Posts Published</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="post-received">
                        <div className="d-flex">
                        {posts.map((post, i) => (
                            <Post data={post} idx={i} key={i} />
                        ))}
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        )
    } else {
        return (
            <div>
                <Button variant="dark" onClick={handleShow}>
                    <i className="bi bi-stickies-fill me-1"></i>Posts Published
                </Button>
                <Modal show={show} onHide={handleClose} fullscreen={true}>
                    <Modal.Header closeButton>
                        <Modal.Title>Posts Published</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="d-flex align-items-center justify-content-center">
                        <img className="img-fluid" src={process.env.PUBLIC_URL + "/no-posts.png"} alt="No posts published yet" />
                        <h2>I'm sorry... No posts published yet</h2>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }

}

export default PostsPublished;