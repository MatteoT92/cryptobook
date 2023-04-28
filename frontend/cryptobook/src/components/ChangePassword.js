import React, {useEffect, useState} from 'react';
import Modal from 'react-bootstrap/Modal';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function ChangePassword(props) {

  const [show, setShow] = useState(false);
  const [btnText, setBtnText] = useState(props.btnText);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    setOldPassword(oldPassword);
  }, [oldPassword]);

  useEffect(() => {
      setNewPassword(newPassword);
  }, [newPassword]);

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  const handleOldPassword = (e) => {
      setOldPassword(e.target.value);
  }

  const handleNewPassword = (e) => {
      setNewPassword(e.target.value);
  }

  const handleSubmit = (e) => {
      e.preventDefault();
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
            <button className="btn text-white" type="button" onClick={handleShow}>
                <i className="bi bi-key-fill me-1"></i>{btnText}
            </button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="old-password">Previous Password</label>
                            <div className="d-flex">
                                <input type="password" className="form-control" id="old-password" placeholder="Previous Password" value={oldPassword} onChange={handleOldPassword} />
                                <button className="btn btn-light" type="button" onClick={toggleVisibilityOldPassword}>
                                    <i className="bi bi-eye"></i>
                                </button>
                            </div>
                            <label htmlFor="new-password">New Password</label>
                            <div className="d-flex">
                                <input type="password" className="form-control" id="new-password" placeholder="New Password" value={newPassword} onChange={handleNewPassword} />
                                <button className="btn btn-light" type="button" onClick={toggleVisibilityNewPassword}>
                                    <i className="bi bi-eye"></i>
                                </button>
                            </div>
                            <div className="col text-center mt-2">
                                <button type="submit" className="btn btn-primary">
                                    <i className="bi bi-save-fill me-1"></i>Save
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
  )

}

export default ChangePassword;