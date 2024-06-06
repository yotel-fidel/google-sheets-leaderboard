"use client"

import React, { useState, useEffect } from 'react';
import { useSheetData } from '../../context/SheetDataContext';

const SalesPersonPage = ({ params }) => {
  const [salesPersonData, setSalesPersonData] = useState(null);
  const sheetData = useSheetData();

  useEffect(() => {
    const fetchSalesInfo = async () => {
      try {
        const response = await fetch('/api/getSheetDataByTotal');
        const data = await response.json();
        // Find the row corresponding to the provided slug
        const [firstName, lastName] = params.slug.split('_');
        const foundRow = data.salesInfo.find(row => row.name.toLowerCase().includes(`${firstName} ${lastName}`));
        setSalesPersonData(foundRow);
      } catch (error) {
        console.error("Error fetching sales info:", error);
      }
    };

    fetchSalesInfo();
  }, [params.slug]);

  // Render the component based on the found data
  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl text-black font-bold text-center mb-6">{salesPersonData ? salesPersonData.name : 'Sales Person'}</h1>
      {salesPersonData && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">Team: {salesPersonData.team}</h2>
          <table className="min-w-full mt-4 text-black">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left">Week</th>
                <th className="px-6 py-3 text-left">Sales</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 52 }, (_, index) => index).map((week, index) => (
                <tr key={index} className={(index + 1) % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-6 py-4 whitespace-nowrap">Week {week + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{salesPersonData.sales[`${week}`]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 text-xl font-semibold text-blue-600">
            Total Sales: {salesPersonData.total}
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesPersonPage;
