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
        text: 'Booked Dems Chart',
      },
    },
  };

const SalesPersonPage = ({ params }) => {
  const [bookedDemsData, setBookedDemsData] = useState([]);
  const [bookedMDSData, setBookedMDSData] = useState([]);
  const [bookedDemsDataGraph, setBookedDemsDataGraph] = useState(null);

  useEffect(() => {
    const fetchSalesInfo = async () => {
      try {
        const [firstName, lastName] = params.slug.split('_');
        // console.log("First name: ", firstName, "Last Name: ", lastName)
        const response = await fetch(`/api/getSheetDataByPerson?firstName=${firstName}&lastName=${lastName}`);
        const data = await response.json();

        setBookedDemsData(data.bookedDemsData);
        setBookedMDSData(data.bookedMDSData);
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
      } catch (error) {
        console.error("Error fetching sales info:", error);
      }
    };

    fetchSalesInfo();
  }, [params.slug]);

  // Render the component based on the found data
  return (
    <div className=" mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl text-black font-bold text-center mb-6">{bookedDemsData ? bookedDemsData.name : 'Sales Person'}</h1>
      {bookedDemsData && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">Team: {bookedDemsData.team}</h2>
          <table className="min-w-full mt-4 text-black">
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
          </table>
          <div className="mt-4 text-xl font-semibold text-blue-600">
            Total Sales: {bookedDemsData.total}
          </div>

          {bookedDemsDataGraph && <Line options={options} data={bookedDemsDataGraph} />}
        </div>
      )}
    </div>
  );
};

export default SalesPersonPage;
