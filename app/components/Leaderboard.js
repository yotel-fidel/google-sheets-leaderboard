"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getWeekRange, getDateRange, getCurrentWeekAndYear, sortDataBasedOnPeriod, parsePeriodString } from '@/app/_utils'
import Loading from './Loading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RankingCard from '@/app/components/RankingCard';
import AwardPodium from '@/app/components/AwardPodium';
import TotalScoreOrCurrencyCard from '@/app/components/TotalScoreOrCurrencyCard';
import { PERIOD_LIST, DATA_OPTION_LIST } from '@/lib/constants';

import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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

const Leaderboard = () => {
  const [bookedDemsData, setBookedDemsData] = useState(null);
  const [bookedMDSData, setBookedMDSData] = useState(null);
  const [satDemsData, setSatDemsData] = useState(null);
  const [satMDSData, setSatMDSData] = useState(null);
  const [salesSDRData, setSalesSDRData] = useState(null);

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
    const fetchSalesInfo = async () => {
      try {
        const response = await fetch('/api/getSheetDataByTotal');
        const data = await response.json();

        setBookedDemsData(sortDataBasedOnPeriod(data.bookedDemsData, PERIOD_LIST.WEEKLY, currentWeekNumber));
        setBookedMDSData(sortDataBasedOnPeriod(data.bookedMDSData, PERIOD_LIST.WEEKLY, currentWeekNumber));
        setSatDemsData(sortDataBasedOnPeriod(data.satDemsData, PERIOD_LIST.WEEKLY, currentWeekNumber));
        setSatMDSData(sortDataBasedOnPeriod(data.satMDSData, PERIOD_LIST.WEEKLY, currentWeekNumber));
        setSalesSDRData(sortDataBasedOnPeriod(data.salesSDRData, PERIOD_LIST.WEEKLY, currentWeekNumber, true));

        setSortedBookedDemsData(sortDataBasedOnPeriod(data.bookedDemsData, PERIOD_LIST.WEEKLY, currentWeekNumber));
        setSortedBookedMDSData(sortDataBasedOnPeriod(data.bookedMDSData, PERIOD_LIST.WEEKLY, currentWeekNumber));
        setSortedSatDemsData(sortDataBasedOnPeriod(data.satDemsData, PERIOD_LIST.WEEKLY, currentWeekNumber));
        setSortedSatMDSData(sortDataBasedOnPeriod(data.satMDSData, PERIOD_LIST.WEEKLY, currentWeekNumber));
        setSortedSalesSDRData(sortDataBasedOnPeriod(data.salesSDRData, PERIOD_LIST.WEEKLY, currentWeekNumber, true));

        setTotalData(data.total)

        setLoading(false);

        // console.log("Week number: ", timePeriod)
        // console.log("Year number: ", currentYear)
        // console.log("testing date: ", getWeekRange(timePeriod, currentYear))
      } catch (error) {
        console.error("Error fetching sales info:", error);
      }
    };

    fetchSalesInfo();
  }, []);

  return (
    <div className="leaderboard-container mx-auto p-4 min-h-screen bg-gray-100 rounded-lg shadow-lg">

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
          <h1 className='text-black text-center mb-2'>{timePeriod && getDateRange(timePeriod.period, timePeriod.number, currentYear)}</h1>

        </div>
        <TabsContent value="bookedDems" className="w-full">
          <h1 className="text-2xl text-black font-bold text-center mb-6">Booked Dems</h1>
          {loading && (<div className="flex justify-center w-full">
            <Loading />
          </div>)}
          {sortedBookedDemsData && (
            <div className='flex flex-wrap flex-col lg:flex-row lg:items-center'>
              <div className='self-center lg:self-start'>
                <AwardPodium first={sortedBookedDemsData[0]} second={sortedBookedDemsData[1]} third={sortedBookedDemsData[2]} periodObject={timePeriod} className='md:flex-1 w-full md:min-w-[500px]' />
                <TotalScoreOrCurrencyCard data={totalData.salesBookedDems} timePeriod={timePeriod} isCurrency={false} />
              </div>
              <div className='self-center lg:self-start md:flex-[2_2_0%] grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4'>
                {sortedBookedDemsData.map((info, index) => {
                  if (index >= 3) {
                    return (
                      <RankingCard key={index} info={info} index={index} isShowTeam={true} periodObject={timePeriod} />
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
              <div className='self-center lg:self-start'>
                <AwardPodium first={sortedBookedMDSData[0]} second={sortedBookedMDSData[1]} third={sortedBookedMDSData[2]} periodObject={timePeriod} className='md:flex-1 w-full md:min-w-[500px]' />
                <TotalScoreOrCurrencyCard data={totalData.salesBookedMDS} timePeriod={timePeriod} isCurrency={false} />
              </div>
              <div className='self-center lg:self-start md:flex-[2_2_0%] grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4'>
                {sortedBookedMDSData.map((info, index) => {
                  if (index >= 3) {
                    return (
                      <RankingCard key={index} info={info} index={index} isShowTeam={true} periodObject={timePeriod} />
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
              <div className='self-center lg:self-start'>
                <AwardPodium first={sortedSatDemsData[0]} second={sortedSatDemsData[1]} third={sortedSatDemsData[2]} periodObject={timePeriod} className='md:flex-1 w-full md:min-w-[500px]' />
                <TotalScoreOrCurrencyCard data={totalData.salesSatDems} timePeriod={timePeriod} isCurrency={false} />
              </div>
              <div className='self-center lg:self-start md:flex-[2_2_0%] grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4'>
                {sortedSatDemsData.map((info, index) => {
                  if (index >= 3) {
                    return (
                      <RankingCard key={index} info={info} index={index} isShowTeam={true} periodObject={timePeriod} />
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
              <div className='self-center lg:self-start'>
                <AwardPodium first={sortedSatMDSData[0]} second={sortedSatMDSData[1]} third={sortedSatMDSData[2]} periodObject={timePeriod} className='md:flex-1 w-full md:min-w-[500px]' />
                <TotalScoreOrCurrencyCard data={totalData.salesSatMDS} timePeriod={timePeriod} isCurrency={false} />
              </div>
              <div className='self-center lg:self-start md:flex-[2_2_0%] grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4'>
                {sortedSatMDSData.map((info, index) => {
                  if (index >= 3) {
                    return (
                      <RankingCard key={index} info={info} index={index} isShowTeam={true} periodObject={timePeriod} />
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
              <div className='self-center lg:self-start'>
                <AwardPodium first={sortedSalesSDRData[0]} second={sortedSalesSDRData[1]} third={sortedSalesSDRData[2]} isCurrency={true} periodObject={timePeriod} className='md:flex-1 w-full md:min-w-[500px]' />
                <TotalScoreOrCurrencyCard data={totalData.salesSDR} timePeriod={timePeriod} isCurrency={true} />
              </div>
              <div className='self-center lg:self-start md:flex-[2_2_0%] grid grid-cols-1 xl:grid-cols-2 gap-4'>
                {sortedSalesSDRData.map((info, index) => {
                  if (index >= 3) {
                    return (
                      <RankingCard key={index} info={info} index={index} isShowTeam={true} periodObject={timePeriod} isCurrency={true} />
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

export default Leaderboard;
