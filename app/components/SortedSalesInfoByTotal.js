"use client";

import React, { useState, useEffect } from 'react';

const SortedSalesInfoByTotal = () => {
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
    <div className="sales-info">
      <h1>Sales Info Sorted by Total</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Team</th>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {salesInfo.map((info, index) => (
            <tr key={index}>
              <td>{info.name}</td>
              <td>{info.team}</td>
              {info.sales.map((salesData, salesIndex) => (
                <td key={salesIndex}>{salesData}</td>
              ))}
              <td>{info.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SortedSalesInfoByTotal;
