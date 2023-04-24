import React, {useEffect, useState} from "react";
import Navbar from "./components/Navbar";
import Sign from "./components/Sign";
import Chat from "./components/Chat";

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

    const [user, setUser] = useState(sessionStorage.getItem("user"));

    useEffect(() => {
      const refresh = setInterval(() => {
        setUser(sessionStorage.getItem("user"));
      }, 1000);
      return () => clearInterval(refresh);
    }, []);

    return (
      <div>
        <Navbar user={user} />
        {user ? <Chat /> : <Sign />}
      </div>
    )

}

export default App;
