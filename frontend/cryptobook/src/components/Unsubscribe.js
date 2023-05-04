import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Unsubscribe(props) {

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  }

  const handleShow = () => {
    setShow(true);
  }

  const handleSubmit = (e) => {
      e.preventDefault();
      fetch('http://localhost:5000/api/settings/unsubscribe', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              username: sessionStorage.getItem('user')
          })
      }).then(res => res.json())
      .then(data => {
          if (data.status === 200) {
            handleClose();
            sessionStorage.clear();
          } else {
            alert("Something went wrong");
          }
      });
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
                    <h4>Are you sure you want to unsubscribe?</h4>
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