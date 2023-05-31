import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import UsersToFollow from "./UsersToFollow";
import UsersFollowed from "./UsersFollowed";
import FollowRequestsSended from "./FollowRequestsSended";
import FollowRequestsReceived from "./FollowRequestsReceived";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Users() {

    return (
        <Navbar variant="dark" bg="dark" expand="lg">
            <Container fluid>
                <Navbar.Toggle aria-controls="navbar-dark" />
                <Navbar.Collapse id="navbar-dark">
                    <Nav>
                        <NavDropdown
                        id="nav-dropdown-dark"
                        title={<i className="bi bi-people-fill h1 people"></i>}
                        menuVariant="dark"
                        align="end"
                        >
                            <NavDropdown.Item href="#">
                                <UsersToFollow />
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#">
                                <UsersFollowed />
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#">
                                <FollowRequestsSended />
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#">
                                <FollowRequestsReceived />
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )

}

export default Users;