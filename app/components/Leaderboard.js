"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getWeekRange, getCurrentWeekAndYear } from '../_utils/index'
import Loading from './Loading';

const Leaderboard = () => {
  const [bookedDemsData, setBookedDemsData] = useState([]);
  const [bookedMDSData, setBookedMDSData] = useState([]);
  const [satDemsData, setSatDemsData] = useState([]);
  const [satMDSData, setSatMDSData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { currentWeekNumber, currentYear } = getCurrentWeekAndYear();

  useEffect(() => {
    const fetchSalesInfo = async () => {
      try {
        const response = await fetch('/api/getSheetDataByTotal');
        const data = await response.json();
        setBookedDemsData(data.bookedDemsData);
        setBookedMDSData(data.bookedMDSData);
        setSatDemsData(data.satDemsData);
        setSatMDSData(data.satMDSData);
        setLoading(false);

        // console.log("Week number: ", currentWeekNumber)
        // console.log("Year number: ", currentYear)
        // console.log("testing date: ", getWeekRange(currentWeekNumber, currentYear))
      } catch (error) {
        console.error("Error fetching sales info:", error);
      }
    };

    fetchSalesInfo();
  }, []);

  return (
    <div className="leaderboard-container mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
      <h1 className='text-black'>{getWeekRange(currentWeekNumber, currentYear)}</h1>
      <div className='flex flex-wrap justify-between gap-2'>
        <div className='flex-1'>
          <h1 className="text-2xl text-black font-bold text-center mb-6">(Booked Dems) Total</h1>
          {loading && <Loading />}
          {bookedDemsData && bookedDemsData.sort((a, b) => b.sales[currentWeekNumber - 1] - a.sales[currentWeekNumber - 1]).map((info, index) => (
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
                  {info.sales[currentWeekNumber - 1]}
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className='flex-1'>
          <h1 className="text-2xl text-black font-bold text-center mb-6">(Booked MDS) Total</h1>
          {loading && <Loading />}
          {bookedMDSData && bookedMDSData.sort((a, b) => b.sales[currentWeekNumber - 1] - a.sales[currentWeekNumber - 1]).map((info, index) => (
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
                  {info.sales[currentWeekNumber - 1]}
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className='flex-1'>
          <h1 className="text-2xl text-black font-bold text-center mb-6">(Sat Dems) Total</h1>
          {loading && <Loading />}
          {satDemsData && satDemsData.sort((a, b) => b.sales[currentWeekNumber - 1] - a.sales[currentWeekNumber - 1]).map((info, index) => (
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
                  {info.sales[currentWeekNumber - 1]}
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className='flex-1'>
          <h1 className="text-2xl text-black font-bold text-center mb-6">(Sat MDS) Total</h1>
          {loading && <Loading />}
          {satMDSData && satMDSData.sort((a, b) => b.sales[currentWeekNumber - 1] - a.sales[currentWeekNumber - 1]).map((info, index) => (
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
                  {info.sales[currentWeekNumber - 1]}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>


    </div>
  );
};

export default Leaderboard;
