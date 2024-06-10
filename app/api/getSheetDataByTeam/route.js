// File: pages/api/getSheetDataByTeam.js
import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getCurrentWeekAndYear } from '@/app/_utils';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const teamParam = searchParams.get('team'); // Get the team query parameter
  const { currentYear } = getCurrentWeekAndYear();

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth: await auth.getClient() });
  const range = `${currentYear}!A:BC`;

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: range,
    });
    const data = response.data.values;
    const filteredData = extractAndFilterData(data, teamParam);

    // Sort by Total in descending order
    const sortedBookedDemsData = filteredData.salesBookedDems.sort((a, b) => b.total - a.total);
    const sortedBookedMDSData = filteredData.salesBookedMDS.sort((a, b) => b.total - a.total);
    const sortedSatDemsData = filteredData.salesSatDems.sort((a, b) => b.total - a.total);
    const sortedSatMDSData = filteredData.salesSatMDS.sort((a, b) => b.total - a.total);

    return NextResponse.json({
      bookedDemsData: sortedBookedDemsData,
      bookedMDSData: sortedBookedMDSData,
      satDemsData: sortedSatDemsData,
      satMDSData: sortedSatMDSData,
    });
  } catch (error) {
    console.error("Error fetching sheets data: ", error);
    return NextResponse.json({ error: 'Error fetching sheets data' }, { status: 500 });
  }
}

const extractAndFilterData = (data, teamParam) => {
  let salesBookedDemsStart, salesBookedDemsEnd;
  let salesBookedMDSStart, salesBookedMDSEnd;
  let salesSatDemsStart, salesSatDemsEnd;
  let salesSatMDSStart, salesSatMDSEnd;
  let salesBookedDems = [];
  let salesBookedMDS = [];
  let salesSatDems = [];
  let salesSatMDS = [];

  let i = 0;
  while (i < data.length) {
    if (data[i][0] === "END") break;

    if (data[i][0] === "Booked Dems Start") {
      salesBookedDemsStart = i + 2;
    }

    if (data[i][0] === "Booked Dems End") {
      salesBookedDemsEnd = i - 1;
    }

    if (data[i][0] === "Booked MDS Start") {
      salesBookedMDSStart = i + 2;
    }

    if (data[i][0] === "Booked MDS End") {
      salesBookedMDSEnd = i - 1;
    }

    if (data[i][0] === "Sat Dems Start") {
      salesSatDemsStart = i + 2;
    }

    if (data[i][0] === "Sat Dems End") {
      salesSatDemsEnd = i - 1;
    }

    if (data[i][0] === "Sat MDS Start") {
      salesSatMDSStart = i + 2;
    }

    if (data[i][0] === "Sat MDS End") {
      salesSatMDSEnd = i - 1;
    }
    i++;
  }

  let start = salesBookedDemsStart;
  let end = salesBookedDemsEnd;
  for (; start <= end && start < data.length; start++) {
    const [name, profileImg, team, ...salesData] = data[start];
    const total = salesData.reduce((sum, weekSales) => sum + Number(weekSales), 0);
    if (!teamParam || team.toLowerCase() === teamParam.toLowerCase()) { // Filter by team if specified
      salesBookedDems.push({
        name,
        profileImg,
        team,
        sales: salesData,
        total
      });
    }
  }

  start = salesBookedMDSStart;
  end = salesBookedMDSEnd;
  for (; start <= end && start < data.length; start++) {
    const [name, profileImg, team, ...salesData] = data[start];
    const total = salesData.reduce((sum, weekSales) => sum + Number(weekSales), 0);
    if (!teamParam || team.toLowerCase() === teamParam.toLowerCase()) { // Filter by team if specified
      salesBookedMDS.push({
        name,
        profileImg,
        team,
        sales: salesData,
        total
      });
    }
  }

  start = salesSatDemsStart;
  end = salesSatDemsEnd;
  for (; start <= end && start < data.length; start++) {
    const [name, profileImg, team, ...salesData] = data[start];
    const total = salesData.reduce((sum, weekSales) => sum + Number(weekSales), 0);
    if (!teamParam || team.toLowerCase() === teamParam.toLowerCase()) { // Filter by team if specified
      salesSatDems.push({
        name,
        profileImg,
        team,
        sales: salesData,
        total
      });
    }
  }

  start = salesSatMDSStart;
  end = salesSatMDSEnd;
  for (; start <= end && start < data.length; start++) {
    const [name, profileImg, team, ...salesData] = data[start];
    const total = salesData.reduce((sum, weekSales) => sum + Number(weekSales), 0);
    if (!teamParam || team.toLowerCase() === teamParam.toLowerCase()) { // Filter by team if specified
      salesSatMDS.push({
        name,
        profileImg,
        team,
        sales: salesData,
        total
      });
    }
  }

  return { salesBookedDems, salesBookedMDS, salesSatDems, salesSatMDS };
};
