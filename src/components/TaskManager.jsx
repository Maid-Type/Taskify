import styles from './TaskManager.module.css';
import Task from "./Task.jsx";
// import API_URL from "/src/helpers.js";
import { useEffect, useReducer, useState } from "react";
import Spinner from "./Spinner.jsx";
import AddTask from "./AddTask.jsx";

const initialState = {
        tasksArray: [],
        isTaskArrEmpty: false,
        isLoading: false,
        error: null
};

const reducer = function (state, action) {
        switch (action.type) {
                case 'loadTasks':
                        return { ...state, tasksArray: action.payload, isTaskArrEmpty: action.payload.filter((item) => item.isTaskCompleted === false).length === 0, error: null };
                case 'isLoading':
                        return { ...state, isLoading: action.payload, isTaskArrEmpty: true, error: null };
                case 'setTaskCompleted': {
                        const updatedArr = state.tasksArray.map((task) => task.taskID === action.payload ? {...task,isTaskCompleted: true} : task);
                        console.log(updatedArr);
                        console.log();
                        sessionStorage.setItem("tasks", JSON.stringify(updatedArr));
                        return { ...state,tasksArray: updatedArr,isTaskArrEmpty: updatedArr.filter((item) => item.isTaskCompleted !== true).length === 0 };
                }
                case 'handleAddTask': {
                        const newArr = [...state.tasksArray, action.payload];
                        sessionStorage.setItem("tasks", JSON.stringify(newArr));
                        return { ...state, tasksArray: newArr, error: null,isTaskArrEmpty: false };
                }
                case 'error':
                        return { ...state, isLoading: false, error: action.payload };
                default:
                        return state;
        }
};

export default function TaskManager() {
        const [state, dispatch] = useReducer(reducer, initialState);
        const [addTaskVisible, setAddTaskVisible] = useState(false);
        const [isUnmounting, setIsUnmounting] = useState(false);

        function handleTaskCompleted(id) {
                dispatch({ type: 'setTaskCompleted', payload: id });
        }

        function handleExitAddTask() {
                setIsUnmounting(true);
                setTimeout(() => {
                        setAddTaskVisible(false);
                        setIsUnmounting(false);
                        const body = document.querySelector('body');
                        body.style.overflow = 'auto';
                }, 500);
        }

        function handleAddTask(task) {
                dispatch({ type: 'handleAddTask', payload: task });
        }

        useEffect(() => {
                const getData = async () => {
                        try {
                                dispatch({ type: 'isLoading', payload: true });
                                const data = JSON.parse(sessionStorage.getItem('tasks'));
                                dispatch({ type: 'isLoading', payload: false });
                                dispatch({ type: 'loadTasks', payload: data });
                        } catch (e) {
                                dispatch({ type: 'error', payload: e.message });
                                console.error(e);
                        }
                };
                getData();
        }, []);

        return (
            <>
                    {state.isLoading ? (
                        <Spinner />
                    ) : (
                        <div className={`${styles.parent} ${state.isTaskArrEmpty ? styles.emptyBg : ''}`}>
                                {state.error && <p className={styles.error}>{state.error}</p>}
                                {state.isTaskArrEmpty ? (
                                    <p className={styles.emptyTasks}>No tasks added! 📥</p>
                                ) : (
                                    state.tasksArray.filter((item) => item.isTaskCompleted === false).map((task) => (
                                        <Task
                                            task={task}
                                            key={task.taskID}
                                            handleTaskCompleted={handleTaskCompleted}
                                        />
                                    ))
                                )}
                        </div>
                    )}
                    <div className={styles.addTask}>
                            <button
                                className={styles.button}
                                onClick={() => {
                                        const body = document.querySelector('body');
                                        body.style.overflow = 'hidden';
                                        setAddTaskVisible(true);
                                }}
                            >
                                    Add Task ➕
                            </button>
                    </div>
                    {addTaskVisible && (
                        <AddTask
                            className={`${!isUnmounting ? styles.show : styles.hide}`}
                            handleAddTask={handleAddTask}
                            handleExitAddTask={handleExitAddTask}
                            tasksArray={state.tasksArray}
                        />
                    )}
            </>
        );
}
