import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import PostToShare from "./PostToShare";
import PostsToView from "./PostsToView";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Posts() {

    return (
        <Navbar variant="dark" bg="dark" expand="lg">
            <Container fluid>
                <Navbar.Toggle aria-controls="navbar-dark" />
                <Navbar.Collapse id="navbar-dark">
                    <Nav>
                        <NavDropdown
                        id="nav-dropdown-dark"
                        title={<i className="bi bi-stickies-fill h1 posts"></i>}
                        menuVariant="dark"
                        align="end"
                        >
                            <NavDropdown.Item href="#">
                                <PostToShare />
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#">
                                opt2
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#">
                                <PostsToView />
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )

}

export default Posts;