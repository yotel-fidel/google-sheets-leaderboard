"use client";

import React from 'react';
import { useSheetData } from '../context/SheetDataContext';

const SalesInfo = () => {
    const sheetData = useSheetData();
    // console.log("SalesInfo: ", sheetData);

    // Extract sales info using extractData function
    const { salesInfo } = extractData(sheetData);

    return (
        <div className="sales-info">
            <h1>Sales Info</h1>
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
                    {salesInfo && salesInfo.map((info, index) => (
                        <tr key={index}>
                            <td>{info.name}</td>
                            <td>{info.team}</td>
                            {info.sales.map((salesData, salesIndex) => (
                                <td key={salesIndex}>{salesData}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SalesInfo;



const extractData = (data) => {
    let salesBookedDemsStart, salesBookedDemsEnd;
    let salesBookedDems = [];

    let i = 0;
    while (i < data.length) { // Add a condition to prevent accessing undefined elements
        if (data[i][0] === "END") break;

        if (data[i][0] === "Booked Dems Start") {
          salesBookedDemsStart = i + 2;
        }
    
        if (data[i][0] === "Booked Dems End") {
          salesBookedDemsEnd = i - 1;
        }
        i++;
    }

    let start = salesBookedDemsStart;
    let end = salesBookedDemsEnd;
    for (; start <= end && start < data.length; start++) { // Add a condition to prevent accessing undefined elements
        // Assuming that data structure is [Name, Category, Monday, Tuesday, Wednesday, Thursday, Friday]
        const [name, profileImg, team, ...salesData] = data[start];
        salesBookedDems.push({
            name,
            team,
            profileImg,
            sales: salesData,
        });
    }

    return { salesBookedDems };
};
