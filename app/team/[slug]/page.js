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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RankingCard from '@/app/components/RankingCard';

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
  const [salesSDRData, setSalesSDRData] = useState([]);
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
        setSalesSDRData(data.salesSDRData);
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
      <Tabs defaultValue="bookedDems" className="w-full">
        <TabsList>
          <TabsTrigger value="bookedDems">Booked Dems</TabsTrigger>
          <TabsTrigger value="bookedMDS">Booked MDS</TabsTrigger>
          <TabsTrigger value="satDems">Sat Dems</TabsTrigger>
          <TabsTrigger value="satMDS">Sat MDS</TabsTrigger>
          <TabsTrigger value="salesSDR">Sales</TabsTrigger>
        </TabsList>
        <TabsContent value="bookedDems" className="w-full">
          <h1 className="text-2xl text-black font-bold text-center mb-6">Booked Dems</h1>
          {loading && (<div className="flex justify-center w-full">
            <Loading />
          </div>)}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full'>
            {bookedDemsData && bookedDemsData.sort((a, b) => b.sales[currentWeekNumber - 1] - a.sales[currentWeekNumber - 1]).map((info, index) => (
              <RankingCard key={index} info={info} index={index} currentWeekNumber={currentWeekNumber} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="bookedMDS">
          <h1 className="text-2xl text-black font-bold text-center mb-6">Booked MDS</h1>
          {loading && (<div className="flex justify-center w-full">
            <Loading />
          </div>)}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full'>
            {bookedMDSData && bookedMDSData.sort((a, b) => b.sales[currentWeekNumber - 1] - a.sales[currentWeekNumber - 1]).map((info, index) => (
              <RankingCard key={index} info={info} index={index} currentWeekNumber={currentWeekNumber} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="satDems">
          <h1 className="text-2xl text-black font-bold text-center mb-6">Sat Dems</h1>
          {loading && (<div className="flex justify-center w-full">
            <Loading />
          </div>)}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full'>
            {satDemsData && satDemsData.sort((a, b) => b.sales[currentWeekNumber - 1] - a.sales[currentWeekNumber - 1]).map((info, index) => (
              <RankingCard key={index} info={info} index={index} currentWeekNumber={currentWeekNumber} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="satMDS">
          <h1 className="text-2xl text-black font-bold text-center mb-6">Sat MDS</h1>
          {loading && (<div className="flex justify-center w-full">
            <Loading />
          </div>)}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full'>
            {satMDSData && satMDSData.sort((a, b) => b.sales[currentWeekNumber - 1] - a.sales[currentWeekNumber - 1]).map((info, index) => (
              <RankingCard key={index} info={info} index={index} currentWeekNumber={currentWeekNumber} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="salesSDR">
          <h1 className="text-2xl text-black font-bold text-center mb-6">Sales</h1>
          {loading && (<div className="flex justify-center w-full">
            <Loading />
          </div>)}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full'>
            {salesSDRData && salesSDRData.sort((a, b) => b.sales[currentWeekNumber - 1] - a.sales[currentWeekNumber - 1]).map((info, index) => (
              <RankingCard key={index} info={info} index={index} currentWeekNumber={currentWeekNumber} isCurrency={true} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesTeamPage;
