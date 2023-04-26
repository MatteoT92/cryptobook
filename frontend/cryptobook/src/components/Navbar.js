import React, {useEffect, useState} from 'react';
import Logo from './Logo';
import Log from './Log';
import Claim from './Claim';

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
                <Claim />
                <Log user={user}/>
            </div>
        </nav>
    )

}

export default Navbar;