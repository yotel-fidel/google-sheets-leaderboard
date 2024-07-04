const ProgressBar = ({ progressPercentage }) => {
    return (
        <div className="progress-container">
            <div className="progress-bar"></div>
            <div
                className="progress-bar-mask"
                style={{ width: `${100 - progressPercentage}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;