import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import UserCard from './UserCard';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function UsersSigned() {

  const [show, setShow] = useState(false);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (search.length === 0) {
        usersSigned();
    } else {
        filteredUsers();
    }
  }, [search, users]);

  const handleClose = () => {
    setShow(false);
  }

  const handleShow = () => {
    setShow(true);
  }

  const handleSearch = (e) => {
    setSearch(e.target.value);
  }

  const usersSigned = () => {
      fetch("http://localhost:5000/api/users", {
          method: "GET",
          headers: {
              "Content-Type": "application/json"
          }
      })
      .then(res => res.json())
      .then(data => {
          let usersFiltered = data.filter(user => user.username !== sessionStorage.getItem("user"));
          setUsers(usersFiltered);
      })
      .catch(err => console.log(err));
  }

  const filteredUsers = (e) => {
    let searchedUsers = users.filter(user => user.username.toLowerCase().includes(search.toLowerCase()));
    setUsers(searchedUsers);
  }

  if (users.length > 0) {
    return (
        <div>
            <Button variant="dark" onClick={handleShow}>
                <i className="bi bi-people-fill me-1"></i>Users
            </Button>
            <Modal show={show} onHide={handleClose} fullscreen={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Users</Modal.Title>
                    <div>
                        <div className="d-flex mb-2" role="search">
                            <input className="form-control" type="search" id="search-users" placeholder="Search" value={search} onChange={handleSearch} />
                            <button className="btn btn-light" type="button" onClick={filteredUsers}>
                                <i className="bi bi-search"></i>
                            </button>
                        </div>
                    </div>
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
                <i className="bi bi-people-fill me-1"></i>Users
            </Button>
            <Modal show={show} onHide={handleClose} fullscreen={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Users To Follow</Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex align-items-center justify-content-center">
                    <img className="img-fluid" src={process.env.PUBLIC_URL + "/no-users.png"} alt="No users to follow yet" />
                    <h2>I'm sorry... No users to follow yet</h2>
                </Modal.Body>
            </Modal>
        </div>
    )
  }

}

export default UsersSigned;