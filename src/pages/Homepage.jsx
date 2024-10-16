import Header from "../components/Header.jsx";
import SideBar from "../components/SideBar.jsx";

function Homepage() {
    return (
        <>
            <div className="container">
            <Header selected={'Welcome'}></Header>
            <SideBar></SideBar>
                <div className="container">
                    h1
                </div>
            </div>
        </>
    );
}

export default Homepage;