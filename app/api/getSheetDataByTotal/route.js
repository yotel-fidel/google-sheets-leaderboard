import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getCurrentWeekAndYear } from '@/app/_utils';

export async function GET() {
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
    const extractedData = extractData(data);

    // Sort by Total in descending order
    const sortedBookedDemsData = extractedData.salesBookedDems.sort((a, b) => b.total - a.total);
    const sortedBookedMDSData = extractedData.salesBookedMDS.sort((a, b) => b.total - a.total);
    const sortedSatDemsData = extractedData.salesSatDems.sort((a, b) => b.total - a.total);
    const sortedSatMDSData = extractedData.salesSatMDS.sort((a, b) => b.total - a.total);
    const sortedSalesSDRData = extractedData.salesSDR.sort((a, b) => b.total - a.total);

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

const extractData = (data) => {
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
    const [name, profileImg, team, ...salesData] = data[start]
    const total = salesData.reduce((sum, weekSales) => sum + Number(weekSales), 0);

    salesBookedDems.push({
      name,
      profileImg,
      team,
      sales: salesData,
      total,
    });
  }

  start = salesBookedMDSStart;
  end = salesBookedMDSEnd;
  for (; start <= end && start < data.length; start++) {
    const [name, profileImg, team, ...salesData] = data[start]
    const total = salesData.reduce((sum, weekSales) => sum + Number(weekSales), 0);

    salesBookedMDS.push({
      name,
      profileImg,
      team,
      sales: salesData,
      total,
    });
  }

  start = salesSatDemsStart;
  end = salesSatDemsEnd;
  for (; start <= end && start < data.length; start++) {
    const [name, profileImg, team, ...salesData] = data[start]
    const total = salesData.reduce((sum, weekSales) => sum + Number(weekSales), 0);

    salesSatDems.push({
      name,
      profileImg,
      team,
      sales: salesData,
      total,
    });
  }

  start = salesSatMDSStart;
  end = salesSatMDSEnd;
  for (; start <= end && start < data.length; start++) {
    const [name, profileImg, team, ...salesData] = data[start]
    const total = salesData.reduce((sum, weekSales) => sum + Number(weekSales), 0);

    salesSatMDS.push({
      name,
      profileImg,
      team,
      sales: salesData,
      total,
    });
  }

  start = salesSDRStart;
  end = salesSDREnd;
  for (; start <= end && start < data.length; start++) {
    const [name, profileImg, team, ...salesData] = data[start]
    const total = salesData.reduce((sum, weekSales) => {
      const numericValue = parseFloat(weekSales.substring(1).replace(/,/g, '')); // Remove the first character and convert to number
      return sum + numericValue;
    }, 0);

    salesSDR.push({
      name,
      profileImg,
      team,
      sales: salesData,
      total,
    });
  }

  return { salesBookedDems, salesBookedMDS, salesSatDems, salesSatMDS, salesSDR };
};

