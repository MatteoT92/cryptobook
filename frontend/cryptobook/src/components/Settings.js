import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import ChangePassword from "./ChangePassword";
import ChangePhoto from "./ChangePhoto";
import Unsubscribe from "./Unsubscribe";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Settings(props) {

    const [user, setUser] = useState(props.user);

    useEffect(() => {
        setUser(props.user);
    }, [props.user]);

    useEffect(() => {
        setUser(user);
    }, [user]);

    return (
        <Navbar variant="dark" bg="dark" expand="lg">
            <Container fluid>
                <Navbar.Toggle aria-controls="navbar-dark" />
                <Navbar.Collapse id="navbar-dark">
                    <Nav>
                        <NavDropdown
                        id="nav-dropdown-dark"
                        title={<i className="bi bi-gear-fill h1 settings"></i>}
                        menuVariant="dark"
                        align="end"
                        >
                            <NavDropdown.Item href="#">
                                <ChangePassword user={user} />
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#">
                                <ChangePhoto user={user} />
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#">
                                <Unsubscribe user={user} />
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )

}

export default Settings;
