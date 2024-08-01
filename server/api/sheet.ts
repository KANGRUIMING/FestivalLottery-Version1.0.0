import { defineEventHandler } from 'h3';
import { google } from 'googleapis';

// 假设你有某种方式解析请求体，实际实现可能有所不同
async function parseBody(request: any): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk: string) => {
      body += chunk; // 接收数据块
    });
    request.on('end', () => {
      try {
        resolve(JSON.parse(body)); // 尝试解析JSON数据
      } catch (error) {
        reject(error); // 解析失败则拒绝Promise
      }
    });
  });
}

// 读取数据的处理器
const readData = async () => {
  // 使用Google认证客户端获取授权
  const auth = await google.auth.getClient({
    credentials: {
      client_id: process.env.GOOGLE_CLIENT_ID!, // Google客户端ID
      client_email: process.env.GOOGLE_CLIENT_EMAIL!, // Google客户端邮箱
      private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'), // 私钥
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'], // 授权范围
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const range = 'I2:J500'; // 数据读取范围
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID!, // 电子表格ID
      range,
    });
    return { data: response.data.values }; // 返回数据
  } catch (error) {
    console.error('The API returned an error: ', error); // 输出错误信息
    throw new Error('Failed to fetch data from Google Sheets'); // 抛出错误
  }
};

// 写入数据的处理器
const writeData = async (request: any) => {
  // 使用Google认证客户端获取授权
  const auth = await google.auth.getClient({
    credentials: {
      client_id: process.env.GOOGLE_CLIENT_ID!, // Google客户端ID
      client_email: process.env.GOOGLE_CLIENT_EMAIL!, // Google客户端邮箱
      private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'), // 私钥
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'], // 授权范围
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const body = await parseBody(request); // 解析传入的请求体

  const range = 'Sheet1'; // 根据需要调整范围
  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.SHEET_ID!, // 电子表格ID
      range,
      valueInputOption: 'USER_ENTERED', // 用户输入选项
      requestBody: {
        values: body.values, // 写入的数据值
      },
    });
    return { success: true }; // 返回成功标志
  } catch (error) {
    console.error('Failed to write to Google Sheets:', error); // 输出错误信息
    throw new Error('Failed to write data to Google Sheets'); // 抛出错误
  }
};

// 定义事件处理器，根据请求方法处理读取或写入操作
export default defineEventHandler(async (event) => {
  if (event.req.method === 'GET') {
    return await readData(); // 处理GET请求，读取数据
  } else if (event.req.method === 'POST') {
    return await writeData(event.req); // 处理POST请求，写入数据
  }
});
