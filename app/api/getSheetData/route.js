import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth: await auth.getClient() });
  const range = "2024!A:BB";

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: range,
    });
    const data = response.data.values
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching sheets data: ", error);
    return NextResponse.json({ error: 'Error fetching sheets data' }, { status: 500 });
  }
}

const extractData = (data) => {
  let salesInfoStart, salesInfoEnd;
  let salesInfo = [];

  let i = 0;
  while (true) {
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
  for (; start <= end; start++) {
    salesInfo.push({
      name: data[start][0],
      team: data[start][1],
    });
  }

  return { salesInfo };
};
