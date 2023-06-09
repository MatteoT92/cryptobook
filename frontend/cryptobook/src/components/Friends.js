import React, {useEffect, useState} from 'react';
import User from './User';

import 'bootstrap/dist/css/bootstrap.min.css';

function Friends(props) {

    const [friends, setFriends] = useState(props.data);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (!search.length) {
            setFriends(props.data);
        } else {
            setFriends(friends);
        }
    }, [props.data, friends, search]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    }

    const filteredFriends = (e) => {
        let searchedFriends = friends.filter(friend => friend.user.username.toLowerCase().includes(search.toLowerCase()));
        setFriends(searchedFriends);
    }

    return (
        <div className="box-friends m-1">
            <div>
                <div className="d-flex mb-2" role="search">
                    <input className="form-control" type="search" id="search" placeholder="Search" value={search} onChange={handleSearch} />
                    <button className="btn btn-light" type="button" onClick={filteredFriends}>
                        <i className="bi bi-search"></i>
                    </button>
                </div>
            </div>
            <div className="friends">
                {friends.map((friend, i) => (
                    <div className="friend" key={i} onClick={() => sessionStorage.setItem("friend", friend.user.username)}>
                        <User name={friend.user.username} />
                    </div>
                ))}
            </div>
        </div>
    )

}

export default Friends;