import React, {useEffect, useState} from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

function User(props) {

    const [name, setName] = useState(props.name);
    const [photo, setPhoto] = useState("");

    useEffect(() => {
        setName(props.name);
        photoProfile();
    }, [props.name, photo]);

    useEffect(() => {
        setName(name);
        photoProfile();
      }, [name, photo]);

    useEffect(() => {
        const refresh = setInterval(() => {
            photoProfile();
        }, 1000);
        return () => clearInterval(refresh);
    }, [photo]);

    const photoProfile = () => {
        if (name) {
            fetch(`http://localhost:5000/api/photo?username=${name}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                setPhoto(`data:image/${data.typePhoto};base64,${data.photo}`);
            })
            .catch(err => console.log(err));
        } else {
            setPhoto(`${process.env.PUBLIC_URL}/default-img-profile.jpg`);
        }
    }

    return (
        <div className="d-inline">
            <img className="profile-img m-1" src={photo} alt="User Profile Image" />
            <code className="ms-1">{name}</code>
        </div>
    )

}

export default User;