import React from 'react';

const AwardPodiumCard = ({ info, isCurrency, currentWeekNumber, className = '' }) => {
    const formatLargeCurrency = (value) => {
        const removedCurrency = value[0];
        const money = value.substring(1).replace(/,/g, '');

        if (parseFloat(money) >= 1000) {
            return `${removedCurrency}${(parseFloat(money) / 1000).toFixed(1)}k`;
        }
        return `${removedCurrency}${money}`;
    };

    return (
        <div className={`bg-[#9e0000] relative rounded-sm flex flex-col gap-1 items-center md:min-w-[100px] py-2 px-4 ${className}`}>
            <div className=" text-white text-[12px] text-center font-bold rounded-full">{info.name}</div>
            <div className="image-container w-12 h-12 rounded-full overflow-hidden">
                {info.profileImg ? (
                    <img
                        src={`https://drive.google.com/thumbnail?id=${info.profileImg}&sz=w50`}
                        alt={info.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <img
                        src={'/assets/images/default-person.webp'}
                        alt={info.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                    />
                )}
            </div>
            <div className='absolute -bottom-[20px] bg-white w-full shadow-sm rounded-b-sm'>
                <p className='text-center text-[14px]'>{isCurrency ? formatLargeCurrency(info.sales[currentWeekNumber - 1]) : info.sales[currentWeekNumber - 1]}</p>
            </div>
        </div>
    );
};

export default AwardPodiumCard;
