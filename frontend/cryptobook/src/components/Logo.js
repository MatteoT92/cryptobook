import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

function Logo() {

  return (
    <div className="logo">
      <img src={process.env.PUBLIC_URL + "lock.png"} alt="Logo CryptoBook" width="60" height="48" className="d-inline-block align-text-top" />
      CryptoBook
    </div>
  )
  
}

export default Logo;