"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Leaderboard = () => {
  const [salesInfo, setSalesInfo] = useState([]);

  useEffect(() => {
    const fetchSalesInfo = async () => {
      try {
        const response = await fetch('/api/getSheetDataByTotal');
        const data = await response.json();
        setSalesInfo(data.salesInfo);
      } catch (error) {
        console.error("Error fetching sales info:", error);
      }
    };

    fetchSalesInfo();
  }, []);

  return (
    <div className="leaderboard-container max-w-4xl mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl text-black font-bold text-center mb-6">Sales Leaderboard by Total</h1>
      {salesInfo && salesInfo.map((info, index) => (
        <Link 
          key={index} 
          href={`/sales-person/${info.name.toLowerCase().replace(/\s/g, "_")}`}
          passHref
        >
          <div 
            className="item-container flex justify-between items-center p-4 bg-white mb-4 rounded-lg shadow-md hover:bg-gray-50 cursor-pointer"
          >
            <div className="left-side-container flex items-center">
              <div className="ranking-container text-lg font-bold text-gray-700 mr-4">
                Rank {index + 1}
              </div>
              <div className="person-image-container flex items-center">
                <div className="image-container w-12 h-12 rounded-full overflow-hidden mr-4">
                  {/* <img 
                    src={`http://localhost/test-wp/wp-content/uploads/2024/05/${info.name.toLowerCase().replace(/\s/g, "_")}.webp`} 
                    alt={info.name} 
                    className="w-full h-full object-cover" 
                  /> */}
                </div>
                <p className="sales-person-name text-gray-700">{info.name}</p>
              </div>
            </div>
            <div className="booking-number text-xl font-semibold text-blue-600">
              {info.total}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Leaderboard;
