import React from 'react';
import AwardPodiumCard from './AwardPodiumCard';

const AwardPodium = ({ first, second, third, isCurrency, periodObject, className = '' }) => {
    return (
        <div className={`relative w-full max-w-[500px] ${className}`}>
            <img
                src="/assets/images/award_podium.webp"
                alt="Podium"
                className="w-full h-auto"
            />
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex items-end justify-around gap-[7vw] min-[450px]:gap-[11.5vw] md:gap-[5.25vw] lg:gap-[3vw] 2xl:gap-[2vw]">
                <AwardPodiumCard info={second} periodObject={periodObject} isCurrency={isCurrency} className='-mb-[4vw] sm:mb-10' />
                <AwardPodiumCard info={first} periodObject={periodObject} isCurrency={isCurrency} className='mb-[8vw] sm:mb-24' />
                <AwardPodiumCard info={third} periodObject={periodObject} isCurrency={isCurrency} className='-mb-[7.5vw] sm:mb-6' />
            </div>
        </div >
    );
};

export default AwardPodium;
