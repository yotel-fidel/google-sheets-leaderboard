'use client';

import React, { useState, useEffect } from 'react';

const Countdown = ({ targetDate }) => {
    const parseDateString = (dateString) => {
        // Date string is in format "DD/MM/YYYY HH:MM:SS"
        const [datePart, timePart] = dateString.split(' ');
        const [day, month, year] = datePart.split('/');
        const [hour, minute, second] = timePart.split(':');
        return new Date(year, month - 1, day, hour, minute, second);
    };

    const calculateTimeLeft = () => {
        const difference = +parseDateString(targetDate) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, '0'),
                hours: String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, '0'),
                minutes: String(Math.floor((difference / 1000 / 60) % 60)).padStart(2, '0'),
                seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, '0')
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    const [isTimeUp, setIsTimeUp] = useState(Object.keys(timeLeft).length === 0);

    useEffect(() => {
        const timer = setTimeout(() => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);
            if (Object.keys(newTimeLeft).length === 0) {
                setIsTimeUp(true);
            }
        }, 1000);

        return () => clearTimeout(timer);
    });

    const timerComponents = [];

    const intervals = ['days', 'hours', 'minutes', 'seconds'];
    intervals.forEach(interval => {
        timerComponents.push(
            <span key={interval}>
                {timeLeft[interval] !== undefined ? timeLeft[interval] : '00'} {interval}{" "}
            </span>
        );
    });

    return (
        <div>
            <span><b>Incentive Countdown:</b> {timerComponents}</span>
            {/* {isTimeUp && <div><span>Time's up!</span></div>} */}
        </div>
    );
};

export default Countdown;
