import React, {useEffect, useState} from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function UserCard(props) {

    const [username, setUsername] = useState(props.username);
    const [photo, setPhoto] = useState("");
    const [checks, setChecks] = useState({});

    useEffect(() => {
        setUsername(props.username);
        photoProfile();
        checksOnUser();
    }, [props.username, photo]);

    useEffect(() => {
        setUsername(username);
        photoProfile();
        checksOnUser();
    }, [username, photo]);

    const photoProfile = () => {
        fetch(`http://localhost:5000/api/photo?username=${username}`, {
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
    }

    const checksOnUser = () => {
        fetch(`http://localhost:5000/api/users/${sessionStorage.getItem("user")}/${username}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(data => {
            setChecks(data);
        })
        .catch(err => console.log(err));
    }

    const followUser = () => {
        fetch("http://localhost:5000/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                sender: sessionStorage.getItem("user"),
                receiver: username
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 200) {
                alert("Your request has been sent");
            } else {
                alert("Something went wrong");
            }
        })
        .catch(err => console.log(err));
    }

    const unfollowUser = () => {
        fetch("http://localhost:5000/api/friends", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user: sessionStorage.getItem("user"),
                friend: username
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 200) {
                alert("Your request has been sent");
            } else {
                alert("Something went wrong");
            }
        })
        .catch(err => console.log(err));
    }

    const cancelFollowRequestSended = () => {
        fetch(`http://localhost:5000/api/users/${sessionStorage.getItem("user")}/followrequests/sended`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                friend: username
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 200) {
                alert("Your request has been sent");
            } else {
                alert("Something went wrong");
            }
        })
        .catch(err => console.log(err));
    }

    const acceptFollowRequestReceived = () => {
        fetch(`http://localhost:5000/api/users/${sessionStorage.getItem("user")}/followrequests/received`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                friend: username
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 200) {
                alert("Your request has been sent");
            } else {
                alert("Something went wrong");
            }
        })
        .catch(err => console.log(err));
    }

    const denyFollowRequestReceived = () => {
        fetch(`http://localhost:5000/api/users/${sessionStorage.getItem("user")}/followrequests/received`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                friend: username
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 200) {
                alert("Your request has been sent");
            } else {
                alert("Something went wrong");
            }
        })
        .catch(err => console.log(err));
    }

    if (!checks.isFriend && !checks.isFollowRequestSended && !checks.isFollowRequestReceived) {
        return (
            <Card bg="dark" className="text-center">
                <Card.Img variant="top" className="profile-card-img" src={photo} />
                <Card.Body>
                    <Card.Title>
                        <code>{username}</code>
                    </Card.Title>
                    <Button variant="primary" onClick={followUser}>
                        <i className="bi bi-person-plus-fill me-1"></i>Follow
                    </Button>
                </Card.Body>
            </Card>
        )
    } else if (!checks.isFriend && checks.isFollowRequestSended && !checks.isFollowRequestReceived) {
        return (
            <Card bg="dark" className="text-center">
                <Card.Img variant="top" className="profile-card-img" src={photo} />
                <Card.Body>
                    <Card.Title>
                        <code>{username}</code>
                    </Card.Title>
                    <Button variant="danger" onClick={cancelFollowRequestSended}>
                        <i className="bi bi-person-x-fill me-1"></i>Cancel
                    </Button>
                </Card.Body>
            </Card>
        )
    } else if (!checks.isFriend && !checks.isFollowRequestSended && checks.isFollowRequestReceived) {
        return (
            <Card bg="dark" className="text-center">
                <Card.Img variant="top" className="profile-card-img" src={photo} />
                <Card.Body>
                    <Card.Title>
                        <code>{username}</code>
                    </Card.Title>
                    <Button variant="success me-2" onClick={acceptFollowRequestReceived}>
                        <i className="bi bi-person-check-fill me-1"></i>Accept
                    </Button>
                    <Button variant="danger" onClick={denyFollowRequestReceived}>
                        <i className="bi bi-person-x-fill me-1"></i>Deny
                    </Button>
                </Card.Body>
            </Card>
        )
    } else {
        return (
            <Card bg="dark" className="text-center">
                <Card.Img variant="top" className="profile-card-img" src={photo} />
                <Card.Body>
                    <Card.Title>
                        <code>{username}</code>
                    </Card.Title>
                    <Button variant="danger" onClick={unfollowUser}>
                        <i className="bi bi-person-dash-fill me-1"></i>Unfollow
                    </Button>
                </Card.Body>
            </Card>
        )
    }

}

export default UserCard;