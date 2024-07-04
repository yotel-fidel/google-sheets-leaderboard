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
import { getWeekRange, getTotalCurrencyOrScore, sortDataBasedOnPeriod, getCurrentWeekAndYear, parsePeriodString, getDateRange } from '@/app/_utils'
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
import { PERIOD_LIST, DATA_OPTION_LIST } from '@/lib/constants';
import TotalScoreOrCurrencyCard from '@/app/components/TotalScoreOrCurrencyCard';

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
  const [salesSDRData, setSalesSDRData] = useState(null);
  const [targetSalesSDRData, setTargetSalesSDRData] = useState(null);

  const [sortedBookedDemsData, setSortedBookedDemsData] = useState(null);
  const [sortedBookedMDSData, setSortedBookedMDSData] = useState(null);
  const [sortedSatDemsData, setSortedSatDemsData] = useState(null);
  const [sortedSatMDSData, setSortedSatMDSData] = useState(null);
  const [sortedSalesSDRData, setSortedSalesSDRData] = useState(null);

  const [totalData, setTotalData] = useState(null);

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

        setBookedDemsData(sortDataBasedOnPeriod(data.bookedDemsData, PERIOD_LIST.WEEKLY, currentWeekNumber));
        setBookedMDSData(sortDataBasedOnPeriod(data.bookedMDSData, PERIOD_LIST.WEEKLY, currentWeekNumber));
        setSatDemsData(sortDataBasedOnPeriod(data.satDemsData, PERIOD_LIST.WEEKLY, currentWeekNumber));
        setSatMDSData(sortDataBasedOnPeriod(data.satMDSData, PERIOD_LIST.WEEKLY, currentWeekNumber));
        setSalesSDRData(sortDataBasedOnPeriod(data.salesSDRData, PERIOD_LIST.WEEKLY, currentWeekNumber, true));
        setTargetSalesSDRData(sortDataBasedOnPeriod(data.targetSalesSDRData, PERIOD_LIST.WEEKLY, currentWeekNumber, true));

        setSortedBookedDemsData(sortDataBasedOnPeriod(data.bookedDemsData, PERIOD_LIST.WEEKLY, currentWeekNumber));
        setSortedBookedMDSData(sortDataBasedOnPeriod(data.bookedMDSData, PERIOD_LIST.WEEKLY, currentWeekNumber));
        setSortedSatDemsData(sortDataBasedOnPeriod(data.satDemsData, PERIOD_LIST.WEEKLY, currentWeekNumber));
        setSortedSatMDSData(sortDataBasedOnPeriod(data.satMDSData, PERIOD_LIST.WEEKLY, currentWeekNumber));
        setSortedSalesSDRData(sortDataBasedOnPeriod(data.salesSDRData, PERIOD_LIST.WEEKLY, currentWeekNumber, true));

        setTotalData(data.total)

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
                    ? DATA_OPTION_LIST.find((dataOptionItem) => dataOptionItem.value === value)?.label
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
                      {bookedDemsData && DATA_OPTION_LIST.map((dataOptionItem) => (
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

                            setSortedBookedDemsData(sortDataBasedOnPeriod(bookedDemsData, newValue.period, periodNumber));
                            setSortedBookedMDSData(sortDataBasedOnPeriod(bookedMDSData, newValue.period, periodNumber));
                            setSortedSatDemsData(sortDataBasedOnPeriod(satDemsData, newValue.period, periodNumber));
                            setSortedSatMDSData(sortDataBasedOnPeriod(satMDSData, newValue.period, periodNumber));
                            setSortedSalesSDRData(sortDataBasedOnPeriod(salesSDRData, newValue.period, periodNumber, true));
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

        </div>
        <TabsContent value="bookedDems" className="w-full">
          <div className='flex flex-col sm:flex-row flex-wrap justify-between gap-2 bg-[#9e0000] rounded-sm p-2 my-2'>
            <div>
              <h2 className="text-2xl text-white font-bold">Booked Dems</h2>
              {totalData && <TotalScoreOrCurrencyCard data={totalData.salesBookedDems} timePeriod={timePeriod} isCurrency={false} className="!p-0" />}
            </div>
            <div>
              <h2 className="text-2xl text-white font-bold text-left sm:text-right">{bookedDemsData && bookedDemsData[0] && bookedDemsData[0].team}</h2>
              <h2 className='text-white'>{timePeriod && getDateRange(timePeriod.period, timePeriod.number, currentYear)}</h2>
            </div>
          </div>
          {loading && (<div className="flex justify-center w-full">
            <Loading />
          </div>)}
          {sortedBookedDemsData && (
            <div className='flex flex-wrap flex-col lg:flex-row lg:items-center'>
              <div className='self-center lg:self-start'>
                <AwardPodium first={sortedBookedDemsData[0]} second={sortedBookedDemsData[1]} third={sortedBookedDemsData[2]} periodObject={timePeriod} className='md:flex-1 w-full md:min-w-[500px]' />
              </div>
              <div className='self-center lg:self-start md:flex-[2_2_0%] grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4'>
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
          <div className='flex flex-col sm:flex-row flex-wrap justify-between gap-2 bg-[#9e0000] rounded-sm p-2 my-2'>
            <div>
              <h2 className="text-2xl text-white font-bold">Booked MDS</h2>
              {totalData && <TotalScoreOrCurrencyCard data={totalData.salesBookedMDS} timePeriod={timePeriod} isCurrency={false} className="!p-0" />}
            </div>
            <div>
              <h2 className="text-2xl text-white font-bold text-left sm:text-right">{bookedDemsData && bookedDemsData[0] && bookedDemsData[0].team}</h2>
              <h2 className='text-white'>{timePeriod && getDateRange(timePeriod.period, timePeriod.number, currentYear)}</h2>
            </div>
          </div>
          {loading && (<div className="flex justify-center w-full">
            <Loading />
          </div>)}
          {sortedBookedMDSData && (
            <div className='flex flex-wrap flex-col lg:flex-row lg:items-center'>
              <div className='self-center lg:self-start'>
                <AwardPodium first={sortedBookedMDSData[0]} second={sortedBookedMDSData[1]} third={sortedBookedMDSData[2]} periodObject={timePeriod} className='md:flex-1 w-full md:min-w-[500px]' />
              </div>
              <div className='self-center lg:self-start md:flex-[2_2_0%] grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4'>
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
          <div className='flex flex-col sm:flex-row flex-wrap justify-between gap-2 bg-[#9e0000] rounded-sm p-2 my-2'>
            <div>
              <h2 className="text-2xl text-white font-bold">Sat Dems</h2>
              {totalData && <TotalScoreOrCurrencyCard data={totalData.salesSatDems} timePeriod={timePeriod} isCurrency={false} className="!p-0" />}
            </div>
            <div>
              <h2 className="text-2xl text-white font-bold text-left sm:text-right">{bookedDemsData && bookedDemsData[0] && bookedDemsData[0].team}</h2>
              <h2 className='text-white'>{timePeriod && getDateRange(timePeriod.period, timePeriod.number, currentYear)}</h2>
            </div>
          </div>
          {loading && (<div className="flex justify-center w-full">
            <Loading />
          </div>)}
          {sortedSatDemsData && (
            <div className='flex flex-wrap flex-col lg:flex-row lg:items-center'>
              <div className='self-center lg:self-start'>
                <AwardPodium first={sortedSatDemsData[0]} second={sortedSatDemsData[1]} third={sortedSatDemsData[2]} periodObject={timePeriod} className='md:flex-1 w-full md:min-w-[500px]' />
              </div>
              <div className='self-center lg:self-start md:flex-[2_2_0%] grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4'>
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
          <div className='flex flex-col sm:flex-row flex-wrap justify-between gap-2 bg-[#9e0000] rounded-sm p-2 my-2'>
            <div>
              <h2 className="text-2xl text-white font-bold">Sat MDS</h2>
              {totalData && <TotalScoreOrCurrencyCard data={totalData.salesSatMDS} timePeriod={timePeriod} isCurrency={false} className="!p-0" />}
            </div>
            <div>
              <h2 className="text-2xl text-white font-bold text-left sm:text-right">{bookedDemsData && bookedDemsData[0] && bookedDemsData[0].team}</h2>
              <h2 className='text-white'>{timePeriod && getDateRange(timePeriod.period, timePeriod.number, currentYear)}</h2>
            </div>
          </div>
          {loading && (<div className="flex justify-center w-full">
            <Loading />
          </div>)}
          {sortedSatMDSData && (
            <div className='flex flex-wrap flex-col lg:flex-row lg:items-center'>
              <div className='self-center lg:self-start'>
                <AwardPodium first={sortedSatMDSData[0]} second={sortedSatMDSData[1]} third={sortedSatMDSData[2]} periodObject={timePeriod} className='md:flex-1 w-full md:min-w-[500px]' />
              </div>
              <div className='self-center lg:self-start md:flex-[2_2_0%] grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4'>
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
          <div className='flex flex-col sm:flex-row flex-wrap justify-between gap-2 bg-[#9e0000] rounded-sm p-2 my-2'>
            <div>
              <h2 className="text-2xl text-white font-bold">Sales</h2>
              {totalData && <TotalScoreOrCurrencyCard data={totalData.salesSDR} timePeriod={timePeriod} isCurrency={true} className="!p-0" />}
            </div>
            <div>
              <h2 className="text-2xl text-white font-bold text-left sm:text-right">{bookedDemsData && bookedDemsData[0] && bookedDemsData[0].team}</h2>
              <h2 className='text-white'>{timePeriod && getDateRange(timePeriod.period, timePeriod.number, currentYear)}</h2>
            </div>
          </div>
          {loading && (<div className="flex justify-center w-full">
            <Loading />
          </div>)}
          {sortedSalesSDRData && (
            <div className='flex flex-wrap flex-col lg:flex-row lg:items-center'>
              <div className='self-center lg:self-start'>
                <AwardPodium first={sortedSalesSDRData[0]} second={sortedSalesSDRData[1]} third={sortedSalesSDRData[2]} isCurrency={true} periodObject={timePeriod} className='md:flex-1 w-full md:min-w-[500px]' />
                {(targetSalesSDRData && timePeriod.period !== PERIOD_LIST.WEEKLY.toLowerCase()) && (
                  <div className='md:p-2 flex flex-col gap-4 mb-[1rem] md:mb-0'>
                    <RankingCard info={sortedSalesSDRData[0]} targetSalesData={targetSalesSDRData} index={0} periodObject={timePeriod} isCurrency={true} />
                    <RankingCard info={sortedSalesSDRData[1]} targetSalesData={targetSalesSDRData} index={1} periodObject={timePeriod} isCurrency={true} />
                    <RankingCard info={sortedSalesSDRData[2]} targetSalesData={targetSalesSDRData} index={2} periodObject={timePeriod} isCurrency={true} />
                  </div>
                )}
              </div>
              <div className='w-full max-w-[500px] lg:max-w-none self-center lg:self-start md:flex-[2_2_0%] grid grid-cols-1 xl:grid-cols-2 gap-4'>
                {sortedSalesSDRData.map((info, index) => {
                  if (index >= 3) {
                    return (
                      <RankingCard key={index} info={info} targetSalesData={targetSalesSDRData} index={index} periodObject={timePeriod} isCurrency={true} />
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
