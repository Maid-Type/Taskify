import styles from './CancelledTasks.module.css';
import Table from "./Table.jsx";
import Header from "./Header.jsx";
import {useEffect, useReducer, useRef, useState} from "react";

const initialState = {
    filteredTasksArr: [],
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'loadTasks':
            return {...state, filteredTasksArr: action.payload}
    }
}

function CancelledTasks() {
    const [state,dispatch] = useReducer(reducer,initialState);
    const [isHeaderVisible, setIsHeaderVisible] = useState(false);
    const headerRef = useRef(null);

    useEffect(() => {
        async function loadTasks() {
            try {
                const data = JSON.parse(sessionStorage.getItem("tasks"));
                const filteredArr = data.filter((task) => task.isTaskDeleted === true && task.isTaskCompleted === false);
                dispatch({type: 'loadTasks', payload: filteredArr});
            } catch (e) {
                console.error(e);
            }
        }

        loadTasks();
    }, []);

    function handleClearAllTasks(){
        const data = JSON.parse(sessionStorage.getItem("tasks"));
        const filteredArr = data.filter((task) => task.isTaskDeleted === false);
        sessionStorage.setItem('tasks',JSON.stringify(filteredArr));
        dispatch({type: 'loadTasks',payload: filteredArr.filter((item) => item.isTaskDeleted)});
    }

    function removeTask(task) {
        const data = JSON.parse(sessionStorage.getItem("tasks"));
        const filteredArr = data.filter((item) => item.taskID !== task.taskID && task.isTaskDeleted === true && task.isTaskCompleted === false);
        sessionStorage.setItem('tasks',JSON.stringify(filteredArr));
        dispatch({type: 'loadTasks', payload: filteredArr.filter((item) => item.isTaskCompleted === false && item.isTaskDeleted === true)});
    }

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    setIsHeaderVisible(entry.isIntersecting);
                });
            },
            { threshold: 0.1 }
        );

        if (headerRef.current) {
            observer.observe(headerRef.current);
        }

        return () => {
            if (headerRef.current) {
                observer.unobserve(headerRef.current);
            }
        };
    }, []);

    return (
        <>
            <Header ref={headerRef} selected='Deleted - Tasks' />
            <div className={styles.container}>
                <div className={styles.clearButton}>
                    <button onClick={handleClearAllTasks}>Clear All Tasks ❌</button>
                </div>

                {state.filteredTasksArr.length > 0 ? (<Table isHeaderVisible={isHeaderVisible} tasks={state.filteredTasksArr} removeTask={removeTask} bGcolor="#3e0001"></Table>) : (
                    <div className={styles.noTasksCompleted}><p>There are no deleted tasks in history 📑</p></div>
                )}
            </div>
        </>
    );
}

export default CancelledTasks;