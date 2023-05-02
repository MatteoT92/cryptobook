import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import {useDropzone} from 'react-dropzone';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function ChangePhoto(props) {

  const [show, setShow] = useState(false);
  const [photo, setPhoto] = useState(null);

  const handleClose = () => {
    setShow(false);
  }

  const handleShow = () => {
    setShow(true);
  }

  const handlePhoto = (acceptedFiles) => {
    setPhoto(acceptedFiles[0]);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let base64Image;
    reader.readAsDataURL(photo);
    reader.onloadend = () => {
      base64Image = reader.result;
      fetch('http://localhost:5000/api/settings/photo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: sessionStorage.getItem('user'),
          photo: base64Image
        })
      }).then(res => res.json())
      .then(data => {
        console.log(data);
      });
    };
  }

  const {getRootProps, getInputProps} = useDropzone({onDrop: handlePhoto});

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
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                {photo ? (
                  <p>{photo.name}</p>
                ) : (
                  <p>Drag and drop image here, or click to select image</p>
                )}
              </div>
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