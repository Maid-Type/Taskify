import { NavLink } from "react-router-dom";
import styles from './Header.module.css';
import React from "react";

const Header = React.forwardRef(({ selected },ref) => {
    return (
        <div className={styles.container} ref={ref}>
            <h4 style={{fontSize: '1.5rem'}}>{selected}</h4>
            {/*<nav className={styles.mainNav}>*/}
            {/*    <ul className={styles.mainUl}>*/}
            {/*        <li>*/}
            {/*            <NavLink*/}
            {/*                to='/app/timed-tasks'*/}
            {/*                className={({ isActive }) => isActive ? `${styles.active} + ${styles.item}` : styles.item}*/}
            {/*            >*/}
            {/*                Pricing*/}
            {/*            </NavLink>*/}
            {/*        </li>*/}
            {/*        <li>*/}
            {/*            <NavLink*/}
            {/*                to='/'*/}
            {/*                className={({ isActive }) => isActive ? `${styles.active} + ${styles.item}` : styles.item}*/}
            {/*            >*/}
            {/*                About*/}
            {/*            </NavLink>*/}
            {/*        </li>*/}
            {/*        <li>*/}
            {/*            <NavLink*/}
            {/*                to='/'*/}
            {/*                className={({ isActive }) => isActive ? `${styles.active} + ${styles.item}` : styles.item}*/}
            {/*            >*/}
            {/*                Contact*/}
            {/*            </NavLink>*/}
            {/*        </li>*/}
            {/*        <li>*/}
            {/*            <NavLink*/}
            {/*                to='/homepage'*/}
            {/*                className={({ isActive }) => isActive ? `${styles.active} + ${styles.item}` : styles.item}*/}
            {/*            >*/}
            {/*                Home*/}
            {/*            </NavLink>*/}
            {/*        </li>*/}
            {/*    </ul>*/}
            {/*</nav>*/}
        </div>
    );
});

export default Header;
