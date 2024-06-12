import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getCurrentWeekAndYear } from '@/app/_utils';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const firstName = searchParams.get('firstName');
  const lastName = searchParams.get('lastName');
  const { currentYear } = getCurrentWeekAndYear();


  if (!firstName || !lastName) {
    return NextResponse.error(new Error('First name and last name are required'), { status: 400 });
  }

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
    const foundBookedDemsRow = extractedData.salesBookedDems.find(row => row.name.toLowerCase().includes(`${firstName} ${lastName}`));
    const foundBookedMDSRow = extractedData.salesBookedMDS.find(row => row.name.toLowerCase().includes(`${firstName} ${lastName}`));
    const foundSatDemsRow = extractedData.salesSatDems.find(row => row.name.toLowerCase().includes(`${firstName} ${lastName}`));
    const foundSatMDSRow = extractedData.salesSatMDS.find(row => row.name.toLowerCase().includes(`${firstName} ${lastName}`));
    const foundSalesSDR = extractedData.salesSDR.find(row => row.name.toLowerCase().includes(`${firstName} ${lastName}`));

    return NextResponse.json({
      bookedDemsData: foundBookedDemsRow,
      bookedMDSData: foundBookedMDSRow,
      satDemsData: foundSatDemsRow,
      satMDSData: foundSatMDSRow,
      salesSDRData: foundSalesSDR
    });
  } catch (error) {
    console.error("Error fetching sheets data: ", error);
    return NextResponse.error(new Error('Error fetching sheets data'), { status: 500 });
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
      total: parseFloat(total.toFixed(2)),
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
      total: parseFloat(total.toFixed(2)),
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
      total: parseFloat(total.toFixed(2)),
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
      total: parseFloat(total.toFixed(2)),
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
      total: parseFloat(total.toFixed(2)),
    });
  }

  return { salesBookedDems, salesBookedMDS, salesSatDems, salesSatMDS, salesSDR };
};