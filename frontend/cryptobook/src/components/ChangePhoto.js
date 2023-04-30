import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function ChangePhoto(props) {

  const [show, setShow] = useState(false);
  const [photo, setPhoto] = useState(null);

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  const handlePhoto = (e) => {
      //setPhoto(e.target.files[0]);
      console.log(e.target);
  }

  const handleSubmit = (e) => {
      e.preventDefault();
  }

  return (
        <div>
            <Button variant="dark" onClick={handleShow}>
                <i className="bi bi-person-fill me-1"></i>Change Photo
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Photo Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="new-photo">
                            <Form.Label>Select new photo profile</Form.Label>
                            <Form.Control type="file" onChange={handlePhoto} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
  )

}

export default ChangePhoto;