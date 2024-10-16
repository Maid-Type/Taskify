import styles from './SideBar.module.css'
import SideBarItem from './sideBarItem.jsx'
import {NavLink} from "react-router-dom";

function SideBar() {
    return (
        <>
            <div className={styles.container}>
                <div className={styles.logoContainer}>
                    <NavLink className={styles.logo} to='/app'>
                        <img src={"/src/assets/logo.png"} alt="Site Logo" className={styles.logoImg}/>
                    </NavLink>
                </div>

                <nav>
                    <ul className={styles.list}>
                        <li>
                            <SideBarItem name='timed-tasks' to='timed-tasks'></SideBarItem>
                        </li>
                        <li>
                            <SideBarItem name='confirmed' to='confirmed-tasks'></SideBarItem>
                        </li>
                        <li>
                            <SideBarItem name='canceled' to='homepage'></SideBarItem>
                        </li>
                        <li>
                            <SideBarItem name='search' to='homepage'></SideBarItem>
                        </li>
                        {/*<li>*/}
                        {/*    <SideBarItem name='connected' to='homepage'></SideBarItem>*/}
                        {/*</li>*/}
                    </ul>
                </nav>
            </div>
        </>
    );
}

export default SideBar;