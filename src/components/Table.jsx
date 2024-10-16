import styles from './Table.module.css';
import {useEffect, useReducer, useState} from "react";

const initialState = {
    tasks: [],
    seeComments: false,
    taskComments: null,
}

const reducer = (state , action) => {
    switch(action.type) {
        case 'resetState':
            return {...state,tasks: action.payload}
        case 'loadComments':
            return {...state,taskComments: action.payload,seeComments: true}
        case 'toggleComments':
            return {...state,seeComments: !state.seeComments,}
        default:
            return state;
    }
}

function Table({tasks = [],isHeaderVisible,removeCompletedTask}) {
    const [state,dispatch] = useReducer(reducer,initialState);
    const [itemToSend,setItemToSend] = useState(null);

    useEffect(() => {
        dispatch({type:"resetState",payload:tasks});
    }, [tasks]);



    function handleSeeComments(task) {
        setItemToSend(tasks.find((item) => item.taskID === task.taskID));
        if (itemToSend?.taskComments === state.taskComments) {
            dispatch({type: 'toggleComments'});
        }
    }

    useEffect(() => {
        if (itemToSend) {
            dispatch({type: 'loadComments', payload: itemToSend.taskComments});
        }
    }, [itemToSend]);





    return (
        <>
            <div className={styles.container}>
                <table className={state.seeComments ? `${styles.table} ${styles.visibleComments}` : styles.table}>
                    <thead className={styles.thead}>
                    <tr className={styles.tHeadtr}>
                        <th>Task Description</th>
                        <th>Task Priority</th>
                        <th>Task Comments</th>
                        <th>Task ID</th>
                        <th>Task Status</th>
                        <th></th>
                    </tr>
                    </thead>

                    <tbody className={styles.tbody}>
                    {tasks.map((task, index) => (
                        <tr className={index % 2 === 0 ? styles.tBodytr : `${styles.tBodytr} ${styles.isOdd}`} key={index}>
                            <td>{task.taskDescription}</td>
                            <td>{task.taskPriority}</td>
                            <td>
                                <button onClick={() => handleSeeComments(task)}>See Comments
                                    💬 {task.taskComments.length}</button>
                            </td>
                            <td>{task.taskID}</td>
                            <td>{task.isTaskCompleted ? 'Task Completed' : 'Task is Not Completed!'}</td>
                            <td>
                                <button onClick={() => removeCompletedTask(task)}>❎</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {state.seeComments && (
                    <div className={isHeaderVisible ? `${styles.comments} ${styles.fixedHeight}` : styles.comments }>
                        <div className={styles.commentsHeader}>
                            <p>{itemToSend.taskDescription}</p>
                            <button className={styles.button} onClick={() => dispatch({type: 'toggleComments'})}>❌</button>
                        </div>
                        <div className={styles.commentsMain}>
                            <ul>
                                {state.taskComments.map((comment, index) => (
                                    <li key={index}>{comment}</li>))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default Table;