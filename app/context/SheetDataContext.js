"use client"
import { createContext, useContext, useState, useEffect } from 'react';

const SheetDataContext = createContext();

export const SheetDataProvider = ({ children }) => {
  const [data, setData] = useState({ salesInfo: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getSheetData');
        const newData = await response.json();
        console.log("Fetched data:", newData); // Add this line
        setData(newData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);

  return (
    <SheetDataContext.Provider value={data}>
      {children}
    </SheetDataContext.Provider>
  );
};

export const useSheetData = () => useContext(SheetDataContext);
