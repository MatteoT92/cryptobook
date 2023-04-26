import React, {useEffect, useState} from 'react';
import User from './User';

import 'bootstrap/dist/css/bootstrap.min.css';

function Friends(props) {

    const [friends, setFriends] = useState(props.data);

    useEffect(() => {
        setFriends(props.data);
    }, [props.data]);

    return (
        <div className="box-friends border border-dark border-2 rounded-4">
            {friends.map((friend, i) => (
                <div className="friend">
                    <User name={friend.username} key={i} />
                </div>
            ))}
        </div>
    )

}

export default Friends;