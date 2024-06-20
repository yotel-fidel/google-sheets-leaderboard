import React from 'react';
import Link from 'next/link';
import { getCurrencyOrScore } from '../_utils';

const AwardPodiumCard = ({ info, isCurrency, periodObject, className = '' }) => {
    const formatLargeCurrency = (value) => {
        const removedCurrency = value[0];
        const money = value.substring(1).replace(/,/g, '');

        if (parseFloat(money) >= 1000) {
            return `${removedCurrency}${(parseFloat(money) / 1000).toFixed(1)}k`;
        }
        return `${removedCurrency}${money}`;
    };

    return (
        <Link
            href={`/sales-person/${info.name.toLowerCase().replace(/\s/g, "_")}`}
            className=''
            passHref
        >
            <div className={`bg-[#9e0000] relative rounded-sm flex flex-col gap-1 items-center justify-center md:min-w-[100px] py-2 px-4 ${className}`}>
                <div className=" text-white text-[2vw] sm:text-[12px] text-center font-bold rounded-full">{info.name}</div>
                <div className="image-container w-[8vw] h-[8vw] max-w-[48px] max-h-[48px] sm:w-12 sm:h-12 rounded-full overflow-hidden">
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
                <div className='absolute -bottom-[2vw] sm:-bottom-[20px] bg-white w-full shadow-sm rounded-b-sm'>
                    <p className='text-center text-[2vw] sm:text-[14px]'>{info && getCurrencyOrScore(info, periodObject, isCurrency)}</p>
                </div>
            </div>
        </Link>
    );
};

export default AwardPodiumCard;
