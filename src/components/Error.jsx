import styles from './Error.module.css';


function Error({errorMessage}) {
    return (
        <>
            <div className={styles.container}>
                <h1>{errorMessage}</h1>
            </div>
        </>
    );
}

export default Error;