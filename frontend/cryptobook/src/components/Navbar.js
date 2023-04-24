import React, {useEffect, useState} from 'react';
import Logo from './Logo';
import Log from './Log';
import Whoami from './Whoami';

import 'bootstrap/dist/css/bootstrap.min.css';

function Navbar(props) {

    const [user, setUser] = useState(props.user);

    useEffect(() => {
        setUser(props.user);
    }, [props.user]);

    return (
        <nav className="navbar bg-dark">
            <div className="container-fluid">
                <Logo className="navbar-brand" />
                <Whoami />
                <Log user={user}/>
            </div>
        </nav>
    )

}

export default Navbar;