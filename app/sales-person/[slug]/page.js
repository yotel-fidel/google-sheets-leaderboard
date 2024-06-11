"use client"

import React, { useState, useEffect } from 'react';
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
import Button from '@/app/components/Button';
import Link from 'next/link';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const optionsBookedDems = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Booked Dems Chart',
    },
  },
};
export const optionsBookedMDS = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Booked MDS Chart',
    },
  },
};
export const optionsSatDems = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Sat Dems Chart',
    },
  },
};
export const optionsSatMDS = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Sat MDS Chart',
    },
  },
};

const SalesPersonPage = ({ params }) => {
  const [bookedDemsData, setBookedDemsData] = useState(null);
  const [bookedMDSData, setBookedMDSData] = useState(null);
  const [satDemsData, setSatDemsData] = useState(null);
  const [satMDSData, setSatMDSData] = useState(null);
  const [bookedDemsDataGraph, setBookedDemsDataGraph] = useState(null);
  const [bookedMDSDataGraph, setBookedMDSDataGraph] = useState(null);
  const [satDemsDataGraph, setSatDemsDataGraph] = useState(null);
  const [satMDSDataGraph, setSatMDSDataGraph] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesInfo = async () => {
      try {
        const [firstName, lastName] = params.slug.split('_');
        // console.log("First name: ", firstName, "Last Name: ", lastName)
        const response = await fetch(`/api/getSheetDataByPerson?firstName=${firstName}&lastName=${lastName}`);
        const data = await response.json();

        setBookedDemsData(data.bookedDemsData);
        setBookedMDSData(data.bookedMDSData);
        setSatDemsData(data.satDemsData);
        setSatMDSData(data.satMDSData);
        setBookedDemsDataGraph({
          labels: data.bookedDemsData.sales.map((week, index) => `Week ${index + 1}`),
          datasets: [
            {
              label: 'Booked Dems',
              data: data.bookedDemsData.sales,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
          ],
        })
        setBookedMDSDataGraph({
          labels: data.bookedMDSData.sales.map((week, index) => `Week ${index + 1}`),
          datasets: [
            {
              label: 'Booked MDS',
              data: data.bookedMDSData.sales,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
          ],
        })
        setSatDemsDataGraph({
          labels: data.satDemsData.sales.map((week, index) => `Week ${index + 1}`),
          datasets: [
            {
              label: 'Sat Dems',
              data: data.satDemsData.sales,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
          ],
        })
        setSatMDSDataGraph({
          labels: data.satMDSData.sales.map((week, index) => `Week ${index + 1}`),
          datasets: [
            {
              label: 'Sat Dems',
              data: data.satMDSData.sales,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
          ],
        })
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sales info:", error);
      }
    };

    fetchSalesInfo();
  }, [params.slug]);

  // Render the component based on the found data
  return (
    <div className="min-h-screen mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
      <Button href="/" className="!bg-black hover:!bg-gray-700 text-md px-4 py-2 mb-2">Home</Button>
      <div className='flex gap-[10px] items-end mb-3'>
        {bookedDemsData && bookedDemsData.profileImg && <img
          src={`https://drive.google.com/thumbnail?id=${bookedDemsData.profileImg}&sz=w150`}
          alt={bookedDemsData.name}
          className="w-[150px] h-[150px] rounded-lg shadow-md object-cover"
          referrerPolicy="no-referrer"
        />}
        {bookedDemsData && (<div className=''><h1 className="text-2xl text-black font-bold text-center">{bookedDemsData.name}</h1>
          <h2 className="text-lg font-semibold text-gray-700">
            Team: <Link
              href={`/team/${bookedDemsData.team.toLowerCase().replace(/\s/g, "_")}`}
              passHref
              className='hover:underline'
            >{bookedDemsData.team}</Link>
          </h2></div>)}
      </div>

      {loading && <Loading />}
      {bookedDemsData && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          {/* <table className="min-w-full mt-4 text-black">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left">Week</th>
                <th className="px-6 py-3 text-left">Sales</th>
              </tr>
            </thead>
            <tbody>
              {bookedDemsData.sales?.map((week, index) => (
                <tr key={index} className={(index + 1) % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-6 py-4 whitespace-nowrap">Week {index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{week}</td>
                </tr>
              ))}
            </tbody>
          </table> */}

          <div className='grid md:grid-cols-2'>
            <div className='flex-1'>
              <div className="mt-4 text-xl font-semibold text-blue-600">
                Total Booked Dems: {bookedDemsData.total}
              </div>

              {bookedDemsDataGraph && (
                <div className=''>
                  <Line options={optionsBookedDems} data={bookedDemsDataGraph} />
                </div>
              )}
            </div>


            <div className='flex-1'>
              <div className="mt-4 text-xl font-semibold text-blue-600">
                Total Booked Dems: {bookedMDSData.total}
              </div>
              {bookedMDSDataGraph && (
                <div className=''>
                  <Line options={optionsBookedMDS} data={bookedMDSDataGraph} />
                </div>
              )}
            </div>

            <div className='flex-1'>
              <div className="mt-4 text-xl font-semibold text-blue-600">
                Total Sat Dems: {satDemsData.total}
              </div>
              {bookedMDSDataGraph && (
                <div className=''>
                  <Line options={optionsSatDems} data={satDemsDataGraph} />
                </div>
              )}
            </div>
            <div className='flex-1'>
              <div className="mt-4 text-xl font-semibold text-blue-600">
                Total Sat MDS: {satMDSData.total}
              </div>
              {bookedMDSDataGraph && (
                <div className=''>
                  <Line options={optionsSatMDS} data={satMDSDataGraph} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesPersonPage;
