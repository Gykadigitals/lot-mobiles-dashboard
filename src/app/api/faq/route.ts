import { NextResponse } from 'next/server';
import fs from 'fs';

const FRONTEND_FILE_PATH = '/Users/apple/Gyka Digitals /Developer Files /LOT Mobiles /lot-mobiles/src/data/faq.ts';

export async function GET() {
  try {
    if (!fs.existsSync(FRONTEND_FILE_PATH)) {
      return NextResponse.json({ error: 'Data file not found in frontend project.' }, { status: 404 });
    }

    const content = fs.readFileSync(FRONTEND_FILE_PATH, 'utf8');
    
    // Extract the object part: export const faqData: FAQData = { ... };
    const match = content.match(/export const faqData: FAQData = ([\s\S]*);/);
    if (!match || !match[1]) {
      return NextResponse.json({ error: 'Could not parse data' }, { status: 500 });
    }

    const dataString = match[1].trim();
    // Use eval carefully, only because we trust the file content and structure
    const data = eval('(' + dataString + ')');

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const fileContent = `export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export interface FAQData {
  items: FAQItem[];
}

export const faqData: FAQData = ${JSON.stringify(data, null, 2)};
`;

    fs.writeFileSync(FRONTEND_FILE_PATH, fileContent, 'utf8');

    return NextResponse.json({ success: true, message: 'Data updated successfully' });
  } catch (error) {
    console.error('Error updating data:', error);
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}
