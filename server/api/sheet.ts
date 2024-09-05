import { defineEventHandler } from 'h3';
import { google } from 'googleapis';

// Function to read data from Google Sheets
const readData = async () => {
  const auth = await google.auth.getClient({
    credentials: {
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_email: process.env.GOOGLE_CLIENT_EMAIL!,
      private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const range = 'J2:J500'; // Read only column J

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID!,
      range,
    });
    return { data: response.data.values }; // Return the data from column J
  } catch (error) {
    console.error('The API returned an error: ', error);
    throw new Error('Failed to fetch data from Google Sheets');
  }
};

// Define the event handler for GET requests
export default defineEventHandler(async (event) => {
  if (event.req.method === 'GET') {
    return await readData(); // Handle GET request to read data
  }
});
