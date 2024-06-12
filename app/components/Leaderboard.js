"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getWeekRange, getCurrentWeekAndYear } from '../_utils/index'
import Loading from './Loading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RankingCard from './RankingCard';

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

const Leaderboard = () => {
  const [bookedDemsData, setBookedDemsData] = useState([]);
  const [bookedMDSData, setBookedMDSData] = useState([]);
  const [satDemsData, setSatDemsData] = useState([]);
  const [satMDSData, setSatMDSData] = useState([]);
  const [salesSDRData, setSalesSDRData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const { currentWeekNumber, currentYear } = getCurrentWeekAndYear();
  const [timePeriod, setTimePeriod] = useState(currentWeekNumber);


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
      <h1 className='text-black text-center mb-2'>{timePeriod && getWeekRange(timePeriod, currentYear)}</h1>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
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
                      setTimePeriod(currentValue === 'default' ? currentWeekNumber : currentValue.replace(/week/g, ""))
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
            {bookedDemsData && bookedDemsData.sort((a, b) => b.sales[timePeriod - 1] - a.sales[timePeriod - 1]).map((info, index) => (
              <RankingCard key={index} info={info} index={index} currentWeekNumber={timePeriod} isShowTeam={true} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="bookedMDS">
          <h1 className="text-2xl text-black font-bold text-center mb-6">Booked MDS</h1>
          {loading && (<div className="flex justify-center w-full">
            <Loading />
          </div>)}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full'>
            {bookedMDSData && bookedMDSData.sort((a, b) => b.sales[timePeriod - 1] - a.sales[timePeriod - 1]).map((info, index) => (
              <RankingCard key={index} info={info} index={index} currentWeekNumber={timePeriod} isShowTeam={true} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="satDems">
          <h1 className="text-2xl text-black font-bold text-center mb-6">Sat Dems</h1>
          {loading && (<div className="flex justify-center w-full">
            <Loading />
          </div>)}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full'>
            {satDemsData && satDemsData.sort((a, b) => b.sales[timePeriod - 1] - a.sales[timePeriod - 1]).map((info, index) => (
              <RankingCard key={index} info={info} index={index} currentWeekNumber={timePeriod} isShowTeam={true} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="satMDS">
          <h1 className="text-2xl text-black font-bold text-center mb-6">Sat MDS</h1>
          {loading && (<div className="flex justify-center w-full">
            <Loading />
          </div>)}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full'>
            {satMDSData && satMDSData.sort((a, b) => b.sales[timePeriod - 1] - a.sales[timePeriod - 1]).map((info, index) => (
              <RankingCard key={index} info={info} index={index} currentWeekNumber={timePeriod} isShowTeam={true} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="salesSDR">
          <h1 className="text-2xl text-black font-bold text-center mb-6">Sales</h1>
          {loading && (<div className="flex justify-center w-full">
            <Loading />
          </div>)}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full'>
            {salesSDRData && salesSDRData.sort((a, b) => b.sales[timePeriod - 1] - a.sales[timePeriod - 1]).map((info, index) => (
              <RankingCard key={index} info={info} index={index} currentWeekNumber={timePeriod} isShowTeam={true} isCurrency={true} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Leaderboard;
