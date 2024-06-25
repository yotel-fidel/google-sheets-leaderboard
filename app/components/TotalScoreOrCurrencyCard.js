import React from 'react'
import { getTotalCurrencyOrScore } from '@/app/_utils'

const TotalScoreOrCurrencyCard = ({ data, timePeriod, isCurrency, className }) => {
    const total = getTotalCurrencyOrScore(data, timePeriod, isCurrency);

    return (
        <div className={`rounded-sm bg-[#9e0000] text-white p-2 w-fit ${className}`}>
            <span className=''>Total: {total}</span>
        </div>
    );
}

export default TotalScoreOrCurrencyCard;