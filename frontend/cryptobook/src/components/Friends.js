import React, {useEffect, useState} from 'react';
import User from './User';

import 'bootstrap/dist/css/bootstrap.min.css';

function Friends(props) {

    const [friends, setFriends] = useState(props.data);

    useEffect(() => {
        setFriends(props.data);
    }, [props.data]);

    return (
        <div className="box-friends">
            {friends.map((friend, i) => (
                <div className="friend" onClick={() => sessionStorage.setItem("friend", friend.username)}>
                    <User name={friend.username} key={i} />
                </div>
            ))}
        </div>
    )

}

export default Friends;