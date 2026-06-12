import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navigation.module.css';

const Navigation = () => {
    return (
        <nav className={styles.nav}>
            <div className={styles.logo}>
                <NavLink to="/">g_avellaneda</NavLink>
            </div>
            <ul className={styles.links}>
                <li><NavLink to="/about" className={({ isActive }) => isActive ? styles.active : ''}>about</NavLink></li>
                <li><NavLink to="/portfolio" className={({ isActive }) => isActive ? styles.active : ''}>work</NavLink></li>
                <li><NavLink to="/contact" className={({ isActive }) => isActive ? styles.active : ''}>contact</NavLink></li>
            </ul>
        </nav>
    );
};

export default Navigation;
