// File: pages/api/getSheetDataByTeam.js
import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const team = searchParams.get('team'); // Get the team query parameter

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth: await auth.getClient() });
  const range = "2024!A:BB";

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID,
      range: range,
    });
    const data = response.data.values;
    const filteredData = extractAndFilterData(data, team);
    return NextResponse.json(filteredData);
  } catch (error) {
    console.error("Error fetching sheets data: ", error);
    return NextResponse.json({ error: 'Error fetching sheets data' }, { status: 500 });
  }
}

const extractAndFilterData = (data, team) => {
  let salesInfoStart, salesInfoEnd;
  let salesInfo = [];

  let i = 0;
  while (i < data.length) {
    if (data[i][0] === "END") break;

    if (data[i][0] === "Booked Start") {
      salesInfoStart = i + 2;
    }

    if (data[i][0] === "Booked End") {
      salesInfoEnd = i - 1;
    }
    i++;
  }

  let start = salesInfoStart;
  let end = salesInfoEnd;
  for (; start <= end && start < data.length; start++) {
    const [name, category, ...salesData] = data[start];
    if (!team || category === team) { // Filter by team if specified
      salesInfo.push({
        name,
        category,
        sales: salesData,
      });
    }
  }

  return { salesInfo };
};
