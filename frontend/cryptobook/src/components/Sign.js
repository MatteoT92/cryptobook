import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

function Sign() {

    const backgroundImage = {
        backgroundImage: "url(" + process.env.PUBLIC_URL + "10.webp)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat"
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center align-items-center">
                <form className="col-6 ml-auto sign" style={backgroundImage}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" className="form-control" id="username" placeholder="Username"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" id="password" placeholder="Password"/>
                    </div>
                    <div className="form-group form-check">
                        <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
                        <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
                    </div>
                    <div className="col text-center">
                        <button type="submit" className="btn btn-primary">Sign me!</button>
                    </div>
                    <div className="row text-center">
                        <p>You are already signed? <strong><u>Then log in!</u></strong></p>
                    </div>
                </form>
            </div>
        </div>
    )

}

export default Sign;