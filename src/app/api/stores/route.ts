import { NextResponse } from 'next/server';
import fs from 'fs';

const FRONTEND_STORES_PATH = '/Users/apple/Gyka Digitals /Developer Files /LOT Mobiles /lot-mobiles/src/data/stores.ts';

export async function GET() {
  try {
    if (!fs.existsSync(FRONTEND_STORES_PATH)) {
      return NextResponse.json({ error: 'Stores file not found in frontend project.' }, { status: 404 });
    }

    const content = fs.readFileSync(FRONTEND_STORES_PATH, 'utf8');
    
    // Extract the object array part
    const match = content.match(/export const stores: StoreLocation\[\] = ([\s\S]*);/);
    if (!match || !match[1]) {
      return NextResponse.json({ error: 'Could not parse stores data' }, { status: 500 });
    }

    const dataString = match[1].trim();
    // Use eval carefully, only because we trust the file content and structure
    const data = eval('(' + dataString + ')');

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading stores data:', error);
    return NextResponse.json({ error: 'Failed to read stores data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const fileContent = `export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  lat: number;
  lng: number;
  city: string;
  rating?: number;
  image?: string;
}

export const stores: StoreLocation[] = ${JSON.stringify(data, null, 2)};
`;

    fs.writeFileSync(FRONTEND_STORES_PATH, fileContent, 'utf8');

    return NextResponse.json({ success: true, message: 'Stores data updated successfully' });
  } catch (error) {
    console.error('Error updating stores data:', error);
    return NextResponse.json({ error: 'Failed to update stores data' }, { status: 500 });
  }
}
