import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { getCurrencyOrScore } from '../_utils';

export default function RankingCard({ info, index, periodObject, isShowTeam, isCurrency }) {
    const router = useRouter()

    const handlePersonTeamClick = (e, personLink) => {
        e.preventDefault()
        router.push(`/team/${personLink.toLowerCase().replace(/\s/g, "_")}`)
    }

    return (
        <Link
            href={`/sales-person/${info.name.toLowerCase().replace(/\s/g, "_")}`}
            className='min-w-[300px]'
            passHref
        >
            <div className="item-container flex gap-1 justify-between items-center p-4 bg-white rounded-lg shadow-md hover:bg-gray-50 cursor-pointer">
                <div className="left-side-container flex items-center">
                    {!isCurrency && (<div className="ranking-container text-[14px] font-bold text-gray-700 mr-4">
                        Rank {index + 1}
                    </div>)}
                    <div className="person-image-container flex flex-col items-left gap-1">
                        {isCurrency && (<div className="ranking-container text-md font-bold text-gray-700 mr-4">
                            Rank {index + 1}
                        </div>)}
                        <div className='flex flex-wrap gap-3'>
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
                            <div className='flex flex-col justify-center'>
                                <p className="sales-person-name text-gray-700 text-[14px]">{info.name}</p>
                                {isShowTeam && (<p
                                    className="sales-person-name text-[12px] text-gray-700 hover:underline"
                                    onClick={(e) => handlePersonTeamClick(e, info.team)}
                                >{info.team}</p>)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="booking-number text-xl font-semibold text-blue-600">
                    {info && getCurrencyOrScore(info, periodObject, isCurrency)}
                </div>
            </div>
        </Link>
    );
}
