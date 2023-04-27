import React, {useEffect, useState} from 'react';
import User from './User';

import 'bootstrap/dist/css/bootstrap.min.css';

function Friends(props) {

    const [friends, setFriends] = useState(props.data);

    useEffect(() => {
        setFriends(props.data);
    }, [props.data]);

    return (
        <div>
            <div>
                <form class="d-flex m-1" role="search">
                    <input class="form-control" type="search" placeholder="Search" aria-label="Search" />
                    <button class="btn btn-light" type="submit">
                        <i class="bi bi-search"></i>
                    </button>
                </form>
            </div>
            <div className="box-friends">
                {friends.map((friend, i) => (
                    <div className="friend" onClick={() => sessionStorage.setItem("friend", friend.username)}>
                        <User name={friend.username} key={i} />
                    </div>
                ))}
            </div>
        </div>
    )

}

export default Friends;