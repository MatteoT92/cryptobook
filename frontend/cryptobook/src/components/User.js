import React, {useEffect, useState} from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

function User(props) {

    const [name, setName] = useState(props.name);

    useEffect(() => {
        setName(props.name);
    }, [props.name]);

    return (
        <div className="d-inline">
            <img src={process.env.PUBLIC_URL + "/default-img-profile.jpg"} alt="Profile Image" width="20%" />
            <code>{name}</code>
        </div>
    )

}

export default User;