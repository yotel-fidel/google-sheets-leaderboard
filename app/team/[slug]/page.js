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
import { getWeekRange, getCurrentWeekAndYear } from '@/app/_utils'
import Loading from '@/app/components/Loading';
import Button from '@/app/components/Button';

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
  const [bookedDemsData, setBookedDemsData] = useState(null);
  const [bookedMDSData, setBookedMDSData] = useState(null);
  const [satDemsData, setSatDemsData] = useState(null);
  const [satMDSData, setSatMDSData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { currentWeekNumber, currentYear } = getCurrentWeekAndYear();

  useEffect(() => {
    const fetchsalesTeamData = async () => {
      try {
        const [team] = params.slug.split('_');
        const response = await fetch(`/api/getSheetDataByTeam?team=${team}`);
        const data = await response.json();

        setBookedDemsData(data.bookedDemsData);
        setBookedMDSData(data.bookedMDSData);
        setSatDemsData(data.satDemsData);
        setSatMDSData(data.satMDSData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sales info:", error);
      }
    };

    fetchsalesTeamData();
  }, [params.slug]);

  return (
    <div className="min-h-screen mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
      <Button href="/" className="!bg-black hover:!bg-gray-700 text-md px-4 py-2 mb-2">Home</Button>
      {bookedDemsData && (<div>
        <h1 className="text-2xl text-black font-bold text-center">{bookedDemsData[0] && bookedDemsData[0].team}</h1>
        <p className='text-black text-center mb-6'>{getWeekRange(currentWeekNumber, currentYear)}</p>
      </div>)}
      <div className='flex flex-wrap justify-between gap-2'>
        <div className='flex-1'>
          <h2 className="text-2xl text-black font-bold text-center mb-6">Booked Dems</h2>
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
                      {/* <Link
                        key={index}
                        href={`/team/${info.team.toLowerCase().replace(/\s/g, "_")}`}
                        passHref
                      >
                        <p className="sales-person-name text-[12px] text-gray-700 hover:underline">{info.team}</p>
                      </Link> */}
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
          <h2 className="text-2xl text-black font-bold text-center mb-6">Booked MDS</h2>
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
                      {/* <Link
                        key={index}
                        href={`/team/${info.team.toLowerCase().replace(/\s/g, "_")}`}
                        passHref
                      >
                        <p className="sales-person-name text-[12px] text-gray-700 hover:underline">{info.team}</p>
                      </Link> */}
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
          <h2 className="text-2xl text-black font-bold text-center mb-6">Sat Dems</h2>
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
                      {/* <Link
                        key={index}
                        href={`/team/${info.team.toLowerCase().replace(/\s/g, "_")}`}
                        passHref
                      >
                        <p className="sales-person-name text-[12px] text-gray-700 hover:underline">{info.team}</p>
                      </Link> */}
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
          <h2 className="text-2xl text-black font-bold text-center mb-6">Sat MDS</h2>
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
                      {/* <Link
                        key={index}
                        href={`/team/${info.team.toLowerCase().replace(/\s/g, "_")}`}
                        passHref
                      >
                        <p className="sales-person-name text-[12px] text-gray-700 hover:underline">{info.team}</p>
                      </Link> */}
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

export default SalesTeamPage;
