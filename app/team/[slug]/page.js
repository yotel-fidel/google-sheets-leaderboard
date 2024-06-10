"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Loading from '@/app/components/Loading';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

const SalesTeamPage = ({ params }) => {
  const [bookedDemsData, setBookedDemsData] = useState([]);
  const [bookedMDSData, setBookedMDSData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchsalesTeamData = async () => {
      try {
        const [team] = params.slug.split('_');
        const response = await fetch(`/api/getSheetDataByTeam?team=${team}`);
        const data = await response.json();

        setBookedDemsData(data.bookedDemsData);
        setBookedMDSData(data.bookedMDSData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sales info:", error);
      }
    };

    fetchsalesTeamData();
  }, [params.slug]);

  // Render the component based on the found data
  return (
    <div className="mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl text-black font-bold text-center mb-6">{bookedDemsData[0] && bookedDemsData[0].team}</h1>
      <div className='flex flex-wrap justify-between gap-2'>
        <div className='flex-1'>
          <h2 className="text-2xl text-black font-bold text-center mb-6">Sales Leaderboard (Booked Dems) Total</h2>
          {loading && <Loading />}
          {bookedDemsData && bookedDemsData.map((info, index) => (
            <Link
              key={index}
              href={`/sales-person/${info.name.toLowerCase().replace(/\s/g, "_")}`}
              passHref
            >
              <div
                className="item-container flex justify-between items-center p-4 bg-white mb-4 rounded-lg shadow-md hover:bg-gray-50 cursor-pointer"
              >
                <div className="left-side-container flex items-center">
                  <div className="ranking-container text-lg font-bold text-gray-700 mr-4">
                    Rank {index + 1}
                  </div>
                  <div className="person-image-container flex items-center">
                    <div className="image-container w-12 h-12 rounded-full overflow-hidden mr-4">
                      {info.profileImg && <img
                        src={`https://drive.google.com/thumbnail?id=${info.profileImg}&sz=w50`}
                        alt={info.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />}
                      {!info.profileImg && <img
                        src={'/assets/images/default-person.webp'}
                        alt={info.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />}
                    </div>
                    <div>
                      <p className="sales-person-name text-gray-700">{info.name}</p>
                      <Link
                        key={index}
                        href={`/team/${info.team.toLowerCase().replace(/\s/g, "_")}`}
                        passHref
                      >
                        <p className="sales-person-name text-[12px] text-gray-700 hover:underline">{info.team}</p>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="booking-number text-xl font-semibold text-blue-600">
                  {info.total}
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className='flex-1'>
          <h2 className="text-2xl text-black font-bold text-center mb-6">Sales Leaderboard (Booked MDS) Total</h2>
          {loading && <Loading />}
          {bookedMDSData && bookedMDSData.map((info, index) => (
            <Link
              key={index}
              href={`/sales-person/${info.name.toLowerCase().replace(/\s/g, "_")}`}
              passHref
            >
              <div
                className="item-container flex justify-between items-center p-4 bg-white mb-4 rounded-lg shadow-md hover:bg-gray-50 cursor-pointer"
              >
                <div className="left-side-container flex items-center">
                  <div className="ranking-container text-lg font-bold text-gray-700 mr-4">
                    Rank {index + 1}
                  </div>
                  <div className="person-image-container flex items-center">
                    <div className="image-container w-12 h-12 rounded-full overflow-hidden mr-4">
                      {info.profileImg && <img
                        src={`https://drive.google.com/thumbnail?id=${info.profileImg}&sz=w50`}
                        alt={info.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />}
                      {!info.profileImg && <img
                        src={'/assets/images/default-person.webp'}
                        alt={info.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />}
                    </div>
                    <div>
                      <p className="sales-person-name text-gray-700">{info.name}</p>
                      <Link
                        key={index}
                        href={`/team/${info.team.toLowerCase().replace(/\s/g, "_")}`}
                        passHref
                      >
                        <p className="sales-person-name text-[12px] text-gray-700 hover:underline">{info.team}</p>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="booking-number text-xl font-semibold text-blue-600">
                  {info.total}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesTeamPage;
