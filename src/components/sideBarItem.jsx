import styles from "./SideBar.module.css";
import {NavLink} from "react-router-dom";

export default function sideBarItem({name,to}) {
    return (
        <>
            <NavLink to={to}>
                {({isActive}) => (
                    isActive ? ( <img
                        src={`/src/assets/active/${name}-active.png`}
                        alt={name}
                        className={`${styles.active} ${styles.icon}`}
                    />) : (<img
                        src={`/src/assets/default/${name}.png`}
                        alt={name}
                        className={styles.icon}
                    />)
                )}
            </NavLink>
        </>
    )
}