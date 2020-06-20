import React from 'react';
import './style.css'
import Logo from '../images/logo.svg'

function Header() {

    return(
        <header>
            <div className="logo">
            <a href="https://glasswallsolutions.com/" target="blank"><img src={Logo} alt="Logo"/></a>
            </div>
        </header>
    )

}


export default Header


