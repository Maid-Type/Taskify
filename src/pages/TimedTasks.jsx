import Header from "../components/Header.jsx";
import TaskManager from "../components/TaskManager.jsx";

function TimedTasks() {
    return (
        <>
            <Header selected={'Timed - Tasks'}></Header>
            <TaskManager></TaskManager>
        </>
    );
}

export default TimedTasks;