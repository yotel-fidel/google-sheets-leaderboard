import React from 'react'
import { getTotalCurrencyOrScore } from '@/app/_utils'

const TotalScoreOrCurrencyCard = ({ data, timePeriod, isCurrency }) => {
    const total = getTotalCurrencyOrScore(data, timePeriod, isCurrency);

    return (
        <div className="rounded-sm bg-[#9e0000] p-2 w-fit">
            <span className='text-white'>Total: {total}</span>
        </div>
    );
}

export default TotalScoreOrCurrencyCard;