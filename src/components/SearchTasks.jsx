import styles from './SearchTasks.module.css';
import Header from "./Header.jsx";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";
import Task from "./Task.jsx";
import Error from "./Error.jsx";

function SearchTasks() {
    const [searchValue, setSearchValue] = useState("");
    const [selectedTask, setSelectedTask] = useState(null);
    const inputRef = useRef(null);
    const searchTimeoutRef = useRef(null);
    const [error, setError] = useState(null);
    const [tasks, setTasks] = useState([]);

    function handleTaskChange() {}

    function handleTaskCompleted(id) {
        const updatedArray = tasks.map((item) => {
            if (item.taskID === id) {
                setSelectedTask({ ...item, isTaskCompleted: true });
                return { ...item, isTaskCompleted: true };
            }
            return item;
        });
        sessionStorage.setItem("tasks", JSON.stringify(updatedArray));
    }

    function handleTaskDeleted(id) {
        const updatedArray = tasks.map((item) => {
            if (item.taskID === id) {
                setSelectedTask({ ...item, isTaskDeleted: true });
                return { ...item, isTaskDeleted: true };
            }
            return item;
        });
        sessionStorage.setItem("tasks", JSON.stringify(updatedArray));
    }

    function handleSearchTasks(value) {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            const data = JSON.parse(sessionStorage.getItem("tasks"));

            if (data) {
                const foundTask = data.find((item) =>
                    item.taskDescription.toLowerCase().includes(value.toLowerCase().trim())
                );
                if (foundTask) {
                    setError(null);
                } else {
                    setSelectedTask(null);
                    setError('No task found');
                }
            } else {
                setError('No data found');
            }
        }, 1000);
    }

    function handleRestoreTask(task) {
        const data = JSON.parse(sessionStorage.getItem("tasks"));
        const updatedArray = data.map((item) => {
            if (item.taskID === task.taskID) {
                return { ...item, isTaskDeleted: false, isTaskCompleted: false };
            }
            return item;
        });
        console.log(updatedArray)
        sessionStorage.setItem("tasks", JSON.stringify(updatedArray));
        setSelectedTask({ ...task, isTaskDeleted: false,isTaskCompleted: false });
    }

    useEffect(() => {
        setTasks(JSON.parse(sessionStorage.getItem("tasks")) || []);
        inputRef.current.focus();

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    function getSortedTasks(tasks, inputValue) {
        if (!inputValue) return tasks;

        const lowerInput = inputValue.toLowerCase().trim();

        return tasks.sort((a, b) => {
            const aDescription = a.taskDescription.toLowerCase();
            const bDescription = b.taskDescription.toLowerCase();

            const aStartsWith = aDescription.startsWith(lowerInput);
            const bStartsWith = bDescription.startsWith(lowerInput);

            if (aStartsWith && !bStartsWith) return -1;
            if (!aStartsWith && bStartsWith) return 1;

            const aIncludes = aDescription.includes(lowerInput);
            const bIncludes = bDescription.includes(lowerInput);

            if (aIncludes && !bIncludes) return -1;
            if (!aIncludes && bIncludes) return 1;

            return aDescription.localeCompare(bDescription);
        });
    }


    return (
        <>
            <Header />
            <div className={styles.container}>
                <div className={styles.search}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} style={{ fontSize: '25px', color: "#07121a" }} />
                    <input
                        type="text"
                        placeholder="Search Task Name"
                        value={searchValue}
                        onChange={(e) => {
                            setSearchValue(e.target.value);
                            handleSearchTasks(e.target.value);
                        }}
                        ref={inputRef}
                    />
                </div>
            </div>
            {selectedTask !== null ? (
                <div style={{ width: '20%', marginTop: "2rem", display: "flex", justifyContent: "center" }}>
                    {error === null ? (
                        selectedTask && <Task
                            handleTaskChange={handleTaskChange}
                            shouldBeEdited={true}
                            task={selectedTask}
                            statusIsVisible={true}
                            handleRestoreTask={handleRestoreTask}
                            handleTaskCompleted={handleTaskCompleted}
                            handleTaskDeleted={handleTaskDeleted}
                        />
                    ) : (
                        <Error errorMessage={error} />
                    )}
                </div>
            ) : (
                <div className={searchValue.length > 0 ? `${styles.suggestions} ${styles.show}` : styles.suggestions}>
                    {searchValue.length > 0 && getSortedTasks(tasks, searchValue).length === 0 ? (
                        <p>No tasks found</p>
                    ) : (
                        <ul>
                            {searchValue.length > 0 && getSortedTasks(tasks, searchValue).map((item) => (
                                <li key={item.taskID} onClick={() => setSelectedTask(item)}>{item.taskDescription}</li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

        </>
    );
}

export default SearchTasks;
