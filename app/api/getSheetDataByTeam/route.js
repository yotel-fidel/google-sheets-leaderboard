// File: pages/api/getSheetDataByTeam.js
import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const teamParam = searchParams.get('team'); // Get the team query parameter

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth: await auth.getClient() });
  const range = "2024!A:BC";

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: range,
    });
    const data = response.data.values;
    const filteredData = extractAndFilterData(data, teamParam);

    return NextResponse.json({ 
      bookedDemsData: filteredData.salesBookedDems,
      bookedMDSData: filteredData.salesBookedMDS
    });
  } catch (error) {
    console.error("Error fetching sheets data: ", error);
    return NextResponse.json({ error: 'Error fetching sheets data' }, { status: 500 });
  }
}

const extractAndFilterData = (data, teamParam) => {
  let salesBookedDemsStart, salesBookedDemsEnd;
  let salesBookedMDSStart, salesBookedMDSEnd;
  let salesBookedDems = [];
  let salesBookedMDS = [];

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

  return { salesBookedDems, salesBookedMDS };
};
