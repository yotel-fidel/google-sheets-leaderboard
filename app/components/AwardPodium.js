import React from 'react';
import AwardPodiumCard from './AwardPodiumCard';

const AwardPodium = ({ first, second, third, isCurrency, currentWeekNumber, className = '' }) => {
    const formatLargeCurrency = (value) => {
        const removedCurrency = value[0];
        const money = value.substring(1).replace(/,/g, '');

        if (parseFloat(money) >= 1000) {
            return `${removedCurrency}${(parseFloat(money) / 1000).toFixed(1)}k`;
        }
        return `${removedCurrency}${money}`;
    };

    return (
        <div className={`relative w-full max-w-[500px] ${className}`}>
            <img
                src="/assets/images/award_podium.webp"
                alt="Podium"
                className="w-full h-auto"
            />
            <div className="absolute top-0 left-1/2 transform translate-x-[-50%] gap-[15%] flex items-end justify-around">
                <AwardPodiumCard info={second} currentWeekNumber={currentWeekNumber} isCurrency={isCurrency} className='-mb-[4vw] sm:mb-10' />
                <AwardPodiumCard info={first} currentWeekNumber={currentWeekNumber} isCurrency={isCurrency} className='mb-[8vw] sm:mb-24' />
                <AwardPodiumCard info={third} currentWeekNumber={currentWeekNumber} isCurrency={isCurrency} className='-mb-[7.5vw] sm:mb-6' />
            </div>
        </div >
    );
};

export default AwardPodium;
