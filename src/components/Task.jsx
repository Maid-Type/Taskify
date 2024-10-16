/* eslint-disable react/prop-types */
import styles from './Task.module.css';
import { useEffect, useReducer, useRef, useState } from "react";

const reducer = (state, action) => {
    switch (action.type) {
        case 'showOptions':
            return { ...state, isOptionsVisible: !state.isOptionsVisible, isEditingTasksVisible: false};
        case 'hideOptions':
            return { ...state, isOptionsVisible: false, isEditingTasksVisible: false, isEditingComment: false, isCommentsVisible: false };
        case 'editTask':
            return { ...state, isOptionsVisible: true, isEditingTasksVisible: true, isCommentsVisible: true };
        case 'editTaskPriority':
            return { ...state, taskPriority: action.payload };
        case 'editTaskDescription':
            return { ...state, taskDescription: action.payload };
        case 'toggleComments':
            return { ...state, isCommentsVisible: !state.isCommentsVisible };
        case 'editComment': {
            const updatedComments = [...state.taskComments];
            updatedComments[action.index] = action.payload;
            return { ...state, taskComments: updatedComments };
        }
        case 'addComment': {
            if (action.payload.trim() !== '') {
                return { ...state, taskComments: [...state.taskComments, action.payload], isEditingComment: false };
            }
            return state;
        }
        case 'deleteComment': {
            const updatedComments = [...state.taskComments].splice(action.index, 1);
            sessionStorage.setItem('tasks', JSON.stringify(updatedComments));
            return { ...state, taskComments: updatedComments };
        }
        case 'startEditingComment':
            return { ...state, isEditingComment: true,isCommentsVisible: true };
        case 'resetState':
            return action.payload;
        default:
            return state;
    }
};

function Task({ task,handleTaskCompleted,handleTaskChange,shouldBeEdited = true }) {
    const [state, dispatch] = useReducer(reducer, task);
    const [prevTask, setPrevTask] = useState(task);
    const [comment, setComment] = useState('');
    const inputRefs = useRef([]);

    useEffect(() => {
        if (JSON.stringify(task) !== JSON.stringify(prevTask)) {
            dispatch({ type: 'resetState', payload: task });
            setPrevTask(task);
        }
    }, [task]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const isInputClicked = inputRefs.current.includes(event.target);
            if (
                state.isOptionsVisible &&
                !event.target.closest(`.${styles.options}`) &&
                !event.target.closest(`.${styles.taskOptions}`) &&
                !event.target.closest(`.${styles.taskSelect}`) &&
                !event.target.closest(`.${styles.taskMain}`) &&
                !event.target.closest(`.${styles.button}`) &&
                !isInputClicked
            ) {
                dispatch({ type: 'hideOptions' });
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                dispatch({ type: 'hideOptions' });
            }
        };

        if (state.isOptionsVisible === true) {
            document.addEventListener('click', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [state.isOptionsVisible]);

    useEffect(() => {
        if (handleTaskChange && JSON.stringify(state) !== JSON.stringify(task)) {
            handleTaskChange(state);
        }
    }, [state, task]);


    const handleCommentChange = (index, e) => {
        dispatch({ type: 'editComment', index, payload: e.target.value });
    };

    const handleAddComment = () => {
        console.log(comment);
        if (comment.trim().length > 3) {
            dispatch({ type: 'addComment', payload: comment });
            setComment('');
        } else {
            alert('Please input a valid comment!');
        }
    };

    const handleDeleteComment = (index) => {
        dispatch({ type: 'deleteComment', index });
    };

    return (
        <div className={`${styles.container} ${(state.isCommentsVisible && state.taskComments.length > 0) ? styles.extended : ''}`} key={state.taskID}>
            <div className={styles.element}>
                {state.isOptionsVisible && (
                    <div className={styles.taskOptions}>
                        <ul>
                            <li onClick={() => dispatch({ type: 'editTask' })}>
                                <p>Edit Task</p>
                            </li>
                            <li onClick={() => handleTaskCompleted(state.taskID)}>
                                <p>Delete Task</p>
                            </li>
                            <li onClick={() => dispatch({ type: 'startEditingComment' })}>
                                <p>Add comment</p>
                            </li>
                        </ul>
                    </div>
                )}
                <div className={styles.mainPart}>
                    <header className={styles.taskHeader}>
                        {state.isEditingTasksVisible && state.isOptionsVisible ? (
                            <select
                                value={state.taskPriority}
                                className={styles.taskSelect}
                                onChange={(e) => dispatch({ type: 'editTaskPriority', payload: e.target.value })}
                            >
                                <option value="Main">Main Task</option>
                                <option value="Secondary">Secondary Task</option>
                                <option value="Optional">Optional Task</option>
                                <option value="Tertiary">Tertiary Task</option>
                            </select>
                        ) : (
                            <h2>{state.taskPriority} Task</h2>
                        )}
                        {shouldBeEdited && (<div
                            onClick={() => dispatch({type: 'showOptions'})}
                            className={`${styles.options} ${state.isOptionsVisible ? styles.active : ''}`}
                        >
                            {state.isOptionsVisible &&
                                <div className={styles.connected} ref={(el) => (inputRefs.current[0] = el)}></div>}
                            <div className={styles.dot}></div>
                            <div className={styles.dot}></div>
                            <div className={styles.dot}></div>
                        </div>)}

                    </header>
                    <main className={styles.taskMain}>
                        {state.isEditingComment ? (
                            <>
                                <input
                                    id={styles.taskDescriptionInput}
                                    type="text"
                                    placeholder={comment ? '' : 'Add comment!'}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            if (comment.trim().length > 3) {
                                                dispatch({type: 'addComment', payload: comment});
                                                setComment('');
                                            } else {
                                                alert('Please input a valid comment!');
                                            }
                                        }
                                    }}
                                />
                                <button className={styles.button} onClick={handleAddComment}>Add</button>
                            </>
                        ) : state.isEditingTasksVisible ? (
                            <input
                                id={styles.taskDescriptionInput}
                                type="text"
                                placeholder='Input your task!'
                                value={state.taskDescription}
                                onChange={(e) => dispatch({ type: 'editTaskDescription', payload: e.target.value })}
                            />
                        ) : (
                            <>
                                <p>{state.taskDescription}</p>
                                <button className={styles.button} onClick={() => {
                                    handleTaskCompleted(state.taskID)
                                }}>✅</button>
                            </>
                        )}
                    </main>
                    {state.isCommentsVisible && state.taskComments.length !== 0 &&  (
                        <div>
                            <ul className={styles.comments}>
                                {state.taskComments.map((comment, index) => (
                                    state.isEditingTasksVisible ? (
                                        <div key={index}>
                                            <input
                                                type="text"
                                                value={comment}
                                                placeholder='Input your comment'
                                                onChange={(e) => handleCommentChange(index, e)}
                                                ref={(el) => (inputRefs.current[index + 1] = el)}
                                            />
                                            <button
                                                className={styles.button}
                                                onClick={() => handleDeleteComment(index)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ) : (
                                        <li key={index}>{comment}</li>
                                    )
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <footer className={styles.taskFooter}>
                    <button className={styles.button} onClick={() => state.taskComments.length !== 0 && dispatch({ type: 'toggleComments' })}>
                        {(state.isCommentsVisible && state.taskComments.length > 0) ? <p>Hide Comments</p> : <p>{state.taskComments.length > 0 && state.taskComments.length || 'No'} Comments</p>}
                    </button>
                    <button disabled className={styles.button}>4 🔗</button>
                </footer>
            </div>
        </div>
    );
}

export default Task;
