import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Unsubscribe(props) {

  const [show, setShow] = useState(false);
  const [user, setUser] = useState(props.user);

  useEffect(() => {
      setUser(props.user);
  }, [props.user]);

  useEffect(() => {
    setUser(user);
  }, [user]);

  const handleClose = () => {
    setShow(false);
  }

  const handleShow = () => {
    setShow(true);
  }

  const handleSubmit = (e) => {
      e.preventDefault();
      fetch('http://localhost:5000/api/settings/unsubscribe', {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              username: user
          })
      })
      .then(res => res.json())
      .then(data => {
          if (data.status === 200) {
            handleClose();
            sessionStorage.clear();
            window.location.href = '/';
          } else {
            alert("Something went wrong");
          }
      })
      .catch(err => console.log(err));
  }

  return (
        <div>
            <Button variant="dark" onClick={handleShow}>
                <i className="bi bi-trash3-fill me-1 text-white"></i>Unsubscribe
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Unsubscribe</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>{user}, are you sure you want to unsubscribe?</h4>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        No
                    </Button>
                    <Button variant="danger" onClick={handleSubmit}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
  )

}

export default Unsubscribe;