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
      countdownIncentiveDate: filteredData.countdownIncentiveDate,
      bookedDemsData: sortedBookedDemsData,
      bookedMDSData: sortedBookedMDSData,
      satDemsData: sortedSatDemsData,
      satMDSData: sortedSatMDSData,
      salesSDRData: sortedSalesSDRData,
      targetSalesSDRData: filteredData.targetSalesSDR,
      total: filteredData.total
    });
  } catch (error) {
    console.error("Error fetching sheets data: ", error);
    return NextResponse.json({ error: 'Error fetching sheets data' }, { status: 500 });
  }
}

const extractAndFilterData = (data, teamParam) => {
  let countdownIncentiveDate;

  let salesBookedDemsStart, salesBookedDemsEnd;
  let salesBookedMDSStart, salesBookedMDSEnd;
  let salesSatDemsStart, salesSatDemsEnd;
  let salesSatMDSStart, salesSatMDSEnd;
  let salesSDRStart, salesSDREnd;
  let targetSalesSDRStart, targetSalesSDREnd;
  let salesBookedDems = [];
  let salesBookedMDS = [];
  let salesSatDems = [];
  let salesSatMDS = [];
  let salesSDR = [];
  let targetSalesSDR = [];

  let total = {};

  let i = 0;
  while (i < data.length) {
    if (data[i][0] === "END") break;

    if (data[i][0] === "Countdown Incentive Date") {
      countdownIncentiveDate = data[i][1] + " " + data[i][2];
    }

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

    if (data[i][0] === "Target Sales Start") {
      targetSalesSDRStart = i + 2;
    }

    if (data[i][0] === "Target Sales End") {
      targetSalesSDREnd = i - 1;
    }
    i++;
  }

  let start = salesBookedDemsStart;
  let end = salesBookedDemsEnd;
  const salesBookedDemsTotal = {
    weekly: Array.from({ length: 52 }, () => 0),
    monthly: Array.from({ length: 12 }, () => 0),
    quarterly: Array.from({ length: 4 }, () => 0),
  };
  for (; start <= end && start < data.length; start++) {
    const [name, profileImg, team, january, february, march, april, may, june, july, august, september, october, november, december, ...salesData] = data[start];
    const total = salesData.reduce((sum, weekSales) => {
      const sales = isNaN(Number(weekSales)) ? 0 : Number(weekSales);
      return sum + sales;
    }, 0);
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
          "" + quarter3,
          "" + quarter4,
        ],
        total: parseFloat(total.toFixed(2)),
      });

      salesData.forEach((weekSales, index) => {
        if (index < 52) {
          salesBookedDemsTotal.weekly[index] += isNaN(Number(weekSales)) ? 0 : Number(weekSales);
        }
      });

      // Add to salesBookedDemsTotal.monthly
      const months = [january, february, march, april, may, june, july, august, september, october, november, december];
      months.forEach((monthSales, index) => {
        salesBookedDemsTotal.monthly[index] += isNaN(Number(monthSales)) ? 0 : Number(monthSales);
      });

      // Add to salesBookedDemsTotal.quarterly
      const quarters = [
        quarter1, quarter2, quarter3, quarter4
      ];
      quarters.forEach((quarterSales, index) => {
        salesBookedDemsTotal.quarterly[index] += isNaN(Number(quarterSales)) ? 0 : Number(quarterSales);
      });
    }
  }

  total.salesBookedDems = salesBookedDemsTotal;

  start = salesBookedMDSStart;
  end = salesBookedMDSEnd;
  const salesBookedMDSTotal = {
    weekly: Array.from({ length: 52 }, () => 0),
    monthly: Array.from({ length: 12 }, () => 0),
    quarterly: Array.from({ length: 4 }, () => 0),
  };
  for (; start <= end && start < data.length; start++) {
    const [name, profileImg, team, january, february, march, april, may, june, july, august, september, october, november, december, ...salesData] = data[start];
    const total = salesData.reduce((sum, weekSales) => {
      const sales = isNaN(Number(weekSales)) ? 0 : Number(weekSales);
      return sum + sales;
    }, 0);
    const quarter1 = addAllValues(january, february, march);
    const quarter2 = addAllValues(april, may, june);
    const quarter3 = addAllValues(july, august, september);
    const quarter4 = addAllValues(october, november, december);
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
          "" + quarter1,
          "" + quarter2,
          "" + quarter3,
          "" + quarter4,
        ],
        total: parseFloat(total.toFixed(2)),
      });

      salesData.forEach((weekSales, index) => {
        if (index < 52) {
          salesBookedMDSTotal.weekly[index] += isNaN(Number(weekSales)) ? 0 : Number(weekSales);
        }
      });

      const months = [january, february, march, april, may, june, july, august, september, october, november, december];
      months.forEach((monthSales, index) => {
        salesBookedMDSTotal.monthly[index] += isNaN(Number(monthSales)) ? 0 : Number(monthSales);
      });

      const quarters = [
        quarter1, quarter2, quarter3, quarter4
      ];
      quarters.forEach((quarterSales, index) => {
        salesBookedMDSTotal.quarterly[index] += isNaN(Number(quarterSales)) ? 0 : Number(quarterSales);
      });
    }
  }

  total.salesBookedMDS = salesBookedMDSTotal;

  start = salesSatDemsStart;
  end = salesSatDemsEnd;
  const salesSatDemsTotal = {
    weekly: Array.from({ length: 52 }, () => 0),
    monthly: Array.from({ length: 12 }, () => 0),
    quarterly: Array.from({ length: 4 }, () => 0),
  };
  for (; start <= end && start < data.length; start++) {
    const [name, profileImg, team, january, february, march, april, may, june, july, august, september, october, november, december, ...salesData] = data[start];
    const total = salesData.reduce((sum, weekSales) => {
      const sales = isNaN(Number(weekSales)) ? 0 : Number(weekSales);
      return sum + sales;
    }, 0);
    const quarter1 = addAllValues(january, february, march);
    const quarter2 = addAllValues(april, may, june);
    const quarter3 = addAllValues(july, august, september);
    const quarter4 = addAllValues(october, november, december);
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
          "" + quarter1,
          "" + quarter2,
          "" + quarter3,
          "" + quarter4,
        ],
        total: parseFloat(total.toFixed(2)),
      });

      salesData.forEach((weekSales, index) => {
        if (index < 52) {
          salesSatDemsTotal.weekly[index] += isNaN(Number(weekSales)) ? 0 : Number(weekSales);
        }
      });

      const months = [january, february, march, april, may, june, july, august, september, october, november, december];
      months.forEach((monthSales, index) => {
        salesSatDemsTotal.monthly[index] += isNaN(Number(monthSales)) ? 0 : Number(monthSales);
      });

      const quarters = [
        quarter1, quarter2, quarter3, quarter4
      ];
      quarters.forEach((quarterSales, index) => {
        salesSatDemsTotal.quarterly[index] += isNaN(Number(quarterSales)) ? 0 : Number(quarterSales);
      });
    }
  }

  total.salesSatDems = salesSatDemsTotal;

  start = salesSatMDSStart;
  end = salesSatMDSEnd;
  const salesSatMDSTotal = {
    weekly: Array.from({ length: 52 }, () => 0),
    monthly: Array.from({ length: 12 }, () => 0),
    quarterly: Array.from({ length: 4 }, () => 0),
  };
  for (; start <= end && start < data.length; start++) {
    const [name, profileImg, team, january, february, march, april, may, june, july, august, september, october, november, december, ...salesData] = data[start];
    const total = salesData.reduce((sum, weekSales) => {
      const sales = isNaN(Number(weekSales)) ? 0 : Number(weekSales);
      return sum + sales;
    }, 0);
    const quarter1 = addAllValues(january, february, march);
    const quarter2 = addAllValues(april, may, june);
    const quarter3 = addAllValues(july, august, september);
    const quarter4 = addAllValues(october, november, december);
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
          "" + quarter1,
          "" + quarter2,
          "" + quarter3,
          "" + quarter4,
        ],
        total: parseFloat(total.toFixed(2)),
      });

      salesData.forEach((weekSales, index) => {
        if (index < 52) {
          salesSatMDSTotal.weekly[index] += isNaN(Number(weekSales)) ? 0 : Number(weekSales);
        }
      });

      const months = [january, february, march, april, may, june, july, august, september, october, november, december];
      months.forEach((monthSales, index) => {
        salesSatMDSTotal.monthly[index] += isNaN(Number(monthSales)) ? 0 : Number(monthSales);
      });

      const quarters = [
        quarter1, quarter2, quarter3, quarter4
      ];
      quarters.forEach((quarterSales, index) => {
        salesSatMDSTotal.quarterly[index] += isNaN(Number(quarterSales)) ? 0 : Number(quarterSales);
      });
    }
  }

  total.salesSatMDS = salesSatMDSTotal;

  start = salesSDRStart;
  end = salesSDREnd;
  const salesSDRTotal = {
    weekly: Array.from({ length: 52 }, () => 0),
    monthly: Array.from({ length: 12 }, () => 0),
    quarterly: Array.from({ length: 4 }, () => 0),
  };
  for (; start <= end && start < data.length; start++) {
    const [name, profileImg, team, january, february, march, april, may, june, july, august, september, october, november, december, ...salesData] = data[start]
    const total = salesData.reduce((sum, weekSales) => {
      let numericValue = parseFloat(weekSales.toString().replace(/[$£€,]/g, ''));

      if (isNaN(numericValue)) {
        numericValue = 0;
      }

      return sum + numericValue;
    }, 0);
    const quarter1 = addAllValues(january, february, march);
    const quarter2 = addAllValues(april, may, june);
    const quarter3 = addAllValues(july, august, september);
    const quarter4 = addAllValues(october, november, december);
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
          convertToStrMoney("£", quarter1),
          convertToStrMoney("£", quarter2),
          convertToStrMoney("£", quarter3),
          convertToStrMoney("£", quarter4),
        ],
        total: parseFloat(total.toFixed(2)),
      });

      salesData.forEach((weekSales, index) => {
        if (index < 52) {
          salesSDRTotal.weekly[index] += addAllValues(weekSales);
        }
      });

      const months = [january, february, march, april, may, june, july, august, september, october, november, december];
      months.forEach((monthSales, index) => {
        salesSDRTotal.monthly[index] += addAllValues(monthSales);
      });

      const quarters = [
        quarter1, quarter2, quarter3, quarter4
      ];
      quarters.forEach((quarterSales, index) => {
        salesSDRTotal.quarterly[index] += addAllValues(quarterSales);
      });
    }
  }

  total.salesSDR = salesSDRTotal;

  start = targetSalesSDRStart;
  end = targetSalesSDREnd;
  const targetSalesSDRTotal = {
    weekly: Array.from({ length: 52 }, () => 0),
    monthly: Array.from({ length: 12 }, () => 0),
    quarterly: Array.from({ length: 4 }, () => 0),
  };
  for (; start <= end && start < data.length; start++) {
    const [name, profileImg, team, january, february, march, april, may, june, july, august, september, october, november, december, ...salesData] = data[start]
    const total = salesData.reduce((sum, weekSales) => {
      let numericValue = parseFloat(weekSales.toString().replace(/[$£€,]/g, ''));

      if (isNaN(numericValue)) {
        numericValue = 0;
      }

      return sum + numericValue;
    }, 0);
    const quarter1 = addAllValues(january, february, march);
    const quarter2 = addAllValues(april, may, june);
    const quarter3 = addAllValues(july, august, september);
    const quarter4 = addAllValues(october, november, december);
    if (!teamParam || team.toLowerCase() === teamParam.toLowerCase()) { // Filter by team if specified
      targetSalesSDR.push({
        name,
        profileImg,
        team,
        weekly: Array.from({ length: 52 }, () => "£0"),
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
          convertToStrMoney("£", quarter1),
          convertToStrMoney("£", quarter2),
          convertToStrMoney("£", quarter3),
          convertToStrMoney("£", quarter4),
        ],
        total: parseFloat(total.toFixed(2)),
      });

      salesData.forEach((weekSales, index) => {
        if (index < 52) {
          targetSalesSDRTotal.weekly[index] += addAllValues(weekSales);
        }
      });

      const months = [january, february, march, april, may, june, july, august, september, october, november, december];
      months.forEach((monthSales, index) => {
        targetSalesSDRTotal.monthly[index] += addAllValues(monthSales);
      });

      const quarters = [
        quarter1, quarter2, quarter3, quarter4
      ];
      quarters.forEach((quarterSales, index) => {
        targetSalesSDRTotal.quarterly[index] += addAllValues(quarterSales);
      });
    }
  }

  total.targetSalesSDR = targetSalesSDRTotal;

  return { countdownIncentiveDate, salesBookedDems, salesBookedMDS, salesSatDems, salesSatMDS, salesSDR, targetSalesSDR, total };
};
