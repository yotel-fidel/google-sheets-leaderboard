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

    return NextResponse.json({
      bookedDemsData: foundBookedDemsRow,
      bookedMDSData: foundBookedMDSRow
    });
  } catch (error) {
    console.error("Error fetching sheets data: ", error);
    return NextResponse.error(new Error('Error fetching sheets data'), { status: 500 });
  }
}

const extractData = (data) => {
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

  return { salesBookedDems, salesBookedMDS };
};