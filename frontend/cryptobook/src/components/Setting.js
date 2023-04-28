import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import ChangePassword from "./ChangePassword";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Setting(props) {

    return (
        <Navbar variant="dark" bg="dark" expand="lg">
            <Container fluid>
                <Navbar.Toggle aria-controls="navbar-dark" />
                <Navbar.Collapse id="navbar-dark">
                    <Nav>
                        <NavDropdown
                        id="nav-dropdown-dark"
                        title={<i className="bi bi-gear-fill h1 setting"></i>}
                        menuVariant="dark"
                        align="end"
                        >
                            <NavDropdown.Item href="#">
                                <ChangePassword btnText="Change Password" />
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#">
                                <i className="bi bi-person-fill me-1 text-white"></i>Change Photo
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#">
                                <i className="bi bi-trash3-fill me-1 text-white"></i>Unsubscribe
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )

}

export default Setting;
