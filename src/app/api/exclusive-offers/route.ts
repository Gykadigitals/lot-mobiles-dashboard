import { NextResponse } from 'next/server';
import fs from 'fs';

const FRONTEND_OFFERS_PATH = '/Users/apple/Gyka Digitals /Developer Files /LOT Mobiles /lot-mobiles/src/data/exclusive-offers.ts';

export async function GET() {
  try {
    if (!fs.existsSync(FRONTEND_OFFERS_PATH)) {
      return NextResponse.json({ error: 'Exclusive offers file not found in frontend project.' }, { status: 404 });
    }

    const content = fs.readFileSync(FRONTEND_OFFERS_PATH, 'utf8');
    
    // Extract the object array part
    const match = content.match(/export const EXCLUSIVE_OFFERS: ExclusiveOfferData\[\] = ([\s\S]*);/);
    if (!match || !match[1]) {
      return NextResponse.json({ error: 'Could not parse exclusive offers data' }, { status: 500 });
    }

    const dataString = match[1].trim();
    // Use eval carefully, only because we trust the file content and structure
    const data = eval('(' + dataString + ')');

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading exclusive offers data:', error);
    return NextResponse.json({ error: 'Failed to read exclusive offers data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const fileContent = `export interface ExclusiveOfferData {
  id: string;
  img: string;
  url: string;
}

export const EXCLUSIVE_OFFERS: ExclusiveOfferData[] = ${JSON.stringify(data, null, 2)};
`;

    fs.writeFileSync(FRONTEND_OFFERS_PATH, fileContent, 'utf8');

    return NextResponse.json({ success: true, message: 'Exclusive offers data updated successfully' });
  } catch (error) {
    console.error('Error updating exclusive offers data:', error);
    return NextResponse.json({ error: 'Failed to update exclusive offers data' }, { status: 500 });
  }
}
