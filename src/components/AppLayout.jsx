import SideBar from "./SideBar.jsx";
import styles from './AppLayout.module.css'
import {Outlet} from "react-router-dom";

function AppLayout() {
    return (
        <>
            <div className={styles.container}>
                <SideBar></SideBar>
                <Outlet></Outlet>
            </div>
        </>
    );
}

export default AppLayout;