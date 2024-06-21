// File: pages/api/getSheetDataByTeam.js
import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getCurrentWeekAndYear, addAllValues, convertToStrMoney } from '@/app/_utils';

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
  const range = `${currentYear}!A:BO`;

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: range,
    });
    const data = response.data.values;
    const filteredData = extractAndFilterData(data, teamParam);

    // console.log("data team: ", data)

    // Sort by Total in descending order
    const sortedBookedDemsData = filteredData.salesBookedDems.sort((a, b) => b.total - a.total);
    const sortedBookedMDSData = filteredData.salesBookedMDS.sort((a, b) => b.total - a.total);
    const sortedSatDemsData = filteredData.salesSatDems.sort((a, b) => b.total - a.total);
    const sortedSatMDSData = filteredData.salesSatMDS.sort((a, b) => b.total - a.total);
    const sortedSalesSDRData = filteredData.salesSDR.sort((a, b) => b.total - a.total);

    return NextResponse.json({
      bookedDemsData: sortedBookedDemsData,
      bookedMDSData: sortedBookedMDSData,
      satDemsData: sortedSatDemsData,
      satMDSData: sortedSatMDSData,
      salesSDRData: sortedSalesSDRData
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
  let salesSDRStart, salesSDREnd;
  let salesBookedDems = [];
  let salesBookedMDS = [];
  let salesSatDems = [];
  let salesSatMDS = [];
  let salesSDR = [];

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

    if (data[i][0] === "Sales Start") {
      salesSDRStart = i + 2;
    }

    if (data[i][0] === "Sales End") {
      salesSDREnd = i - 1;
    }
    i++;
  }

  let start = salesBookedDemsStart;
  let end = salesBookedDemsEnd;
  for (; start <= end && start < data.length; start++) {
    const [name, profileImg, team, january, february, march, april, may, june, july, august, september, october, november, december, ...salesData] = data[start];
    const total = salesData.reduce((sum, weekSales) => sum + Number(weekSales), 0);
    const quarter1 = addAllValues(january, february, march);
    const quarter2 = addAllValues(april, may, june);
    const quarter3 = addAllValues(july, august, september);
    const quarter4 = addAllValues(october, november, december);
    if (!teamParam || team.toLowerCase() === teamParam.toLowerCase()) { // Filter by team if specified
      salesBookedDems.push({
        name,
        profileImg,
        team,
        weekly: salesData,
        monthly: [
          january,
          february,
          march,
          april,
          may,
          june,
          july,
          august,
          september,
          october,
          november,
          december,
        ],
        quarterly: [
          "" + quarter1,
          "" + quarter2,
          "" + quarter4,
          "" + quarter4,
        ],
        total: parseFloat(total.toFixed(2)),
      });
    }
  }

  start = salesBookedMDSStart;
  end = salesBookedMDSEnd;
  for (; start <= end && start < data.length; start++) {
    const [name, profileImg, team, january, february, march, april, may, june, july, august, september, october, november, december, ...salesData] = data[start];
    const total = salesData.reduce((sum, weekSales) => sum + Number(weekSales), 0);
    if (!teamParam || team.toLowerCase() === teamParam.toLowerCase()) { // Filter by team if specified
      salesBookedMDS.push({
        name,
        profileImg,
        team,
        weekly: salesData,
        monthly: [
          january,
          february,
          march,
          april,
          may,
          june,
          july,
          august,
          september,
          october,
          november,
          december,
        ],
        quarterly: [
          "" + addAllValues(january, february, march),
          "" + addAllValues(april, may, june),
          "" + addAllValues(july, august, september),
          "" + addAllValues(october, november, december),
        ],
        total: parseFloat(total.toFixed(2)),
      });
    }
  }

  start = salesSatDemsStart;
  end = salesSatDemsEnd;
  for (; start <= end && start < data.length; start++) {
    const [name, profileImg, team, january, february, march, april, may, june, july, august, september, october, november, december, ...salesData] = data[start];
    const total = salesData.reduce((sum, weekSales) => sum + Number(weekSales), 0);
    if (!teamParam || team.toLowerCase() === teamParam.toLowerCase()) { // Filter by team if specified
      salesSatDems.push({
        name,
        profileImg,
        team,
        weekly: salesData,
        monthly: [
          january,
          february,
          march,
          april,
          may,
          june,
          july,
          august,
          september,
          october,
          november,
          december,
        ],
        quarterly: [
          "" + addAllValues(january, february, march),
          "" + addAllValues(april, may, june),
          "" + addAllValues(july, august, september),
          "" + addAllValues(october, november, december),
        ],
        total: parseFloat(total.toFixed(2)),
      });
    }
  }

  start = salesSatMDSStart;
  end = salesSatMDSEnd;
  for (; start <= end && start < data.length; start++) {
    const [name, profileImg, team, january, february, march, april, may, june, july, august, september, october, november, december, ...salesData] = data[start];
    const total = salesData.reduce((sum, weekSales) => sum + Number(weekSales), 0);
    if (!teamParam || team.toLowerCase() === teamParam.toLowerCase()) { // Filter by team if specified
      salesSatMDS.push({
        name,
        profileImg,
        team,
        weekly: salesData,
        monthly: [
          january,
          february,
          march,
          april,
          may,
          june,
          july,
          august,
          september,
          october,
          november,
          december,
        ],
        quarterly: [
          "" + addAllValues(january, february, march),
          "" + addAllValues(april, may, june),
          "" + addAllValues(july, august, september),
          "" + addAllValues(october, november, december),
        ],
        total: parseFloat(total.toFixed(2)),
      });
    }
  }

  start = salesSDRStart;
  end = salesSDREnd;
  for (; start <= end && start < data.length; start++) {
    const [name, profileImg, team, january, february, march, april, may, june, july, august, september, october, november, december, ...salesData] = data[start]
    const total = salesData.reduce((sum, weekSales) => {
      const numericValue = parseFloat(weekSales.substring(1).replace(/,/g, '')); // Remove the first character and convert to number
      return sum + numericValue;
    }, 0);
    if (!teamParam || team.toLowerCase() === teamParam.toLowerCase()) { // Filter by team if specified
      salesSDR.push({
        name,
        profileImg,
        team,
        weekly: salesData,
        monthly: [
          january,
          february,
          march,
          april,
          may,
          june,
          july,
          august,
          september,
          october,
          november,
          december,
        ],
        quarterly: [
          convertToStrMoney("£", addAllValues(january, february, march)),
          convertToStrMoney("£", addAllValues(april, may, june)),
          convertToStrMoney("£", addAllValues(july, august, september)),
          convertToStrMoney("£", addAllValues(october, november, december)),
        ],
        total: parseFloat(total.toFixed(2)),
      });
    }
  }

  return { salesBookedDems, salesBookedMDS, salesSatDems, salesSatMDS, salesSDR };
};
