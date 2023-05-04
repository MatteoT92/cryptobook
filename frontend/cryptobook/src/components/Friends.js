import React, {useEffect, useState} from 'react';
import User from './User';

import 'bootstrap/dist/css/bootstrap.min.css';

function Friends(props) {

    const [friends, setFriends] = useState(props.data);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (document.getElementById("search").value.length === 0) {
            setFriends(props.data);
        } else {
            setFriends(friends);
        }
    }, [props.data, friends]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    }

    const filteredFriends = (e) => {
        let searchedFriends = friends.filter(friend => friend.username.toLowerCase().includes(search.toLowerCase()));
        setFriends(searchedFriends);
    }

    return (
        <div className="box-friends m-1">
            <div>
                <div className="d-flex mb-1" role="search">
                    <input className="form-control" type="search" id="search" placeholder="Search" value={search} onChange={handleSearch} />
                    <button className="btn btn-light" type="button" onClick={filteredFriends}>
                        <i className="bi bi-search"></i>
                    </button>
                </div>
            </div>
            <div className="friends">
                {friends.map((friend, i) => (
                    <div className="friend" key={i} onClick={() => sessionStorage.setItem("friend", friend.username)}>
                        <User name={friend.username} />
                    </div>
                ))}
            </div>
        </div>
    )

}

export default Friends;