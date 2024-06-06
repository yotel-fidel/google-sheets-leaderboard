import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET() {
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
    const extractedData = extractData(data);
    
    // Sort by Total in descending order
    const sortedData = extractedData.salesInfo.sort((a, b) => b.total - a.total);

    return NextResponse.json({ salesInfo: sortedData });
  } catch (error) {
    console.error("Error fetching sheets data: ", error);
    return NextResponse.json({ error: 'Error fetching sheets data' }, { status: 500 });
  }
}

const extractData = (data) => {
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
    const [name, team, ...salesData] = data[start]
    const total = salesData.reduce((sum, weekSales) => sum + Number(weekSales), 0);

    salesInfo.push({
      name,
      team,
      sales: salesData,
      total,
    });
  }

  return { salesInfo };
};

