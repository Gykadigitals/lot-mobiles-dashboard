import { NextResponse } from 'next/server';
import fs from 'fs';

const FRONTEND_ADS_PATH = '/Users/apple/Gyka Digitals /Developer Files /LOT Mobiles /lot-mobiles/src/data/ads.ts';

export async function GET() {
  try {
    if (!fs.existsSync(FRONTEND_ADS_PATH)) {
      return NextResponse.json({ error: 'Ads file not found in frontend project.' }, { status: 404 });
    }

    const content = fs.readFileSync(FRONTEND_ADS_PATH, 'utf8');
    
    // Extract the object array part
    const match = content.match(/export const ADS_DATA: AdData\[\] = ([\s\S]*);/);
    if (!match || !match[1]) {
      return NextResponse.json({ error: 'Could not parse ads data' }, { status: 500 });
    }

    const dataString = match[1].trim();
    // Use eval carefully, only because we trust the file content and structure
    const data = eval('(' + dataString + ')');

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading ads data:', error);
    return NextResponse.json({ error: 'Failed to read ads data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const fileContent = `export interface AdData {
  id: string;
  image: string;
  alt: string;
  url: string;
}

export const ADS_DATA: AdData[] = ${JSON.stringify(data, null, 2)};
`;

    fs.writeFileSync(FRONTEND_ADS_PATH, fileContent, 'utf8');

    return NextResponse.json({ success: true, message: 'Ads data updated successfully' });
  } catch (error) {
    console.error('Error updating ads data:', error);
    return NextResponse.json({ error: 'Failed to update ads data' }, { status: 500 });
  }
}
