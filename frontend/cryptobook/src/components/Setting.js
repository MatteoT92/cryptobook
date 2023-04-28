import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

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
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                    Another action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.4">
                    Separated link
                </NavDropdown.Item>
                </NavDropdown>
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    )

}

export default Setting;
