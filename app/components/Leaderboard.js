"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Leaderboard = () => {
  const [bookedDemsData, setBookedDemsData] = useState([]);
  const [bookedMDSData, setBookedMDSData] = useState([]);

  useEffect(() => {
    const fetchSalesInfo = async () => {
      try {
        const response = await fetch('/api/getSheetDataByTotal');
        const data = await response.json();
        setBookedDemsData(data.bookedDemsData);
        setBookedMDSData(data.bookedMDSData);
      } catch (error) {
        console.error("Error fetching sales info:", error);
      }
    };

    fetchSalesInfo();
  }, []);

  return (
    <div className="leaderboard-container flex flex-wrap justify-between gap-2 mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
      <div className='flex-1'>
      <h1 className="text-2xl text-black font-bold text-center mb-6">Sales Leaderboard (Booked Dems) Total</h1>
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
      <h1 className="text-2xl text-black font-bold text-center mb-6">Sales Leaderboard (Booked MDS) Total</h1>
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
  );
};

export default Leaderboard;
