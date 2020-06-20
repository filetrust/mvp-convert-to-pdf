import React from 'react';
import './style.css'
import Logo from '../images/logo.svg'


function Footer() {

    return(
        <footer>
            <div className="logo">
                <a href="https://glasswallsolutions.com/"><img src={Logo} alt="Logo"/></a>
            </div>
        </footer>
    )

}


export default Footer


