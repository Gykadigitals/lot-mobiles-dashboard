import { NextResponse } from 'next/server';
import fs from 'fs';

const FRONTEND_ABOUT_PATH = '/Users/apple/Gyka Digitals /Developer Files /LOT Mobiles /lot-mobiles/src/data/about.ts';

export async function GET() {
  try {
    if (!fs.existsSync(FRONTEND_ABOUT_PATH)) {
      return NextResponse.json({ error: 'About file not found in frontend project.' }, { status: 404 });
    }

    const content = fs.readFileSync(FRONTEND_ABOUT_PATH, 'utf8');
    
    const match = content.match(/export const ABOUT_PAGE_DATA = ([\s\S]*);/);
    if (!match || !match[1]) {
      return NextResponse.json({ error: 'Could not parse about data' }, { status: 500 });
    }

    const dataString = match[1].trim();
    const data = eval('(' + dataString + ')');

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading about data:', error);
    return NextResponse.json({ error: 'Failed to read about data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const fileContent = `export const ABOUT_PAGE_DATA = ${JSON.stringify(data, null, 2)};\n`;

    fs.writeFileSync(FRONTEND_ABOUT_PATH, fileContent, 'utf8');

    return NextResponse.json({ success: true, message: 'About data updated successfully' });
  } catch (error) {
    console.error('Error updating about data:', error);
    return NextResponse.json({ error: 'Failed to update about data' }, { status: 500 });
  }
}
