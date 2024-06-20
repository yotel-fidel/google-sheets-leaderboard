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
  elements,
  Filler,
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
  Legend,
  Filler
);


const elementConfig = {
  line: {
    tension: 0.5,
    borderWidth: 2,
    fill: true,
    borderColor: "#e62f36",
    backgroundColor: "#ee733e",
  },
  point: {
    backgroundColor: "#9e0000"
  }
}

export const optionsBookedDems = {
  responsive: true,
  // animations: {
  //   tension: {
  //     duration: 1000,
  //     easing: 'linear',
  //     from: 1,
  //     to: 0,
  //     loop: true
  //   }
  // },

  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Booked Dems Chart',
    },
  },
  elements: elementConfig,

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
  elements: elementConfig,
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
  elements: elementConfig,
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
  elements: elementConfig,
};
export const optionsSalesSDR = {
  responsive: true,
  scales: {
    y: {
      ticks: {
        callback: function (value, index, ticks) {
          return '£' + value;
        }
      },
      // suggestedMin: 0,
    }
  },
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Sales Chart',
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || '';

          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(context.parsed.y);
          }
          return label;
        }
      }
    }
  },
  elements: elementConfig,
};

export const optionsAllData = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Weekly Chart',
    },
  },
  // elements: {
  //   point: {
  //     backgroundColor: "#9e0000"
  //   }
  // },
};

const SalesPersonPage = ({ params }) => {
  const [bookedDemsData, setBookedDemsData] = useState(null);
  const [bookedMDSData, setBookedMDSData] = useState(null);
  const [satDemsData, setSatDemsData] = useState(null);
  const [satMDSData, setSatMDSData] = useState(null);
  const [salesSDRData, setSalesSDRData] = useState(null);
  const [bookedDemsDataGraph, setBookedDemsDataGraph] = useState(null);
  const [bookedMDSDataGraph, setBookedMDSDataGraph] = useState(null);
  const [satDemsDataGraph, setSatDemsDataGraph] = useState(null);
  const [satMDSDataGraph, setSatMDSDataGraph] = useState(null);
  const [salesSDRDataGraph, setSalesSDRDataGraph] = useState(null);
  const [allDataGraph, setAllDataGraph] = useState(null);
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
        setSalesSDRData(data.salesSDRData);
        setBookedDemsDataGraph({
          labels: data.bookedDemsData.sales.map((week, index) => `Week ${index + 1}`),
          datasets: [
            {
              label: 'Booked Dems',
              data: data.bookedDemsData.sales,
            },
          ],
        })
        setBookedMDSDataGraph({
          labels: data.bookedMDSData.sales.map((week, index) => `Week ${index + 1}`),
          datasets: [
            {
              label: 'Booked MDS',
              data: data.bookedMDSData.sales,
            },
          ],
        })
        setSatDemsDataGraph({
          labels: data.satDemsData.sales.map((week, index) => `Week ${index + 1}`),
          datasets: [
            {
              label: 'Sat Dems',
              data: data.satDemsData.sales,
            },
          ],
        })
        setSatMDSDataGraph({
          labels: data.satMDSData.sales.map((week, index) => `Week ${index + 1}`),
          datasets: [
            {
              label: 'Sat MDS',
              data: data.satMDSData.sales,
            },
          ],
        })
        setSalesSDRDataGraph({
          labels: data.salesSDRData.sales.map((week, index) => `Week ${index + 1}`),
          datasets: [
            {
              label: 'Sales',
              data: data.salesSDRData.sales.map(sale => sale.substring(1).replace(/,/g, '')),
            },
          ],
        })
        setAllDataGraph({
          labels: data.salesSDRData.sales.map((week, index) => `Week ${index + 1}`),
          datasets: [
            {
              label: 'Booked Dems',
              data: data.bookedDemsData.sales,
              borderColor: "#e62f36",
              pointBackgroundColor: "#9e0000",
              tension: 0.5,
            },
            {
              label: 'Booked MDS',
              data: data.bookedMDSData.sales,
              borderColor: "#90e0ef",
              pointBackgroundColor: "#023047",
              tension: 0.5,
            },
            {
              label: 'Sat Dems',
              data: data.satDemsData.sales,
              borderColor: "#57cc99",
              pointBackgroundColor: "#414833",
              tension: 0.5,
            },
            {
              label: 'Sat MDS',
              data: data.satMDSData.sales,
              borderColor: "#9f86c0",
              pointBackgroundColor: "#480ca8",
              tension: 0.5,
            },
          ],
        })
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sales info:", error);
        setLoading(false);
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
        {bookedDemsData && !bookedDemsData.profileImg && <img
          src={'/assets/images/default-person.webp'}
          alt={bookedDemsData.name}
          className="w-[150px] h-[150px] rounded-lg shadow-md object-cover"
          referrerPolicy="no-referrer"
        />}
        {bookedDemsData && (<div className=''><h1 className="text-2xl text-black font-bold text-left">{bookedDemsData.name}</h1>
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
                Total Booked Dems: {bookedDemsData ? bookedDemsData.total : 0}
              </div>

              {bookedDemsDataGraph && (
                <div className=''>
                  <Line options={optionsBookedDems} data={bookedDemsDataGraph} />
                </div>
              )}
            </div>

            <div className='flex-1'>
              <div className="mt-4 text-xl font-semibold text-blue-600">
                Total Booked MDS: {bookedMDSData ? bookedMDSData.total : 0}
              </div>
              {bookedMDSDataGraph && (
                <div className=''>
                  <Line options={optionsBookedMDS} data={bookedMDSDataGraph} />
                </div>
              )}
            </div>

            <div className='flex-1'>
              <div className="mt-4 text-xl font-semibold text-blue-600">
                Total Sat Dems: {satDemsData ? satDemsData.total : 0}
              </div>
              {satDemsDataGraph && (
                <div className=''>
                  <Line options={optionsSatDems} data={satDemsDataGraph} />
                </div>
              )}
            </div>
            <div className='flex-1'>
              <div className="mt-4 text-xl font-semibold text-blue-600">
                Total Sat MDS: {satMDSData ? satMDSData.total : 0}
              </div>
              {satMDSDataGraph && (
                <div className=''>
                  <Line options={optionsSatMDS} data={satMDSDataGraph} />
                </div>
              )}
            </div>
            <div className='flex-1'>
              <div className="mt-4 text-xl font-semibold text-blue-600">
                Total Sales: £{salesSDRData ? salesSDRData.total : 0}
              </div>
              {salesSDRDataGraph && (
                <div className=''>
                  <Line options={optionsSalesSDR} data={salesSDRDataGraph} />
                </div>
              )}
            </div>
            <div className='flex-1'>
              <div className="mt-4 text-xl font-semibold text-blue-600">
                All Data
              </div>
              {salesSDRDataGraph && (
                <div className=''>
                  <Line options={optionsAllData} data={allDataGraph} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {!bookedDemsData && !loading && (
        <div className='flex justify-center'>
          <h1>No data found.</h1>
        </div>
      )}
    </div>
  );
};

export default SalesPersonPage;
