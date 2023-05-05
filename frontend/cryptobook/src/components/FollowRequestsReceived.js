import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import UserCard from './UserCard';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function FollowRequestsReceived() {

  const [show, setShow] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    followRequestReceived();
  }, []);

  const handleClose = () => {
    setShow(false);
  }

  const handleShow = () => {
    setShow(true);
  }

  const followRequestReceived = () => {
      fetch(`http://localhost:5000/api/users/${sessionStorage.getItem("user")}/followrequests/received`, {
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

  return (
        <div>
            <Button variant="dark" onClick={handleShow}>
                <i className="bi bi-people-fill me-1"></i>Requests received
            </Button>
            <Modal show={show} onHide={handleClose} fullscreen={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Follow Request Received</Modal.Title>
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

}

export default FollowRequestsReceived;