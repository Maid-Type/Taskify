import { useState, useEffect } from 'react';
import styles from './AddTask.module.css';
import Task from "./Task.jsx";

function AddTask({ handleAddTask, handleExitAddTask, className,tasksArray }) {
    const newTask = {
        isOptionsVisible: false,
        isCommentsVisible: true,
        isConnectedTasksVisible: false,
        isEditingTasksVisible: false,
        isEditingComment: false,
        isTaskCompleted: false,
        isTaskDeleted: false,
        taskPriority: "",
        taskDescription: "",
        taskComments: [],
        taskID: tasksArray.length + 1,
    };

    const [deepCopy, setDeepCopy] = useState({ ...newTask });
    const [error, setError] = useState('');
    const [fadeError, setFadeError] = useState(false);

    useEffect(() => {
        document.addEventListener('keydown', handleKeydown);

        return () => {
            document.removeEventListener('keydown', handleKeydown);
        };
    }, []);

    function handleKeydown(event) {
        if (event.key === 'Escape') {
            handleExitAddTask();
        }
        if (event.key === 'Enter') {
            event.preventDefault();
            handleTask();
        }
    }

    const handleTaskChanges = (field, value) => {
        setDeepCopy((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const handleTask = () => {
        const { taskPriority, taskDescription, taskComments } = deepCopy;

        if (taskPriority && taskDescription) {
            if (taskComments[0] === '') {
                setDeepCopy((prevState) => ({
                    ...prevState,
                    isCommentsVisible: false,
                    taskComments: []
                }));
            } else {
                setDeepCopy((prevState) => ({
                    ...prevState,
                    isCommentsVisible: false,
                }));
            }

            addTask();
        } else {
            setError('Please input all details about your task!');
            setFadeError(false);
            setTimeout(() => {
                setFadeError(true);
            }, 1000);

            setTimeout(() => {
                setError('');
            }, 3500);
        }
    };

    function addTask() {
        handleAddTask(deepCopy);
        handleExitAddTask();
    }

    return (
        <div className={className}>
            <div className={styles.backdrop} onClick={handleExitAddTask}></div>
            <div className={styles.container}>
                <div className={styles.exitModule} onClick={handleExitAddTask}>❌</div>
                {error && (
                    <div className={`${styles.errors} ${fadeError ? styles['fade-out'] : ''}`}>
                        {error}
                    </div>
                )}
                <div className={styles.inputPart}>
                    <label htmlFor="taskPriority">Task Priority:</label>
                    <select
                        id="taskPriority"
                        value={deepCopy.taskPriority}
                        onChange={(e) => handleTaskChanges('taskPriority', e.target.value)}
                    >
                        <option value="">Select Priority</option>
                        <option value="Main">Main Task</option>
                        <option value="Secondary">Secondary Task</option>
                        <option value="Tertiary">Tertiary Task</option>
                        <option value="Optional">Optional Task</option>
                    </select>

                    <label htmlFor="taskDescription">Task Name:</label>
                    <input
                        type="text"
                        id="taskDescription"
                        placeholder='Input your task!'
                        value={deepCopy.taskDescription}
                        onChange={(e) => handleTaskChanges('taskDescription', e.target.value)}
                    />

                    <div className={styles.inputComments}>
                        <label htmlFor="taskComments">Add Comments:</label>
                        <input
                            type="text"
                            id="taskComments"
                            placeholder='Input your comments!'
                            value={deepCopy.taskComments[0] || ""}
                            onChange={(e) => handleTaskChanges('taskComments', [e.target.value])}
                        />
                    </div>
                </div>

                <Task task={deepCopy} handleTaskChange={handleTaskChanges} shouldBeEdited={false} />

                <button className={styles.button} onClick={handleTask}>Add Task ➕</button>
            </div>
        </div>
    );
}

export default AddTask;
