import React from 'react';
import logo from './img/logo.png';
import styles from './navbar.module.css';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    return (
        <div className={styles.nav}>
            <NavLink to="/" end>
                <img src={logo} alt=''></img>
            </NavLink>
            <div className={styles.nav_right} >
                <h3>
                    LOGIN
                </h3>
                <h3>
                    SIGNUP
                </h3>
            </div>
        </div>
    )
}

export default Navbar