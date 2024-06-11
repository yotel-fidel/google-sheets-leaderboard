"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getWeekRange, getCurrentWeekAndYear } from '../_utils/index'
import Loading from './Loading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RankingCard from './RankingCard';


const Leaderboard = () => {
  const [bookedDemsData, setBookedDemsData] = useState([]);
  const [bookedMDSData, setBookedMDSData] = useState([]);
  const [satDemsData, setSatDemsData] = useState([]);
  const [satMDSData, setSatMDSData] = useState([]);
  const [salesSDRData, setSalesSDRData] = useState([]);
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
        setSalesSDRData(data.salesSDRData);
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
    <div className="leaderboard-container mx-auto p-4 min-h-screen bg-gray-100 rounded-lg shadow-lg">
      <h1 className='text-black text-center mb-2'>{getWeekRange(currentWeekNumber, currentYear)}</h1>
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
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full'>
            {loading && (<div className="flex justify-center w-full">
              <Loading />
            </div>)}
            {bookedDemsData && bookedDemsData.sort((a, b) => b.sales[currentWeekNumber - 1] - a.sales[currentWeekNumber - 1]).map((info, index) => (
              <RankingCard key={index} info={info} index={index} currentWeekNumber={currentWeekNumber} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="bookedMDS">
          <h1 className="text-2xl text-black font-bold text-center mb-6">Booked MDS</h1>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full'>
            {loading && (<div className="flex justify-center w-full">
              <Loading />
            </div>)}
            {bookedMDSData && bookedMDSData.sort((a, b) => b.sales[currentWeekNumber - 1] - a.sales[currentWeekNumber - 1]).map((info, index) => (
              <RankingCard key={index} info={info} index={index} currentWeekNumber={currentWeekNumber} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="satDems">
          <h1 className="text-2xl text-black font-bold text-center mb-6">Sat Dems</h1>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full'>
            {loading && (<div className="flex justify-center w-full">
              <Loading />
            </div>)}
            {satDemsData && satDemsData.sort((a, b) => b.sales[currentWeekNumber - 1] - a.sales[currentWeekNumber - 1]).map((info, index) => (
              <RankingCard key={index} info={info} index={index} currentWeekNumber={currentWeekNumber} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="satMDS">
          <h1 className="text-2xl text-black font-bold text-center mb-6">Sat MDS</h1>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full'>
            {loading && (<div className="flex justify-center w-full">
              <Loading />
            </div>)}
            {satMDSData && satMDSData.sort((a, b) => b.sales[currentWeekNumber - 1] - a.sales[currentWeekNumber - 1]).map((info, index) => (
              <RankingCard key={index} info={info} index={index} currentWeekNumber={currentWeekNumber} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="salesSDR">
          <h1 className="text-2xl text-black font-bold text-center mb-6">Sales</h1>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full'>
            {loading && (<div className="flex justify-center w-full">
              <Loading />
            </div>)}
            {salesSDRData && salesSDRData.sort((a, b) => b.sales[currentWeekNumber - 1] - a.sales[currentWeekNumber - 1]).map((info, index) => (
              <RankingCard key={index} info={info} index={index} currentWeekNumber={currentWeekNumber} isCurrency={true} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Leaderboard;
