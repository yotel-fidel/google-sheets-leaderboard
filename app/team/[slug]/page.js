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
import { getWeekRange, getCurrentWeekAndYear, parsePeriodString, getDateRange } from '@/app/_utils'
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
import { PERIOD_LIST } from '@/lib/constants';

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
  ...[
    { value: "january1", label: "January" },
    { value: "february2", label: "February" },
    { value: "march3", label: "March" },
    { value: "april4", label: "April" },
    { value: "may5", label: "May" },
    { value: "june6", label: "June" },
    { value: "july7", label: "July" },
    { value: "august8", label: "August" },
    { value: "september9", label: "September" },
    { value: "october10", label: "October" },
    { value: "november11", label: "November" },
    { value: "december12", label: "December" }
  ]
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
  const sortData = (dataArray, period, periodNumber, isCurrency = false) => {
    return [...dataArray].sort((a, b) => {
      let aValue, bValue;

      if (period.toLowerCase().startsWith(PERIOD_LIST.WEEKLY.toLowerCase())) {
        const weekIndex = periodNumber - 1;
        aValue = isCurrency
          ? parseFloat(a.weekly[weekIndex].substring(1).replace(/,/g, ''))
          : Number(a.weekly[weekIndex]);
        bValue = isCurrency
          ? parseFloat(b.weekly[weekIndex].substring(1).replace(/,/g, ''))
          : Number(b.weekly[weekIndex]);
      } else {
        // NO MINUS 1 (like in weekIndex) AS IT IS CALLING AN OBJECT
        const month = periodNumber;
        // console.log("MONTH: ", month)
        // console.log("DATA a & b: ", Number(a.monthly[month]), Number(b.monthly[month]))
        aValue = isCurrency
          ? parseFloat(a.monthly[month].substring(1).replace(/,/g, ''))
          : Number(a.monthly[month]);
        bValue = isCurrency
          ? parseFloat(b.monthly[month].substring(1).replace(/,/g, ''))
          : Number(b.monthly[month]);
      }

      return bValue - aValue;
    });
  };


  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  const { currentWeekNumber, currentYear } = getCurrentWeekAndYear();
  const [timePeriod, setTimePeriod] = useState({
    period: PERIOD_LIST.WEEKLY.toLowerCase(),
    number: currentWeekNumber
  });

  useEffect(() => {
    const fetchsalesTeamData = async () => {
      try {
        const [team] = params.slug.split('_');
        const response = await fetch(`/api/getSheetDataByTeam?team=${team}`);
        const data = await response.json();

        setBookedDemsData(sortData(data.bookedDemsData, PERIOD_LIST.WEEKLY, currentWeekNumber));
        setBookedMDSData(sortData(data.bookedMDSData, PERIOD_LIST.WEEKLY, currentWeekNumber));
        setSatDemsData(sortData(data.satDemsData, PERIOD_LIST.WEEKLY, currentWeekNumber));
        setSatMDSData(sortData(data.satMDSData, PERIOD_LIST.WEEKLY, currentWeekNumber));
        setSalesSDRData(sortData(data.salesSDRData, PERIOD_LIST.WEEKLY, currentWeekNumber, true));

        setSortedBookedDemsData(sortData(data.bookedDemsData, PERIOD_LIST.WEEKLY, currentWeekNumber));
        setSortedBookedMDSData(sortData(data.bookedMDSData, PERIOD_LIST.WEEKLY, currentWeekNumber));
        setSortedSatDemsData(sortData(data.satDemsData, PERIOD_LIST.WEEKLY, currentWeekNumber));
        setSortedSatMDSData(sortData(data.satMDSData, PERIOD_LIST.WEEKLY, currentWeekNumber));
        setSortedSalesSDRData(sortData(data.salesSDRData, PERIOD_LIST.WEEKLY, currentWeekNumber, true));

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

                            // const newValue = currentValue.replace(/week/g, "");
                            const defaultValue = `${PERIOD_LIST.WEEKLY.toLowerCase().replace(/ly/g, "")}${currentWeekNumber}`
                            const newValue = parsePeriodString((currentValue === 'default' || currentValue === value) ? defaultValue : currentValue);

                            // console.log("Week selected: ", newValue.number)
                            const periodNumber = (currentValue === 'default' || currentValue === value) ? currentWeekNumber : newValue.number;
                            setTimePeriod(newValue)

                            // console.log("testingg currentValue: ", currentValue)
                            // console.log("CurrentValue: ", currentValue, "|| Value: ", value)
                            // console.log("Before setting sortedbookedDems: ", newValue.period)
                            // console.log("Period number: ", newValue.number)

                            setSortedBookedDemsData(sortData(bookedDemsData, newValue.period, periodNumber));
                            setSortedBookedMDSData(sortData(bookedMDSData, newValue.period, periodNumber));
                            setSortedSatDemsData(sortData(satDemsData, newValue.period, periodNumber));
                            setSortedSatMDSData(sortData(satMDSData, newValue.period, periodNumber));
                            setSortedSalesSDRData(sortData(salesSDRData, newValue.period, periodNumber, true));
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
            <p className='text-black text-center mb-6'>{timePeriod && getDateRange(timePeriod.period, timePeriod.number, currentYear)}</p>
          </div>)}
        </div>
        <TabsContent value="bookedDems" className="w-full">
          <h1 className="text-2xl text-black font-bold text-center mb-6">Booked Dems</h1>
          {loading && (<div className="flex justify-center w-full">
            <Loading />
          </div>)}
          {sortedBookedDemsData && (
            <div className='flex flex-wrap flex-col lg:flex-row lg:items-center'>
              <AwardPodium first={sortedBookedDemsData[0]} second={sortedBookedDemsData[1]} third={sortedBookedDemsData[2]} periodObject={timePeriod} className='self-center lg:self-start md:flex-1 w-full md:min-w-[500px]' />
              <div className='md:flex-[2_2_0%] grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4'>
                {sortedBookedDemsData.map((info, index) => {
                  if (index >= 3) {
                    return (
                      <RankingCard key={index} info={info} index={index} periodObject={timePeriod} />
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
          {sortedBookedMDSData && (
            <div className='flex flex-wrap flex-col lg:flex-row lg:items-center'>
              <AwardPodium first={sortedBookedMDSData[0]} second={sortedBookedMDSData[1]} third={sortedBookedMDSData[2]} periodObject={timePeriod} className='self-center lg:self-start md:flex-1 w-full md:min-w-[500px]' />
              <div className='md:flex-[2_2_0%] grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4'>
                {sortedBookedMDSData.map((info, index) => {
                  if (index >= 3) {
                    return (
                      <RankingCard key={index} info={info} index={index} periodObject={timePeriod} />
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="satDems">
          <h1 className="text-2xl text-black font-bold text-center mb-6">Sat Dems</h1>
          {loading && (<div className="flex justify-center w-full">
            <Loading />
          </div>)}
          {sortedSatDemsData && (
            <div className='flex flex-wrap flex-col lg:flex-row lg:items-center'>
              <AwardPodium first={sortedSatDemsData[0]} second={sortedSatDemsData[1]} third={sortedSatDemsData[2]} periodObject={timePeriod} className='self-center lg:self-start md:flex-1 w-full md:min-w-[500px]' />
              <div className='md:flex-[2_2_0%] grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4'>
                {sortedSatDemsData.map((info, index) => {
                  if (index >= 3) {
                    return (
                      <RankingCard key={index} info={info} index={index} periodObject={timePeriod} />
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="satMDS">
          <h1 className="text-2xl text-black font-bold text-center mb-6">Sat MDS</h1>
          {loading && (<div className="flex justify-center w-full">
            <Loading />
          </div>)}
          {sortedSatMDSData && (
            <div className='flex flex-wrap flex-col lg:flex-row lg:items-center'>
              <AwardPodium first={sortedSatMDSData[0]} second={sortedSatMDSData[1]} third={sortedSatMDSData[2]} periodObject={timePeriod} className='self-center lg:self-start md:flex-1 w-full md:min-w-[500px]' />
              <div className='md:flex-[2_2_0%] grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4'>
                {sortedSatMDSData.map((info, index) => {
                  if (index >= 3) {
                    return (
                      <RankingCard key={index} info={info} index={index} periodObject={timePeriod} />
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="salesSDR">
          <h1 className="text-2xl text-black font-bold text-center mb-6">Sales</h1>
          {loading && (<div className="flex justify-center w-full">
            <Loading />
          </div>)}
          {sortedSalesSDRData && (
            <div className='flex flex-wrap flex-col lg:flex-row lg:items-center'>
              <AwardPodium first={sortedSalesSDRData[0]} second={sortedSalesSDRData[1]} third={sortedSalesSDRData[2]} isCurrency={true} periodObject={timePeriod} className='self-center lg:self-start md:flex-1 w-full md:min-w-[500px]' />
              <div className='md:flex-[2_2_0%] grid grid-cols-1 xl:grid-cols-2 gap-4'>
                {sortedSalesSDRData.map((info, index) => {
                  if (index >= 3) {
                    return (
                      <RankingCard key={index} info={info} index={index} periodObject={timePeriod} />
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesTeamPage;
