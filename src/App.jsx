import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import PageNotFound from "./pages/PageNotFound.jsx";
import TimedTasks from "./pages/TimedTasks.jsx";
import AppLayout from "./components/AppLayout.jsx";
import Homepage from "./pages/Homepage.jsx";
import ConfirmedTasks from "./components/ConfirmedTasks.jsx";
import {useEffect, useState} from "react";
import API_URL from "./helpers.js";
import CancelledTasks from "./components/CancelledTasks.jsx";
import SearchTasks from "./components/SearchTasks.jsx";

function App() {
    const getData = async () => {
        try {
            const storedData = sessionStorage.getItem('tasks');
            if (!storedData) {
                const res = await fetch(`${API_URL}tasks`);
                const data = await res.json();

                const jsonData = JSON.stringify(data);
                sessionStorage.setItem('tasks', jsonData);
            } else {
                console.log('Data already in sessionStorage');
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='homepage' element={<Homepage></Homepage>}></Route>
                    <Route path='/' element={<AppLayout></AppLayout>}>
                        <Route index path='timed-tasks' element={<TimedTasks></TimedTasks>}></Route>
                        <Route path='confirmed-tasks' element={<ConfirmedTasks></ConfirmedTasks>}></Route>
                        <Route path='cancelled-tasks' element={<CancelledTasks></CancelledTasks>}></Route>
                        <Route path='search-tasks' element={<SearchTasks></SearchTasks>}></Route>
                    </Route>
                    <Route path='*' element={<PageNotFound></PageNotFound>}></Route> {/* TODO fix later */}
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
