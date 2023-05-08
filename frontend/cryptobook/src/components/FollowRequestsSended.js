import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import UserCard from './UserCard';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function FollowRequestsSended() {

  const [show, setShow] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const refresh = setInterval(() => {
        followRequestSended();
    }, 1000);
    return () => clearInterval(refresh);
  }, []);

  const handleClose = () => {
    setShow(false);
  }

  const handleShow = () => {
    setShow(true);
  }

  const followRequestSended = () => {
      fetch(`http://localhost:5000/api/users/${sessionStorage.getItem("user")}/followrequests/sended`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json"
          }
      }).then(res => res.json())
      .then(data => {
          setUsers(data);
      })
      .catch(err => console.log(err));
  }

  if (users.length > 0) {
    return (
        <div>
            <Button variant="dark" onClick={handleShow}>
                <i className="bi bi-people-fill me-1"></i>Requests sended
            </Button>
            <Modal show={show} onHide={handleClose} fullscreen={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Follow Requests Sended</Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex">
                    {users.map((user, i) => (
                        <div key={i} className="m-1">
                            <UserCard username={user.username} />
                        </div>
                    ))}
                </Modal.Body>
            </Modal>
        </div>
    )
  } else {
    return (
        <div>
            <Button variant="dark" onClick={handleShow}>
                <i className="bi bi-people-fill me-1"></i>Requests sended
            </Button>
            <Modal show={show} onHide={handleClose} fullscreen={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Follow Request Sended</Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex align-items-center justify-content-center">
                    <img className="img-fluid" src={process.env.PUBLIC_URL + "/no-users.png"} alt="No requests sended yet" />
                    <h2>I'm sorry... No requests sended yet</h2>
                </Modal.Body>
            </Modal>
        </div>
    )
  }

}

export default FollowRequestsSended;