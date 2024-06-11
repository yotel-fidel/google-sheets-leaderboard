import Link from 'next/link';
import { useRouter } from 'next/navigation'

export default function RankingCard({ info, index, currentWeekNumber, isCurrency }) {
    const router = useRouter()

    const handlePersonTeamClick = (e, personLink) => {
        e.preventDefault()
        router.push(`/team/${personLink.toLowerCase().replace(/\s/g, "_")}`)
    }

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
            className='min-w-[300px]'
            passHref
        >
            <div className="item-container flex justify-between items-center p-4 bg-white rounded-lg shadow-md hover:bg-gray-50 cursor-pointer">
                <div className="left-side-container flex items-center">
                    <div className="ranking-container text-lg font-bold text-gray-700 mr-4">
                        Rank {index + 1}
                    </div>
                    <div className="person-image-container flex items-center">
                        <div className="image-container w-12 h-12 rounded-full overflow-hidden mr-4">
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
                        <div>
                            <p className="sales-person-name text-gray-700">{info.name}</p>
                            <p
                                className="sales-person-name text-[12px] text-gray-700 hover:underline"
                                onClick={(e) => handlePersonTeamClick(e, info.team)}
                            >{info.team}</p>
                        </div>
                    </div>
                </div>
                <div className="booking-number text-xl font-semibold text-blue-600">
                    {isCurrency ? formatLargeCurrency(info.sales[currentWeekNumber - 1]) : info.sales[currentWeekNumber - 1]}
                </div>
            </div>
        </Link>
    );
}
