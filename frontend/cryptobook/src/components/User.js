import React, {useEffect, useState} from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

function User(props) {

    const [name, setName] = useState(props.name);
    const [photo, setPhoto] = useState("");

    useEffect(() => {
        setName(props.name);
    }, [props.name]);

    useEffect(() => {
        if (name) {
            photoProfile();
        }
    }, []);

    const photoProfile = () => {
        fetch(`http://localhost:5000/api/photo?username=${name}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .then(data => {
            setPhoto(`data:image/${data.typePhoto};base64,${data.photo}`);
        });
    }

    return (
        <div className="d-inline">
            {photo ? <img src={photo} alt="User Profile Image" width="20%" /> : <img src={process.env.PUBLIC_URL + "/default-img-profile.jpg"} alt="User Profile Image" width="20%" />}
            <code>{name}</code>
        </div>
    )

}

export default User;