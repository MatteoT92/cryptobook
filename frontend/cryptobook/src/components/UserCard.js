import React, {useEffect, useState} from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function UserCard(props) {

    const [username, setUsername] = useState(props.username);
    const [photo, setPhoto] = useState("");
    const [check, setCheck] = useState({});

    useEffect(() => {
        setUsername(props.username);
        photoProfile();
        checkOnUser();
    }, [props.username]);

    useEffect(() => {
        setPhoto(photo);
    }, [photo]);

    const photoProfile = () => {
        fetch(`http://localhost:5000/api/photo?username=${username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .then(data => {
            setPhoto(`data:image/${data.typePhoto};base64,${data.photo}`);
        });
    }

    const checkOnUser = () => {
        fetch(`http://localhost:5000/api/users/${sessionStorage.getItem("user")}/${username}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
        .then(data => {
            setCheck(data);
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
        }).then(res => res.json())
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
        }).then(res => res.json())
        .then(data => {
            if (data.status === 200) {
                alert("Your request has been sent");
             } else {
                 alert("Something went wrong");
             }
        });
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
        }).then(res => res.json())
        .then(data => {
            if (data.status === 200) {
                alert("Your request has been sent");
             } else {
                 alert("Something went wrong");
             }
        });
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
        }).then(res => res.json())
        .then(data => {
            if (data.status === 200) {
                alert("Your request has been sent");
             } else {
                 alert("Something went wrong");
             }
        });
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
        }).then(res => res.json())
        .then(data => {
            if (data.status === 200) {
                alert("Your request has been sent");
             } else {
                 alert("Something went wrong");
             }
        });
    }

    if (!check.isFriend && !check.isFollowRequestSended && !check.isFollowRequestReceived) {
        return (
            <Card bg="dark" className="text-center">
                <Card.Img variant="top" src={photo} />
                <Card.Body>
                    <Card.Title>
                        <code>{username}</code>
                    </Card.Title>
                    <Button variant="primary" onClick={followUser}>Follow</Button>
                </Card.Body>
            </Card>
        )
    } else if (!check.isFriend && check.isFollowRequestSended && !check.isFollowRequestReceived) {
        return (
            <Card bg="dark" className="text-center">
                <Card.Img variant="top" src={photo} />
                <Card.Body>
                    <Card.Title>
                        <code>{username}</code>
                    </Card.Title>
                    <Button variant="danger" onClick={cancelFollowRequestSended}>Cancel</Button>
                </Card.Body>
            </Card>
        )
    } else if (!check.isFriend && !check.isFollowRequestSended && check.isFollowRequestReceived) {
        return (
            <Card bg="dark" className="text-center">
                <Card.Img variant="top" src={photo} />
                <Card.Body>
                    <Card.Title>
                        <code>{username}</code>
                    </Card.Title>
                    <Button variant="success" onClick={acceptFollowRequestReceived}>Accept</Button>
                    <Button variant="danger" onClick={denyFollowRequestReceived}>Deny</Button>
                </Card.Body>
            </Card>
        )
    } else {
        return (
            <Card bg="dark" className="text-center">
                <Card.Img variant="top" src={photo} />
                <Card.Body>
                    <Card.Title>
                        <code>{username}</code>
                    </Card.Title>
                    <Button variant="danger" onClick={unfollowUser}>Unfollow</Button>
                </Card.Body>
            </Card>
        )
    }

}

export default UserCard;