import styles from './ConfirmedTasks.module.css';
import Header from "./Header.jsx";
import Table from "./Table.jsx";
import {useEffect, useReducer, useRef, useState} from "react";

const initialState = {
    filteredTasksArr: [],
    isLoading: false
}

const reducer = (state , action) => {
    switch (action.type) {
        case 'loadTasks':
            return {...state, filteredTasksArr: action.payload}
        case 'updateTasks':
            return {...state,filteredTasksArr: action.payload}
        default:
            return state;
    }
}

function ConfirmedTasks() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [isHeaderVisible, setIsHeaderVisible] = useState(false);
    const headerRef = useRef(null);

    useEffect(() => {
        async function loadTasks() {
            try {
                const data = JSON.parse(sessionStorage.getItem("tasks"));
                const filteredArr = data.filter((task) => task.isTaskCompleted === true);
                dispatch({type: 'loadTasks', payload: filteredArr});
            } catch (e) {
                console.error(e);
            }
        }

        loadTasks();
    }, []);


    function removeTask(task) {
        const fullArr = JSON.parse(sessionStorage.getItem("tasks")) || [];
        const updatedArr = fullArr.filter((t) => t.taskID !== task.taskID);

        sessionStorage.setItem('tasks',JSON.stringify(updatedArr));

        dispatch({type: 'loadTasks',payload: updatedArr.filter((item) => item.isTaskCompleted === true)});
    }

    function handleClearAllTasks() {
        const fullArr = JSON.parse(sessionStorage.getItem("tasks")) || [];
        const updatedArr = fullArr.filter((t) => t.isTaskCompleted !== true);

        sessionStorage.setItem('tasks',JSON.stringify(updatedArr));

        dispatch({type: 'loadTasks',payload: []});
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
            <Header ref={headerRef} selected='Confirmed - Tasks' />
            <div className={styles.container}>
                <div className={styles.clearButton}>
                    <button onClick={handleClearAllTasks}>Clear All Tasks ❌</button>
                </div>
                {state.filteredTasksArr.length > 0 ? (<Table isHeaderVisible={isHeaderVisible} tasks={state.filteredTasksArr}
                                                             removeTask={removeTask}></Table>) : (
                                                                 <div className={styles.noTasksCompleted}><p>No Tasks Are Completed Yet! 📑</p></div>
                )}

            </div>
        </>
    );
}

export default ConfirmedTasks;
