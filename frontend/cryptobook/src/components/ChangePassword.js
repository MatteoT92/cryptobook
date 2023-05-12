import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function ChangePassword(props) {

  const [show, setShow] = useState(false);
  const [user, setUser] = useState(props.user);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    setUser(props.user);
  }, [props.user]);

  useEffect(() => {
    setUser(user);
  }, [user]);

  useEffect(() => {
    setOldPassword(oldPassword);
  }, [oldPassword]);

  useEffect(() => {
      setNewPassword(newPassword);
  }, [newPassword]);

  const handleClose = () => {
    setShow(false);
  }

  const handleShow = () => {
    setShow(true);
  }

  const handleOldPassword = (e) => {
      setOldPassword(e.target.value);
  }

  const handleNewPassword = (e) => {
      setNewPassword(e.target.value);
  }

  const handleSubmit = (e) => {
      e.preventDefault();
      fetch('http://localhost:5000/api/settings/password', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              username: user,
              oldPassword: oldPassword,
              newPassword: newPassword
          })
      })
      .then(res => res.json())
      .then(data => {
          setOldPassword("");
          setNewPassword("");
          if (data.status === 200) {
              alert("Password changed successfully");
              handleClose();
          } else {
              alert("Something went wrong");
          }
      })
      .catch(err => console.log(err));
  }

  const toggleVisibilityOldPassword = (e) => {
    let password = document.getElementById("old-password");
    let iconVisibility = document.getElementsByClassName("bi bi-eye");
    if (password.type === "password") {
        password.type = "text";
        iconVisibility.className = "bi bi-eye-slash";
    } else {
        password.type = "password";
        iconVisibility.className = "bi bi-eye";
    }
  }

  const toggleVisibilityNewPassword = (e) => {
    let password = document.getElementById("new-password");
    let iconVisibility = document.getElementsByClassName("bi bi-eye");
    if (password.type === "password") {
        password.type = "text";
        iconVisibility.className = "bi bi-eye-slash";
    } else {
        password.type = "password";
        iconVisibility.className = "bi bi-eye";
    }
  }

  return (
        <div>
            <Button variant="dark" onClick={handleShow}>
                <i className="bi bi-key-fill me-1"></i>Change Password
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="old-password">
                            <Form.Label>Previous Password</Form.Label>
                            <div className="d-flex">
                                <Form.Control type="password" placeholder="Previous Password" value={oldPassword} onChange={handleOldPassword} />
                                <Button variant="light" onClick={toggleVisibilityOldPassword}>
                                    <i className="bi bi-eye"></i>
                                </Button>
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="new-password">
                            <Form.Label>New Password</Form.Label>
                            <div className="d-flex">
                                <Form.Control type="password" placeholder="New Password" value={newPassword} onChange={handleNewPassword}/>
                                <Button variant="light" onClick={toggleVisibilityNewPassword}>
                                    <i className="bi bi-eye"></i>
                                </Button>
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

export default ChangePassword;