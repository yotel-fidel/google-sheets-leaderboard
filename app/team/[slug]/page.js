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
import ButtonWithLink from '@/app/components/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import RankingCard from '@/app/components/RankingCard';
import AwardPodium from '@/app/components/AwardPodium';

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

const dataOptionList = [
  {
    value: "default",
    label: "Default",
  },
  ...Array.from({ length: 52 }, (v, i) => ({
    value: `week${i + 1}`,
    label: `Week ${i + 1}`,
  })),
];

const SalesTeamPage = ({ params }) => {
  const [bookedDemsData, setBookedDemsData] = useState(null);
  const [bookedMDSData, setBookedMDSData] = useState(null);
  const [satDemsData, setSatDemsData] = useState(null);
  const [satMDSData, setSatMDSData] = useState(null);
  const [salesSDRData, setSalesSDRData] = useState([]);

  const [sortedBookedDemsData, setSortedBookedDemsData] = useState(null);
  const [sortedBookedMDSData, setSortedBookedMDSData] = useState(null);
  const [sortedSatDemsData, setSortedSatDemsData] = useState(null);
  const [sortedSatMDSData, setSortedSatMDSData] = useState(null);
  const [sortedSalesSDRData, setSortedSalesSDRData] = useState([]);

  // Helper function to create a deep copy of the array and sort it
  const sortData = (dataArray, currentWeekNumber, isCurrency = false) => {
    return [...dataArray].sort((a, b) => {
      const aValue = isCurrency
        ? parseFloat(a.sales[currentWeekNumber - 1].substring(1).replace(/,/g, ''))
        : Number(a.sales[currentWeekNumber - 1]);
      const bValue = isCurrency
        ? parseFloat(b.sales[currentWeekNumber - 1].substring(1).replace(/,/g, ''))
        : Number(b.sales[currentWeekNumber - 1]);

      return bValue - aValue;
    });
  };


  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const { currentWeekNumber, currentYear } = getCurrentWeekAndYear();
  const [timePeriod, setTimePeriod] = useState(currentWeekNumber);

  useEffect(() => {
    const fetchsalesTeamData = async () => {
      try {
        const [team] = params.slug.split('_');
        const response = await fetch(`/api/getSheetDataByTeam?team=${team}`);
        const data = await response.json();

        setBookedDemsData(sortData(data.bookedDemsData, currentWeekNumber));
        setBookedMDSData(sortData(data.bookedMDSData, currentWeekNumber));
        setSatDemsData(sortData(data.satDemsData, currentWeekNumber));
        setSatMDSData(sortData(data.satMDSData, currentWeekNumber));
        setSalesSDRData(sortData(data.salesSDRData, currentWeekNumber, true));

        setSortedBookedDemsData(sortData(data.bookedDemsData, currentWeekNumber));
        setSortedBookedMDSData(sortData(data.bookedMDSData, currentWeekNumber));
        setSortedSatDemsData(sortData(data.satDemsData, currentWeekNumber));
        setSortedSatMDSData(sortData(data.satMDSData, currentWeekNumber));
        setSortedSalesSDRData(sortData(data.salesSDRData, currentWeekNumber, true));

        setLoading(false);
      } catch (error) {
        console.error("Error fetching sales info:", error);
      }
    };

    fetchsalesTeamData();
  }, [params.slug]);

  return (
    <div className="min-h-screen mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
      <ButtonWithLink href="/" className="!bg-black hover:!bg-gray-700 text-md px-4 py-2 mb-2">Home</ButtonWithLink>
      <Tabs defaultValue="bookedDems" className="w-full">
        <div className='flex flex-col gap-2'>
          <div className='flex flex-wrap justify-between gap-2'>
            <TabsList>
              <TabsTrigger value="bookedDems">Booked Dems</TabsTrigger>
              <TabsTrigger value="bookedMDS">Booked MDS</TabsTrigger>
              <TabsTrigger value="satDems">Sat Dems</TabsTrigger>
              <TabsTrigger value="satMDS">Sat MDS</TabsTrigger>
              <TabsTrigger value="salesSDR">Sales</TabsTrigger>
            </TabsList>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="default"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between"
                >
                  {value
                    ? dataOptionList.find((dataOptionItem) => dataOptionItem.value === value)?.label
                    : "Filter Data..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search Options..." />
                  <CommandList>
                    <CommandEmpty>No option found.</CommandEmpty>
                    <CommandGroup className="max-h-[200px] overflow-y-auto">
                      {dataOptionList.map((dataOptionItem) => (
                        <CommandItem
                          key={dataOptionItem.value}
                          value={dataOptionItem.value}
                          onSelect={(currentValue) => {
                            setValue(currentValue === value ? "" : currentValue)
                            setOpen(false)

                            const newValue = currentValue.replace(/week/g, "");
                            console.log("Week selected: ", newValue)
                            const weekNumber = currentValue === 'default' ? currentWeekNumber : newValue;
                            setTimePeriod(weekNumber)

                            setSortedBookedDemsData(sortData(bookedDemsData, weekNumber));
                            setSortedBookedMDSData(sortData(bookedMDSData, weekNumber));
                            setSortedSatDemsData(sortData(satDemsData, weekNumber));
                            setSortedSatMDSData(sortData(satMDSData, weekNumber));
                            setSortedSalesSDRData(sortData(salesSDRData, weekNumber, true));
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === dataOptionItem.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {dataOptionItem.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          {bookedDemsData && (<div>
            <h1 className="text-2xl text-black font-bold text-center">{bookedDemsData[0] && bookedDemsData[0].team}</h1>
            <p className='text-black text-center mb-6'>{timePeriod && getWeekRange(timePeriod, currentYear)}</p>
          </div>)}
        </div>
        <TabsContent value="bookedDems" className="w-full">
          <h1 className="text-2xl text-black font-bold text-center mb-6">Booked Dems</h1>
          {loading && (<div className="flex justify-center w-full">
            <Loading />
          </div>)}
          {sortedBookedDemsData && (
            <div className='flex flex-wrap flex-col md:flex-row'>
              <AwardPodium first={sortedBookedDemsData[0]} second={sortedBookedDemsData[1]} third={sortedBookedDemsData[2]} currentWeekNumber={timePeriod} className='md:flex-1 w-full md:min-w-[500px]' />
              <div className='md:flex-[2_2_0%] grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4'>
                {sortedBookedDemsData.map((info, index) => {
                  if (index >= 3) {
                    return (
                      <RankingCard key={index} info={info} index={index} currentWeekNumber={timePeriod} />
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="bookedMDS">
          <h1 className="text-2xl text-black font-bold text-center mb-6">Booked MDS</h1>
          {loading && (<div className="flex justify-center w-full">
            <Loading />
          </div>)}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full'>
            {bookedMDSData && bookedMDSData.sort((a, b) => Number(b.sales[timePeriod - 1]) - Number(a.sales[timePeriod - 1])).map((info, index) => (
              <RankingCard key={index} info={info} index={index} currentWeekNumber={timePeriod} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="satDems">
          <h1 className="text-2xl text-black font-bold text-center mb-6">Sat Dems</h1>
          {loading && (<div className="flex justify-center w-full">
            <Loading />
          </div>)}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full'>
            {satDemsData && satDemsData.sort((a, b) => Number(b.sales[timePeriod - 1]) - Number(a.sales[timePeriod - 1])).map((info, index) => (
              <RankingCard key={index} info={info} index={index} currentWeekNumber={timePeriod} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="satMDS">
          <h1 className="text-2xl text-black font-bold text-center mb-6">Sat MDS</h1>
          {loading && (<div className="flex justify-center w-full">
            <Loading />
          </div>)}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full'>
            {satMDSData && satMDSData.sort((a, b) => Number(b.sales[timePeriod - 1]) - Number(a.sales[timePeriod - 1])).map((info, index) => (
              <RankingCard key={index} info={info} index={index} currentWeekNumber={timePeriod} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="salesSDR">
          <h1 className="text-2xl text-black font-bold text-center mb-6">Sales</h1>
          {loading && (<div className="flex justify-center w-full">
            <Loading />
          </div>)}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full'>
            {salesSDRData && salesSDRData.sort((a, b) => b.sales[timePeriod - 1].substring(1).replace(/,/g, '') - a.sales[timePeriod - 1].substring(1).replace(/,/g, '')).map((info, index) => (
              <RankingCard key={index} info={info} index={index} currentWeekNumber={timePeriod} isCurrency={true} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesTeamPage;
