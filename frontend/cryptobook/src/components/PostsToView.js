import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Post from './Post';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function PostsToView() {

    const [show, setShow] = useState(false);
    const [posts, setPosts] = useState([]);
    const [key, setKey] = useState("");

    useEffect(() => {
        const refresh = setInterval(() => {
            postsToView();
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

    const postsToView = (e) => {
        fetch(`http://localhost:5000/api/posts?user=${sessionStorage.getItem("user")}`, {
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

    return (
        <div>
            <Button variant="dark" onClick={handleShow}>
                <i className="bi bi-stickies-fill me-1"></i>Posts Published
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Posts Published</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {posts.map((post, i) => (
                        <Post data={post} key={i} />
                    ))}
                </Modal.Body>
            </Modal>
        </div>
    )

}

export default PostsToView;